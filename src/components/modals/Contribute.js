import abiDecoder from 'abi-decoder';
import toast from 'react-hot-toast';
import { constants, Contract, utils } from 'ethers';
import React, { useEffect, useRef, useState } from 'react';
import ReactModal from 'react-modal';
import { AmountInput, SimpleButton } from '../reusable';
import { calculateMargin } from '../../web3/utils';
import config from '../../config/config';
import PrivateSaleABI from '../../config/abi/PrivateSale.json';
import UnlimitedSaleABI from '../../config/abi/UnlimitedSale.json';
import TierBasedSaleABI from '../../config/abi/TierBasedSale.json';
import { CONTROL_BUTTON_STATUS, SALE_STATUS } from '../../config/constants';
import { currentAvailableInfo, getProperABI, formatterFloat, formatterInt } from '../../helpers/functions';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useModalContext } from '../../context/modal/ModalState';
import { useSaleContext } from '../../context/sale/SaleState';
import { Cross } from '../../assets/icons';
import { Loading3Dot } from '../../assets/loading';

abiDecoder.addABI(PrivateSaleABI);
abiDecoder.addABI(UnlimitedSaleABI);
abiDecoder.addABI(TierBasedSaleABI);

const Contribute = ({ props }) => {
    const {
        salePublic,
        getCurrentSaleStatus,
        userBalance,
        updateUserBalance,
        controlButtonStatus,
        setControlButtonStatus,
    } = useSaleContext();

    const { modal, closeModal, setModalData, openModal } = useModalContext();
    const { account, activeProvider } = useGlobalContext();
    const [amount, setAmount] = useState(0);
    const [isApproved, setApproved] = useState(false);

    useEffect(() => {
        if (salePublic.paymentTokenAddress) {
            updateUserBalance(account, activeProvider);
            if (salePublic.rounds.length === 1) {
                setAmount(+utils.formatUnits(salePublic.allocation, salePublic.paymentTokenDecimals));
            }
        }

        if (!salePublic.paymentTokenAddress || !account || !activeProvider || !salePublic.saleAddress) return;

        (async () => {
            try {
                const erc20Contract = new Contract(
                    salePublic.paymentTokenAddress,
                    config.abis.erc20,
                    activeProvider.getSigner()
                );

                const userAllowance = await erc20Contract.allowance(account, salePublic.saleAddress);

                isMounted.current && setApproved(+utils.formatUnits(userAllowance) > 0);
            } catch (error) {
                console.log(error);
            }
        })();

        // eslint-disable-next-line
    }, [salePublic, account, activeProvider, salePublic]);

    const isMounted = useRef(true);

    let maxAmount = 0;
    if (modal.contribute) {
        if (getCurrentSaleStatus() === SALE_STATUS.Round1) {
            maxAmount =
                +utils.formatUnits(salePublic.allocation, salePublic.paymentTokenDecimals) -
                +utils.formatUnits(salePublic.contribution, salePublic.paymentTokenDecimals);

            if (maxAmount > userBalance) maxAmount = userBalance;
        } else if (
            (getCurrentSaleStatus() === SALE_STATUS.Round2 && salePublic.rounds.length === 2) ||
            (getCurrentSaleStatus() === SALE_STATUS.Round3 && salePublic.rounds.length === 3)
        ) {
            maxAmount =
                +utils.formatUnits(salePublic.maxContribution, salePublic.paymentTokenDecimals) -
                +utils.formatUnits(salePublic.totalContribution, salePublic.paymentTokenDecimals);
            if (maxAmount > userBalance) maxAmount = userBalance;
        } else if (getCurrentSaleStatus() === SALE_STATUS.Round2 && salePublic.rounds.length > 2) {
            if (salePublic.membershipTierId && salePublic?.tiers?.length > 0) {
                const currentTier = currentAvailableInfo(salePublic.membershipTierId, salePublic.tiers);
                if (currentTier.contribution || currentTier.allocation) {
                    maxAmount =
                        +utils.formatUnits(currentTier.allocation, salePublic.paymentTokenDecimals) -
                        +utils.formatUnits(currentTier.contribution, salePublic.paymentTokenDecimals);
                    if (maxAmount > userBalance) maxAmount = userBalance;
                }
            }
        }
    }

    const validate = () => {
        if (!amount || isNaN(parseFloat(amount)) || +amount <= 0) {
            toast.error('Please enter a value');
            return false;
        }

        const decimalIdx = amount.toString().indexOf('.');
        if (decimalIdx > 0) {
            const decimals = amount.toString().substring(amount.toString().indexOf('.'));
            if (decimals.toString().length > +salePublic.paymentTokenDecimals + 1) {
                toast.error(`Too many decimals. Only ${salePublic.paymentTokenDecimals} decimals are allowed.`);
                return false;
            }
        }

        if (+amount > +userBalance) {
            toast.error('Insufficient Balance');
            return false;
        }

        if (+amount > +maxAmount) {
            toast.error('Insufficient remaining allocation');
            return false;
        }

        return true;
    };

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const onClose = () => {
        // if (isLoading) return;
        closeModal('contribute');
    };

    const approve = async () => {
        const isValidate = validate();
        if (!isValidate) return;
        setControlButtonStatus(CONTROL_BUTTON_STATUS.Approving);

        try {
            const erc20Contract = new Contract(
                salePublic.paymentTokenAddress,
                config.abis.erc20,
                activeProvider.getSigner()
            );

            let useExact = false;
            const estimatedGas = await erc20Contract.estimateGas
                .approve(salePublic.saleAddress, constants.MaxUint256)
                .catch(() => {
                    useExact = true;
                    return erc20Contract.approve(salePublic.saleAddress, utils.parseUnits(amount.toString()));
                });

            const approve = await erc20Contract.approve(
                salePublic.saleAddress,
                useExact ? utils.parseUnits(amount.toString()) : constants.MaxUint256,
                {
                    gasLimit: calculateMargin(estimatedGas),
                }
            );

            await approve.wait();

            setApproved(true);

            toast.success(`Successfully approved ${salePublic.paymentTokenSymbol}`);

            setControlButtonStatus(CONTROL_BUTTON_STATUS.None);
            return true;
        } catch (e) {
            console.log(e);
            if (e?.error?.message) toast.error(e.error.message);
            else toast.error('Approve error');

            setControlButtonStatus(CONTROL_BUTTON_STATUS.None);
            return false;
        }
    };

    const contribute = async () => {
        const isValidate = validate();
        if (!isValidate) return;

        setControlButtonStatus(CONTROL_BUTTON_STATUS.Contributing);

        try {
            const saleABI = getProperABI(salePublic.type);
            const salesContract = new Contract(salePublic.saleAddress, saleABI, activeProvider.getSigner());

            // const currentStatus = getCurrentSaleStatus();
            const take = await salesContract.buy(
                utils.parseUnits(amount.toString(), salePublic.paymentTokenDecimals)
                // currentStatus === SALE_STATUS.Round1 ? 0 : currentStatus === SALE_STATUS.Round2 ? 1 : 2
            );

            const receipt = await take.wait();
            const events = abiDecoder.decodeLogs(receipt.logs);

            updateUserBalance(account, activeProvider);
            setModalData({
                status: 'success',
                tx: receipt.transactionHash,
                title: `Contributed ${formatterFloat.format(
                    getCurrentSaleStatus() === SALE_STATUS.Round1
                        ? +amount
                        : +utils.formatUnits(events[0].events[1].value, salePublic.paymentTokenDecimals)
                )} ${salePublic.paymentTokenSymbol}`,
            });
            openModal('transactionStatus');
        } catch (e) {
            console.log(e);
            if (e?.error?.message) setModalData({ status: 'fail', title: e.error.message });
            else setModalData({ status: 'fail', title: 'Contribution failed' });

            openModal('transactionStatus');
            setControlButtonStatus(CONTROL_BUTTON_STATUS.None);
        } finally {
            setControlButtonStatus(CONTROL_BUTTON_STATUS.None);
            closeModal('contribute');
        }
    };

    const handleClick = async () => {
        if (!salePublic.paymentTokenDecimals) {
            toast.error('PaymentToken decimals are not available');
            return;
        }

        let canContribute = isApproved;
        if (!isApproved) canContribute = await approve();
        if (canContribute) contribute();
    };

    return (
        <ReactModal
            {...props}
            ariaHideApp={false}
            isOpen={modal.contribute}
            overlayClassName="modal-overlay"
            className="modal-content contribute-modal"
            // shouldCloseOnOverlayClick={true}
            // onRequestClose={onClose}
        >
            <h2 className="header">
                Contribute
                <br />
                <span>
                    (Contributed amount:{' '}
                    {!salePublic.paymentTokenDecimals
                        ? 'TBA'
                        : formatterInt.format(
                              +utils.formatUnits(salePublic.contribution, salePublic.paymentTokenDecimals)
                          )}{' '}
                    {salePublic.paymentTokenSymbol ?? 'TBA'})
                </span>
            </h2>
            <button className="close-button" type="button" onClick={onClose}>
                <Cross />
            </button>
            <div className="content">
                <div className="balance-container">
                    <span>
                        Balance: {formatterFloat.format(+userBalance)} {salePublic.paymentTokenSymbol ?? 'TBA'}
                    </span>
                    <span>
                        {`Remaining allocation: ${formatterFloat.format(+maxAmount)} ${
                            salePublic.paymentTokenSymbol ?? 'TBA'
                        }`}
                    </span>
                </div>
                <AmountInput
                    amount={amount}
                    setAmount={setAmount}
                    maxAmount={maxAmount}
                    hasMax={salePublic.rounds.length !== 1}
                />
                <SimpleButton className="contribute" clickHandler={handleClick} isDisabled={controlButtonStatus > 0}>
                    {controlButtonStatus > 0 && (!isApproved ? 'Approving' : `Contributing...`)}
                    {controlButtonStatus === 0 && (!isApproved ? 'Approve' : 'Contribute')}
                    {controlButtonStatus > 0 && (
                        <div className="spinner-wrapper">
                            <Loading3Dot width={32} height={32} />
                        </div>
                    )}
                    <div className="step-wrapper">
                        <span>{!isApproved ? '1' : '2'}/2</span>
                    </div>
                </SimpleButton>
                <span className="confirm-notify">Please confirm the transaction on your wallet</span>
            </div>
        </ReactModal>
    );
};

export default Contribute;
