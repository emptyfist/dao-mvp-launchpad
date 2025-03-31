import React, { useEffect, useRef, useState } from 'react';
import ReactModal from 'react-modal';
import tokenInfo from '../../config/tokenInfo';
import { SimpleButton, SimpleInput, TabSlider } from '../reusable';
import { Arrow, Cross, InfoMark, Swap } from '../../assets/icons';
import Plus from '../../assets/svg/plus.svg';
import ArrowCollapse from '../../assets/svg/arrowcollapse.svg';
import { useModalContext } from '../../context/modal/ModalState';

const formatterInt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

const ProcLiquidity = () => {
    const { modal, modalData, closeModal, openModal } = useModalContext();

    const slippageRef = useRef();
    const deadlineRef = useRef();

    const onClose = () => {
        closeModal('procLiquidity');
    };

    const onBack = () => {
        closeModal('procLiquidity');
        openModal('stake');
    };

    const [curTab, setCurrentTab] = useState('Add');

    useEffect(() => {
        if (!modalData || modalData.isAdd === undefined) return;

        setCurrentTab(modalData.isAdd ? 'Add' : 'Remove');
    }, [modalData]);

    return (
        <ReactModal
            ariaHideApp={false}
            isOpen={modal.procLiquidity}
            overlayClassName="modal-overlay"
            className="modal-content proc-liquidity"
            onRequestClose={onClose}
        >
            <h2 className="header">
                <div style={{ transform: 'rotate(90deg)' }} className="back-arrow" onClick={onBack}>
                    <Arrow />
                </div>
                <span>Liquidity</span>
                <Cross onClick={(e) => onClose()} />
            </h2>
            <div className="content">
                <div className="main-palette">
                    <TabSlider tabs={['Add', 'Remove']} tabChanged={setCurrentTab} defaultVal={curTab} />
                    {curTab === 'Add' ? (
                        <>
                            <div>
                                <div className="add-balance-caption">
                                    <span>Input</span>
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
                                <img src={Plus} alt="Add liquidity" />
                                <div className="divider" />
                            </div>
                            <div>
                                <div className="add-balance-caption">
                                    <span>Input</span>
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
                        </>
                    ) : (
                        <>
                            <div>
                                <div className="add-balance-caption">
                                    <span>Add to remove</span>
                                    <div>
                                        <span>{`Balance: ${formatterInt.format(modalData?.curlp ?? 0)} LP`}</span>
                                        <span className="usd-value">{` ~$${formatterInt.format(
                                            modalData?.lpusd ?? 0
                                        )}`}</span>
                                    </div>
                                </div>
                                <div className="add-balance1-wrapper">
                                    <SimpleInput />
                                    <span className="max">MAX</span>
                                </div>
                            </div>
                            <div className="add-diver">
                                <div className="divider" />
                                <Arrow />
                                <div className="divider" />
                            </div>
                            <div className="add-lp-wrapper">
                                <span>You will receive</span>
                                <div className="lp-wrapper">
                                    <div className="token-wrapper remove">
                                        <img
                                            src={tokenInfo[modalData?.token1 ?? 'default'].icon}
                                            alt="Token1 Icon"
                                            width={42}
                                            height={42}
                                        />
                                        <div className="token-balance">
                                            <span>{formatterInt.format(modalData?.bal1 ?? 0)}</span>
                                            <span>{modalData?.token1 ?? 'USDC'}</span>
                                        </div>
                                    </div>
                                    <img src={Plus} width={24} height={24} alt="Plus" />
                                    <div className="token-wrapper remove">
                                        <img
                                            src={tokenInfo[modalData?.token2 ?? 'default'].icon}
                                            alt="Token1 Icon"
                                            width={42}
                                            height={42}
                                        />
                                        <div className="token-balance">
                                            <span>{formatterInt.format(modalData?.bal2 ?? 0)}</span>
                                            <span>{modalData?.token2 ?? 'USDC'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="exchange-rate">
                                {`Exchange rate: 1 ${modalData?.token1 ?? 'USDC'} = 1 ${modalData?.token2 ?? 'USDC'}`}
                                <Swap fill="#33ABE6" />
                            </span>
                        </>
                    )}
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
                    <span>{`${curTab} Liquidity`}</span>
                </SimpleButton>
            </div>
        </ReactModal>
    );
};

export default ProcLiquidity;
