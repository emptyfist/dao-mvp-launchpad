import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import { constants, Contract, utils } from 'ethers';
import React, { useEffect, useState, useRef } from 'react';
import ReactModal from 'react-modal';
import { Range, getTrackBackground } from 'react-range';
import ReactTooltip from 'react-tooltip';
import { SimpleButton } from '../reusable';
import { calculateMargin } from '../../web3/utils';
import config from '../../config/config';
import { MEMBERSHIP_STATUS } from '../../config/constants';
import TierFactoryABI from '../../config/abi/TierFactory.json';
import { convertGuidToBytes16, formatterFloat, formatterInt, parseMetamaskError } from '../../helpers/functions';
import { useDebounce } from '../../hooks';
import { Cross, InfoMark2 } from '../../assets/icons';
import { Loading3Dot } from '../../assets/loading';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useModalContext } from '../../context/modal/ModalState';

const Slider = ({ values, setValues, minValue, maxValue, isDisabled = false }) => {
    return (
        <Range
            disabled={isDisabled}
            values={values}
            step={0.1}
            min={minValue ?? 0}
            max={maxValue ?? 100}
            onChange={(value) => setValues(value)}
            renderTrack={({ props, children }) => (
                <div
                    onMouseDown={props.onMouseDown}
                    onTouchStart={props.onTouchStart}
                    style={{
                        ...props.style,
                        height: '36px',
                        display: 'flex',
                        width: '100%',
                        padding: '0px 10px',
                    }}
                >
                    <div
                        ref={props.ref}
                        style={{
                            height: '4px',
                            width: '100%',
                            borderRadius: '32px',
                            boxShadow: 'inset 0px 2px 8px rgba(0, 0, 0, 0.08)',
                            background: getTrackBackground({
                                values: values,
                                colors: ['#11A3B7', '#11A3B7'],
                                min: minValue ?? 0,
                                max: maxValue ?? 100,
                            }),
                            alignSelf: 'center',
                        }}
                    >
                        {children}
                    </div>
                </div>
            )}
            renderThumb={({ props, isDragged }) => (
                <div
                    {...props}
                    style={{
                        ...props.style,
                        height: '20px',
                        width: '20px',
                        borderRadius: '100px',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                />
            )}
        />
    );
};

const UpgradeNFT = (props) => {
    const { modal, closeModal, openModal, modalData, setModalData } = useModalContext();
    const { account, activeProvider, otaBalance, personalInfo, publicInfo, tiersInfo, updateOTABalance } =
        useGlobalContext();
    const [slippage, setSlippage] = useState([0]);
    const [isApproved, setApproved] = useState(false);
    const [isMinting, setMinting] = useState(false);
    const [tierPrice, setTierPrice] = useState(0);
    const [isUpdated, setUpdated] = useState(false);
    const isMounted = useRef(true);

    const slipTerm = useDebounce({ value: slippage, delay: 500 });

    const onClose = () => {
        closeModal('upgradeNFT');
    };

    const onNoticeModal = () => {
        // closeModal('upgradeNFT');
        openModal('importantNotice');
    };

    const nextTier = () => {
        return tiersInfo[personalInfo.membershipStatus + 1];
    };

    const currentTier = () => {
        return tiersInfo[personalInfo.membershipStatus];
    };

    useEffect(() => {
        if (!modal.upgradeNFT || !account || !activeProvider || !publicInfo.tokenAddress) return;

        updateOTABalance();

        if (!publicInfo.tierFactoryAddress) return;

        (async () => {
            try {
                const erc20Contract = new Contract(
                    publicInfo.tokenAddress,
                    config.abis.erc20,
                    activeProvider.getSigner()
                );
                const userAllowance = await erc20Contract.allowance(account, publicInfo.tierFactoryAddress);

                isMounted.current && setApproved(+utils.formatUnits(userAllowance) > 0);
            } catch (error) {
                console.log(error);
            }
        })();

        (async () => {
            let nextTierPrice = 0;
            try {
                const tierFactoryContract = new Contract(
                    publicInfo.tierFactoryAddress,
                    TierFactoryABI,
                    activeProvider.getSigner()
                );
                const maxTierIndex = await tierFactoryContract.getHighestTierIndex();
                if (+maxTierIndex >= +personalInfo.membershipStatus)
                    nextTierPrice = await tierFactoryContract.getCurrentPrice(convertGuidToBytes16(nextTier().id));

                if (
                    !nextTier().basePrice ||
                    +utils.formatUnits(nextTierPrice) !== +utils.formatUnits(nextTier().basePrice)
                ) {
                    setUpdated(true);
                    setTimeout(() => {
                        setUpdated(false);
                    }, 10 * 1000);
                }
            } catch (error) {
                console.log(error);
            }

            isMounted.current && setTierPrice(+utils.formatUnits(nextTierPrice));
        })();
        // eslint-disable-next-line
    }, [
        publicInfo.tierFactoryAddress,
        publicInfo.tokenAddress,
        modal.upgradeNFT,
        account,
        activeProvider,
        personalInfo.membershipStatus,
    ]);

    useEffect(() => {
        if (!modalData?.isMint) return;
        mintNFT();
        // eslint-disable-next-line
    }, [modalData]);

    const mintNFT = async () => {
        setMinting(true);

        let canMint = isApproved,
            result = false;
        if (!isApproved) canMint = await approve();
        if (canMint) result = await buyNFT();

        if (canMint && !isApproved) setApproved(true);
        setMinting(false);
        setModalData({ isMint: false });

        if (result) {
            onClose();
            updateOTABalance();
        }
    };

    const buyNFT = async () => {
        // const valu = parseUnits((tierPrice * (1 + slipTerm / 100)).toFixed(3));
        // console.log('value', formatUnits(valu));

        if (
            personalInfo.membershipStatus !== MEMBERSHIP_STATUS.Visitor &&
            !tiersInfo[personalInfo.membershipStatus]?.tierAddress
        ) {
            toast.error('Tier address is not correct!');
            setMinting(false);
            setModalData({ isMint: false });
            return;
        }

        try {
            const tierFactoryContract = new Contract(
                publicInfo.tierFactoryAddress,
                TierFactoryABI,
                activeProvider.getSigner()
            );
            if (personalInfo.membershipStatus !== MEMBERSHIP_STATUS.Visitor) {
                const nftContract = new Contract(
                    tiersInfo[personalInfo.membershipStatus].tierAddress,
                    config.abis.erc721,
                    activeProvider.getSigner()
                );
                const take = await nftContract.setApprovalForAll(publicInfo.tierFactoryAddress, true);
                await take.wait();
            }

            const take = await tierFactoryContract.buyTierNft(
                utils.parseUnits((tierPrice * (1 + slipTerm / 100)).toFixed(3))
            );
            await take.wait();

            toast.success('Successfully minted NFT');

            return true;
        } catch (error) {
            console.log('Mint NFT', error);
            toast.error(parseMetamaskError(error.message));

            return false;
        }
    };

    const approve = async () => {
        try {
            let useExact = false;
            const erc20Contract = new Contract(publicInfo.tokenAddress, config.abis.erc20, activeProvider.getSigner());
            const estimatedGas = await erc20Contract.estimateGas
                .approve(publicInfo.tierFactoryAddress, constants.MaxUint256)
                .catch(() => {
                    useExact = true;
                    return erc20Contract.approve(
                        publicInfo.tierFactoryAddress,
                        utils.parseUnits((tierPrice * (1 + slipTerm / 100)).toFixed(3))
                    );
                });

            const approve = await erc20Contract.approve(
                publicInfo.tierFactoryAddress,
                useExact ? (tierPrice * (1 + slipTerm / 100)).toFixed(3) : constants.MaxUint256,
                {
                    gasLimit: calculateMargin(estimatedGas),
                }
            );

            await approve.wait();

            toast.success('Successfully approved OTA');
            return true;
        } catch (error) {
            console.log('Apporve OTA', error);
            toast.error(parseMetamaskError(error.message));
            return false;
        }
    };

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        <SkeletonTheme baseColor="#070D1D22" highlightColor="#070D1D80">
            <ReactModal
                {...props}
                ariaHideApp={false}
                isOpen={modal.upgradeNFT}
                overlayClassName="modal-overlay"
                className="modal-content upgradeNFT-modal"
            >
                <h2 className="header">
                    {`${personalInfo.membershipStatus === MEMBERSHIP_STATUS.Visitor ? 'Mint' : 'Upgrade'} ${
                        nextTier().name
                    } NFT`}
                    <br />
                    <p>
                        {personalInfo.membershipStatus === MEMBERSHIP_STATUS.Visitor
                            ? ''
                            : `Your existing ${currentTier().name} NFT will be burned`}
                    </p>
                </h2>
                <div className="content">
                    <button className="mint-close-button" type="button" onClick={onClose} disabled={isMinting}>
                        <Cross />
                    </button>
                    <div className="content-info">
                        <img src={nextTier().logo} alt={nextTier().name} style={{ margin: '1rem 0', width: '200px' }} />
                        <span className="title">PRICE</span>
                        <div className="price">
                            {tierPrice <= 0 ? (
                                <Skeleton height={30} width={150} />
                            ) : (
                                <>
                                    {formatterFloat.format(tierPrice)} {publicInfo.tickerSymbol ?? 'TBA'}
                                    {slipTerm > 0 && (
                                        <span className="slip">
                                            {`+${formatterFloat.format(
                                                (tierPrice * slipTerm) / 100
                                            )} (${formatterInt.format(slipTerm)}%)`}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                        <span className="balance">
                            Balance:{' '}
                            {!publicInfo.tokenAddress
                                ? 'TBA'
                                : account
                                ? `${formatterFloat.format(otaBalance)} ${publicInfo.tickerSymbol}`
                                : `0 ${publicInfo.tickerSymbol}`}
                        </span>

                        <div className="slippage-container">
                            <div className="slippage-title">
                                <div className="slippage-info-wrapper">
                                    <span>Set slippage</span>
                                    <button data-tip data-for="slipTip">
                                        <InfoMark2 fill={'#11A3B7'} data-tip data-for="slipTip" />
                                    </button>
                                    <ReactTooltip
                                        className="slip-tooltip"
                                        id="slipTip"
                                        place="right"
                                        effect="solid"
                                        delayHide={100}
                                    >
                                        Your mint transaction will revert if the price changes unfavorably by more than
                                        this percentage.
                                    </ReactTooltip>
                                </div>
                                {isUpdated && <span className="price-updated-alert">Price updated</span>}
                            </div>
                            <div className="slippage-slider">
                                <Slider
                                    values={slippage}
                                    setValues={setSlippage}
                                    minValue={0}
                                    maxValue={20}
                                    isDisabled={isMinting}
                                />
                            </div>
                            <div className="slippage-title percentage">
                                <span>0%</span>
                                <span>20%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-footer">
                    <SimpleButton
                        className="mint-button"
                        clickHandler={onNoticeModal}
                        isDisabled={tierPrice <= 0 || otaBalance <= tierPrice || isMinting}
                    >
                        {`Mint${isMinting ? 'ing' : ''}`}
                        {isMinting && (
                            <div className="spinner-wrapper">
                                <Loading3Dot width={32} height={32} />
                            </div>
                        )}
                    </SimpleButton>
                    <button className="get-token" type="button" onClick={onClose} disabled={isMinting}>
                        {`Get ${publicInfo.tickerSymbol ?? 'TBA'}`}
                    </button>
                </div>
            </ReactModal>
        </SkeletonTheme>
    );
};

export default UpgradeNFT;
