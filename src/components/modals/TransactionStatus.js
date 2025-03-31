import clsx from 'clsx';
import React from 'react';
import ReactModal from 'react-modal';
import { Cross } from '../../assets/icons';
import Submitted from '../../assets/png/submitted.webp';
import Failed from '../../assets/png/failed.webp';
import { ExternalLink } from '../reusable';
import { Loading180Ring } from '../../assets/loading';
import { useModalContext } from '../../context/modal/ModalState';

const TransactionStatus = (props) => {
    const { modal, closeModal, modalData } = useModalContext();

    const onClose = () => {
        closeModal('transactionStatus');
    };

    const transStatus = () => {
        let retStatus = { title: '', img: '', alt: '' };

        switch (modalData?.status) {
            case 'success':
                retStatus = { title: modalData?.title, img: Submitted, alt: 'submitted' };
                break;
            case 'fail':
                retStatus = { title: modalData?.title, img: Failed, alt: 'failed' };
                break;
            case 'pending':
                retStatus = { title: modalData?.title };
                break;
            default:
                break;
        }

        return retStatus;
    };

    return (
        <ReactModal
            {...props}
            ariaHideApp={false}
            isOpen={modal.transactionStatus}
            overlayClassName="modal-overlay"
            className={clsx('modal-content transaction-confirm', `${modalData?.status}`)}
        >
            <div className="header">
                <button className="transaction-close-button" type="button" onClick={onClose}>
                    <Cross />
                </button>
            </div>
            <div className="content">
                <div className="content-wrapper">
                    {modalData?.status !== 'pending' ? (
                        <img className="status-icon" src={transStatus().img} alt={transStatus().alt} />
                    ) : (
                        <div className="loading">
                            <Loading180Ring width={80} height={80} />
                        </div>
                    )}
                    <div className="prompt">
                        <span>{transStatus().title}</span>
                        {modalData?.status === 'success' && (
                            <>
                                {/* <ExternalLink to={`http://rinkeby.etherscan.io/tx/${modalData?.tx}`}>
                                    View on explorer
                                </ExternalLink> */}
                                <ExternalLink
                                    to={`${
                                        parseInt(process.env.REACT_APP_CHAIN_ID) === 11155111
                                            ? 'https://sepolia.etherscan.io'
                                            : 'https://etherscan.io'
                                    }/tx/${modalData?.tx}`}
                                >
                                    View on explorer
                                </ExternalLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </ReactModal>
    );
};

export default TransactionStatus;
