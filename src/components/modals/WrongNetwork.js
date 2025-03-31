import clsx from 'clsx';
import ReactModal from 'react-modal';
import React from 'react';
import { useGlobalContext } from '../../context/global/GlobalState';
import { Warning } from '../../assets/icons';
import { NETWORK_NAME } from '../../config/constants';
import { useModalContext } from '../../context/modal/ModalState';

const WrongNetwork = (props) => {
    const { modalData } = useModalContext();
    const { wrongNetwork, switchNetwork } = useGlobalContext();

    return (
        <ReactModal
            {...props}
            ariaHideApp={false}
            isOpen={wrongNetwork}
            overlayClassName="modal-overlay"
            className={clsx('modal-content wrong-network', `${modalData?.status}`)}
        >
            <h2 className="header">Wrong network connected</h2>
            <div className="content-wrapper">
                <Warning />
                <button className="btn-wrapper switch-network" onClick={switchNetwork}>
                    <span>Switch to {NETWORK_NAME[parseInt(process.env.REACT_APP_CHAIN_ID)]}</span>
                </button>
            </div>
        </ReactModal>
    );
};

export default WrongNetwork;
