import React, { useRef } from 'react';
import ReactModal from 'react-modal';
import tokenInfo from '../../config/tokenInfo';
import { SimpleButton, SimpleInput } from '../reusable';
import { Arrow, Cross, InfoMark, Swap } from '../../assets/icons';
import ArrowCollapse from '../../assets/svg/arrowcollapse.svg';
import { useModalContext } from '../../context/modal/ModalState';

const formatterInt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

const ProcSwap = () => {
    const { modal, modalData, closeModal, openModal } = useModalContext();

    const slippageRef = useRef();
    const deadlineRef = useRef();

    const onClose = () => {
        closeModal('procSwap');
    };

    const onBack = () => {
        closeModal('procSwap');
        openModal('stake');
    };

    return (
        <ReactModal
            ariaHideApp={false}
            isOpen={modal.procSwap}
            overlayClassName="modal-overlay"
            className="modal-content proc-swap"
            onRequestClose={onClose}
        >
            <h2 className="header">
                <div style={{ transform: 'rotate(90deg)' }} className="back-arrow" onClick={onBack}>
                    <Arrow />
                </div>
                <span>Swap</span>
                <Cross onClick={(e) => onClose()} />
            </h2>
            <div className="content">
                <div className="main-palette">
                    <div>
                        <div className="add-balance-caption">
                            <span>Swap from</span>
                            <div>
                                <span>{`Balance: ${formatterInt.format(modalData?.bal1 ?? 0)} ${
                                    modalData?.token1 ?? 'USDC'
                                }`}</span>
                                <span className="usd-value">{` ~$${formatterInt.format(
                                    modalData?.bal1usd ?? 0
                                )}`}</span>
                            </div>
                        </div>
                        <div className="add-balance1-wrapper">
                            <div className="token-wrapper">
                                <img
                                    src={tokenInfo[modalData?.token1 ?? 'default'].icon}
                                    alt="Token1 Icon"
                                    width={36}
                                    height={36}
                                />
                                <span>{modalData?.token1 ?? 'USDC'}</span>
                                <img src={ArrowCollapse} alt="Arrow Collapse" />
                            </div>
                            <SimpleInput />
                            <span className="max">MAX</span>
                        </div>
                    </div>
                    <div className="add-diver">
                        <div className="divider" />
                        <Swap />
                        <div className="divider" />
                    </div>
                    <div>
                        <div className="add-balance-caption">
                            <span>Swap to</span>
                            <div>
                                <span>{`Balance: ${formatterInt.format(modalData?.bal2 ?? 0)} ${
                                    modalData?.token2 ?? 'USDC'
                                }`}</span>
                                <span className="usd-value">{` ~$${formatterInt.format(
                                    modalData?.bal2usd ?? 0
                                )}`}</span>
                            </div>
                        </div>
                        <div className="add-balance2-wrapper">
                            <div className="token-wrapper">
                                <img
                                    src={tokenInfo[modalData?.token2 ?? 'default'].icon}
                                    alt="Token2 Icon"
                                    width={36}
                                    height={36}
                                />
                                <span>{modalData?.token2 ?? 'USDC'}</span>
                                <img src={ArrowCollapse} alt="Arrow Collapse" />
                            </div>
                            <SimpleInput />
                        </div>
                    </div>
                    <span className="exchange-rate">
                        {`Exchange rate: 1 ${modalData?.token1 ?? 'USDC'} = 1 ${modalData?.token2 ?? 'USDC'}`}
                        <Swap fill="#33ABE6" />
                    </span>
                </div>
                <span>Transaction Settings</span>
                <div className="setting-wrapper">
                    <div>
                        <div className="caption-with-info">
                            <span>Slippage tolerance</span>
                            <InfoMark />
                        </div>
                        <div className="input-wrapper">
                            <SimpleInput suffix="%" inputRef={slippageRef} />
                            <span className="auto">Auto</span>
                        </div>
                    </div>
                    <div>
                        <div className="caption-with-info">
                            <span>Transaction deadline</span>
                            <InfoMark />
                        </div>
                        <div className="input-wrapper">
                            <SimpleInput inputRef={deadlineRef} />
                            <span className="normal">Minutes</span>
                        </div>
                    </div>
                </div>
                <SimpleButton className="cyan-btn">
                    <span>Swap</span>
                </SimpleButton>
            </div>
        </ReactModal>
    );
};

export default ProcSwap;
