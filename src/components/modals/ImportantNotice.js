import React from 'react';
import ReactModal from 'react-modal';
import { SimpleButton } from '../reusable';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useModalContext } from '../../context/modal/ModalState';

const ImportantNotice = (props) => {
    const { modal, setModalData, closeModal } = useModalContext();
    const { publicInfo } = useGlobalContext();

    const onClose = () => {
        closeModal('importantNotice');
        setModalData({ isMint: false });
    };

    const onConfirmModal = async () => {
        closeModal('importantNotice');
        setModalData({ isMint: true });
    };

    return (
        <ReactModal
            {...props}
            ariaHideApp={false}
            isOpen={modal.importantNotice}
            overlayClassName="modal-overlay"
            className="modal-content important-notice"
        >
            <h2 className="header">Important Notice</h2>
            <div className="content">
                <div className="content-detail">
                    <span>
                        Your Membership NFT is tied to your Otaris account and KYC, the NFT provides you access to a
                        range of services on Otaris platform and beyond.
                    </span>
                    <br />
                    <span className="consider">Please consider:</span>
                    <br />
                    <span>
                        1. Once you mint your NFT, you will <b>NOT</b> be able to convert it back to{' '}
                        {publicInfo.tickerSymbol ?? 'TBA'}.
                    </span>
                    <br />
                    <span>
                        2. Otaris Membership NFTs will <b>ONLY</b> be tradable on the <b>Otaris NFT Marketplace</b> (and
                        on any other authorized platforms or market places) once it is released with users who have{' '}
                        <b>completed the identity verification</b> on the platform.
                    </span>
                    <br />
                    <span>
                        3. You will <b>NOT</b> be able to <b>TRANSFER</b> your NFT to a different wallet.
                    </span>
                    <br />
                </div>
                <span className="question">Do you want to continue?</span>
                <div className="button-group">
                    <SimpleButton className="mint-button" clickHandler={onConfirmModal}>
                        Yes, mint it!
                    </SimpleButton>
                    <SimpleButton className="cancel-button" clickHandler={onClose}>
                        Cancel
                    </SimpleButton>
                </div>
            </div>
        </ReactModal>
    );
};

export default ImportantNotice;
