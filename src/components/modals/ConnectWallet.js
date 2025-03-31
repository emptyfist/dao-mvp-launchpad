import { toast } from 'react-hot-toast';
import React from 'react';
import ReactModal from 'react-modal';
import config from '../../config/config';
import { Cross } from '../../assets/icons';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useModalContext } from '../../context/modal/ModalState';

const ConnectWallet = (props) => {
    const { modal, closeModal } = useModalContext();
    const { activateWallet } = useGlobalContext();

    const onClose = () => {
        closeModal('connectWallet');
    };

    const checkWrongNetwork = (name) => {
        if (!window.ethereum) {
            closeModal('connectWallet');
            toast.error('Please Install Metamask!!!');
            return;
        }

        activateWallet(name, onClose);
    };

    return (
        <ReactModal
            {...props}
            ariaHideApp={false}
            isOpen={modal.connectWallet}
            overlayClassName="modal-overlay"
            className="modal-content connect-wallet"
            // shouldCloseOnOverlayClick={true}
            // onRequestClose={onClose}
        >
            <h2 className="header">Connect Wallet</h2>
            <button className="close-button" type="button" onClick={onClose}>
                <Cross />
            </button>
            <div className="content">
                {config.walletConnections.map(({ name, icon, disabled }) => (
                    <button key={name} type="button" onClick={() => checkWrongNetwork(name)} disabled={disabled}>
                        {React.createElement(icon, {})}
                        <span>{name}</span>
                    </button>
                ))}
            </div>
        </ReactModal>
    );
};

export default ConnectWallet;
