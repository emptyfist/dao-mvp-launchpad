import React from 'react';
import ReactModal from 'react-modal';
import { SimpleButton, CustomInput } from '../reusable';
import { Cross } from '../../assets/icons';
import { useModalContext } from '../../context/modal/ModalState';

const Stake = ({ props }) => {
    const { modal, modalData, closeModal, openModal, setModalData } = useModalContext();

    const onClose = () => {
        closeModal('stake');
    };

    const liquidityHandler = (e) => {
        onClose();
        if (modalData?.isStake) {
            setModalData({
                isStake: modalData.isStake,
                token1: 'USDC',
                token2: 'OTA',
                bal1: 4220,
                bal2: 12,
                bal1usd: 4220,
                bal2usd: 150,
                isAdd: false,
            });
            openModal('procSwap');
        } else {
            setModalData({
                isStake: modalData.isStake,
                token1: 'USDC',
                token2: 'OTA',
                bal1: 4220,
                bal2: 12,
                bal1usd: 4220,
                bal2usd: 150,
                isAdd: true,
            });
            openModal('procLiquidity');
        }
    };

    return (
        <ReactModal
            {...props}
            ariaHideApp={false}
            isOpen={modal.stake}
            overlayClassName="modal-overlay"
            className="modal-content stake-modal"
            // shouldCloseOnOverlayClick={true}
            // onRequestClose={onClose}
        >
            <h2 className="header">Stake/Unstake</h2>
            <button className="close-button" type="button" onClick={onClose}>
                <Cross />
            </button>
            <div className="content">
                <div className="balance-container">
                    <span>Balance: 234 LP</span>
                    <span>Staked Balance: 0 LP</span>
                </div>

                <CustomInput />
                <div className="button-container">
                    <SimpleButton>Unstake</SimpleButton>
                    <SimpleButton>Stake</SimpleButton>
                </div>
                <div className="link-container">
                    <span onClick={liquidityHandler}>Provide OTA-ETH Liquidity</span>
                </div>
            </div>
        </ReactModal>
    );
};

export default Stake;
