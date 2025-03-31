import clsx from 'clsx';
import toast from 'react-hot-toast';
import abiDecoder from 'abi-decoder';
import { useNavigate } from 'react-router-dom';
import { Contract, utils } from 'ethers';
import React, { useEffect, useState } from 'react';
import { SimpleButton } from '../reusable';
import { formatterFloat, getProperABI, parseMetamaskError } from '../../helpers/functions';
import PrivateSaleABI from '../../config/abi/PrivateSale.json';
import UnlimitedSaleABI from '../../config/abi/UnlimitedSale.json';
import TierBasedSaleABI from '../../config/abi/TierBasedSale.json';
import IntervalVestingABI from '../../config/abi/IntervalVesting.json';
import { Loading3Dot } from '../../assets/loading';
import { fetchWrapper } from '../../helpers/fetch-wrapper';
import {
    SALE_GOING_STATUS,
    SALE_STATUS,
    SALE_TYPE,
    CONTROL_BUTTON_STATUS,
    KYC_STATUS,
    MEMBERSHIP_STATUS,
} from '../../config/constants';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useModalContext } from '../../context/modal/ModalState';
import { useTimerContext } from '../../context/timer/TimerState';
import { useSaleContext } from '../../context/sale/SaleState';

abiDecoder.addABI(IntervalVestingABI);
abiDecoder.addABI(PrivateSaleABI);
abiDecoder.addABI(UnlimitedSaleABI);
abiDecoder.addABI(TierBasedSaleABI);

const ControlButton = ({ clickHandler, isPreview = false, data = null, ...rest }) => {
    let navigate = useNavigate();
    const { currentTime } = useTimerContext();
    const { account, activeProvider, isValidWallet, kycStatus, personalInfo, publicInfo } = useGlobalContext();
    const { openModal, setModalData } = useModalContext();
    const { salePublic, getCurrentSaleStatus, controlButtonStatus, setControlButtonStatus } = useSaleContext();
    const [btnInfo, setBtnInfo] = useState({ firstText: '', secondText: '', clickable: false, disabled: false });

    const setRoundData = (step) => {
        if (!salePublic.isWhitelisted) {
            setBtnInfo({
                firstText: 'Address not whitelisted',
                secondText: "You didn't make this whitelist",
                clickable: false,
            });
            return;
        }

        if (step === 1) {
            if (
                +utils.formatUnits(salePublic.allocation, salePublic.paymentTokenDecimals) >
                +utils.formatUnits(salePublic.contribution, salePublic.paymentTokenDecimals)
            ) {
                setBtnInfo({
                    firstText:
                        controlButtonStatus === 0
                            ? 'Contribute'
                            : controlButtonStatus === CONTROL_BUTTON_STATUS.Approving
                            ? 'Approving'
                            : 'Contributing',
                    secondText: `Your remaining allocation: ${formatterFloat.format(
                        +utils.formatUnits(salePublic.allocation, salePublic.paymentTokenDecimals) -
                            +utils.formatUnits(salePublic.contribution, salePublic.paymentTokenDecimals)
                    )} ${salePublic.paymentTokenSymbol ?? 'TBA'}`,
                    clickable: true,
                });
            } else {
                setBtnInfo({
                    firstText: `Contributed: ${formatterFloat.format(
                        utils.formatUnits(salePublic.contribution, salePublic.paymentTokenDecimals)
                    )}`,
                    secondText: `Your remaining allocation: 0 ${salePublic.paymentTokenSymbol ?? 'TBA'}`,
                    clickable: false,
                });
            }
        } else if (step === 2 || step === 3) {
            setBtnInfo({
                firstText:
                    controlButtonStatus === 0
                        ? 'Contribute'
                        : controlButtonStatus === CONTROL_BUTTON_STATUS.Approving
                        ? 'Approving'
                        : 'Contributing',
                secondText: `Contributed: ${formatterFloat.format(
                    utils.formatUnits(salePublic.contribution, salePublic.paymentTokenDecimals)
                )} ${salePublic.paymentTokenSymbol ?? 'TBA'}`,
                clickable: true,
            });
        } else {
            setBtnInfo({
                firstText: 'Sale is complete',
                secondText: `Wait until the token claiming starts`,
                clickable: false,
            });
        }
    };

    useEffect(() => {
        if (isPreview) {
            const secondText =
                data?.status === SALE_GOING_STATUS.Ongoing
                    ? 'Click here more details'
                    : data?.status === SALE_GOING_STATUS.Upcoming
                    ? 'Coming soon'
                    : 'Sale is completed';
            setBtnInfo({ firstText: 'See more', secondText, clickable: true });
            return;
        }

        if (!account || !isValidWallet) {
            setBtnInfo({
                firstText: 'Connect Wallet',
                secondText: 'You need to connect wallet',
                clickable: true,
                disabled: false,
            });
            return;
        }

        switch (getCurrentSaleStatus(currentTime)) {
            case SALE_STATUS.New:
                setBtnInfo({
                    firstText: 'Coming soon',
                    secondText: 'Whitelist will open soon',
                    clickable: false,
                });
                break;
            case SALE_STATUS.Open:
                if (kycStatus === KYC_STATUS.NONE || kycStatus === KYC_STATUS.UNVERIFIED) {
                    setBtnInfo({
                        firstText: 'Verify KYC',
                        secondText: 'Need verified KYC to participate',
                        clickable: true,
                    });
                    return;
                } else if (kycStatus === KYC_STATUS.FAILED) {
                    setBtnInfo({
                        firstText: 'Resubmit KYC',
                        secondText: 'Your KYC verification failed',
                        clickable: true,
                    });
                    return;
                } else if (kycStatus === KYC_STATUS.VERIFYING) {
                    setBtnInfo({
                        firstText: 'Verifying KYC...',
                        secondText: 'Your KYC information is being reviewed',
                        clickable: true,
                    });
                    return;
                }

                if (
                    salePublic.type === SALE_TYPE.TierBased &&
                    personalInfo.membershipStatus === MEMBERSHIP_STATUS.Visitor
                ) {
                    setBtnInfo({
                        firstText: 'Become a Member',
                        secondText: 'You need a Membership to participate',
                        clickable: true,
                    });
                    return;
                }

                if (salePublic.isApplied) {
                    setBtnInfo({
                        firstText: 'Application submitted',
                        secondText: "You're participating in the whitelist lottery",
                        clickable: false,
                    });
                } else {
                    setBtnInfo({
                        firstText: 'Apply for Whitelist',
                        secondText: 'You need to apply to the whitelist to participate',
                        clickable: true,
                    });
                }
                break;
            case SALE_STATUS.Closed:
                if (salePublic.isApplied) {
                    setBtnInfo({
                        firstText: 'Application Closed',
                        secondText: 'Waiting for lottery results',
                        clickable: false,
                    });
                } else {
                    setBtnInfo({
                        firstText: 'Application Closed',
                        secondText: 'You didn’t make the whitelist',
                        clickable: false,
                    });
                }
                break;
            case SALE_STATUS.Round1:
                setRoundData(1);
                break;
            case SALE_STATUS.Round2:
                setRoundData(2);
                break;
            case SALE_STATUS.Round3:
                setRoundData(3);
                break;
            case SALE_STATUS.Round1End:
            case SALE_STATUS.Round2End:
            case SALE_STATUS.Round3End:
                setRoundData(4);
                break;
            case SALE_STATUS.Claiming:
            case SALE_STATUS.ClaimingEnds:
                if (+utils.formatUnits(salePublic.totalPurchasedTokens, salePublic.project.tokenDecimals) === 0) {
                    setBtnInfo({
                        firstText: 'Sale is complete',
                        secondText: 'You did not participate',
                        clickable: false,
                    });
                } else {
                    if (
                        salePublic.totalPurchasedTokens === salePublic.claimedTokens ||
                        +utils.formatUnits(salePublic.claimableTokens, salePublic.project.tokenDecimals) === 0
                    ) {
                        setBtnInfo({
                            firstText: `Claimed: ${formatterFloat.format(
                                utils.formatUnits(salePublic.claimedTokens, salePublic.project.tokenDecimals)
                            )} ${salePublic.project?.tickerSymbol ?? 'TBA'}`,
                            secondText: 'You have successfully participated!',
                            clickable: false,
                        });
                    } else {
                        setBtnInfo({
                            firstText: 'Claim',
                            secondText: `Claim your unlocked ${formatterFloat.format(
                                utils.formatUnits(salePublic.claimableTokens, salePublic.project.tokenDecimals)
                            )} ${salePublic.project?.tickerSymbol ?? 'TBA'}`,
                            clickable: true,
                        });
                    }
                }
                break;
            case SALE_STATUS.ClaimingRefund:
                setBtnInfo({
                    firstText: 'Claim refund',
                    secondText: `Claim your refund: ${formatterFloat.format(
                        utils.formatUnits(salePublic.contribution, salePublic.paymentTokenDecimals)
                    )} ${salePublic.paymentTokenSymbol}`,
                    clickable: true,
                });
                break;
            case SALE_STATUS.ClaimingRefundEnd:
                setBtnInfo({
                    firstText: `You've claimed: ${formatterFloat.format(
                        utils.formatUnits(salePublic.contribution, salePublic.paymentTokenDecimals)
                    )} ${salePublic.paymentTokenSymbol}`,
                    secondText: 'Refund claimed',
                    clickable: false,
                });
                break;
            default:
                break;
        }
        // eslint-disable-next-line
    }, [account, salePublic, currentTime, kycStatus, personalInfo.membershipStatus]);

    const onBtnClicked = async () => {
        if (isPreview) {
            window.scroll(0, 0);
            navigate(`/sales/${data.id}`);
            return;
        }

        if (!account || !isValidWallet) {
            openModal('connectWallet');
            return;
        }

        const currentSaleStatus = getCurrentSaleStatus();
        if (currentSaleStatus === SALE_STATUS.Open) {
            if (kycStatus !== KYC_STATUS.VERIFIED) {
                navigate('/member/kyc');
                return;
            }

            if (
                salePublic.type === SALE_TYPE.TierBased &&
                personalInfo.membershipStatus === MEMBERSHIP_STATUS.Visitor
            ) {
                navigate('/member');
                return;
            }

            await fetchWrapper
                .get(`/api/Sale/CanApply/${salePublic.id}`)
                .then((res) => {
                    if (res.result === true) navigate('/whitelist');
                    else toast.error(res.reason);
                })
                .catch((err) => {
                    console.log('/api/Sale/CanApply', err);
                });
            return;
        }

        if (currentSaleStatus >= SALE_STATUS.Round1 && currentSaleStatus <= SALE_STATUS.Round3) {
            openModal('contribute');
            return;
        }

        if (currentSaleStatus === SALE_STATUS.ClaimingRefund) {
            setControlButtonStatus(CONTROL_BUTTON_STATUS.Claiming);

            try {
                setModalData({ status: 'pending', title: 'Refund claiming...' });
                openModal('transactionStatus');

                const saleABI = getProperABI(salePublic.type);
                const saleContract = new Contract(publicInfo.saleAddress, saleABI, activeProvider.getSigner());
                const take = await saleContract.refund();
                const receipt = await take.wait();
                const events = abiDecoder.decodeLogs(receipt.logs);

                setModalData({
                    status: 'success',
                    tx: receipt.transactionHash,
                    title: `Refund claimed ${formatterFloat.format(
                        utils.formatUnits(events[0].events[2].value, salePublic.paymentTokenDecimals)
                    )} ${salePublic.paymentTokenSymbol}`,
                    claiming: true,
                });
            } catch (error) {
                console.log(error);
                toast.error(parseMetamaskError(error.message));
                setModalData({ status: 'fail', title: 'Refund claiming failed' });
            } finally {
                setControlButtonStatus(CONTROL_BUTTON_STATUS.None);
            }

            return;
        }

        if (currentSaleStatus >= SALE_STATUS.Claiming) {
            setControlButtonStatus(CONTROL_BUTTON_STATUS.Claiming);

            try {
                setModalData({ status: 'pending', title: 'Claiming...' });
                openModal('transactionStatus');
                const vestingContract = new Contract(
                    salePublic.vestingAddress,
                    IntervalVestingABI,
                    activeProvider.getSigner()
                );
                const take = await vestingContract.claimTokens();
                const receipt = await take.wait();
                const events = abiDecoder.decodeLogs(receipt.logs);

                setModalData({
                    status: 'success',
                    tx: receipt.transactionHash,
                    title: `Claimed ${formatterFloat.format(
                        utils.formatUnits(events[0].events[2].value, salePublic.project.tokenDecimals)
                    )} ${salePublic.project.tickerSymbol}`,
                    claiming: true,
                });
                openModal('transactionStatus');
            } catch (error) {
                console.log(error);
                toast.error(parseMetamaskError(error.message));
                setModalData({ status: 'fail', title: 'Claiming failed' });
                openModal('transactionStatus');
            } finally {
                setControlButtonStatus(CONTROL_BUTTON_STATUS.None);
            }
        }
    };

    return (
        <div className={clsx('control-button')} {...rest}>
            {btnInfo.clickable ? (
                <SimpleButton clickHandler={onBtnClicked} isDisabled={btnInfo.disabled || controlButtonStatus > 0}>
                    {btnInfo.firstText}
                    {controlButtonStatus > 0 && (
                        <div className="spinner-wrapper">
                            <Loading3Dot width={32} height={32} />
                        </div>
                    )}
                </SimpleButton>
            ) : (
                <div className="button-status">
                    <span className="">{btnInfo.firstText}</span>
                </div>
            )}
            <span className="text-info">{btnInfo.secondText}</span>
        </div>
    );
};

export default ControlButton;
