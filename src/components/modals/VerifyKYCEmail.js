import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import React, { useEffect, useRef, useState } from 'react';
import { SimpleButton } from '../reusable';
import { fetchWrapper } from '../../helpers/fetch-wrapper';
import { Cross } from '../../assets/icons';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useModalContext } from '../../context/modal/ModalState';

const EMAIL_UNVERIFIED = 0;
const EMAIL_VERIFYING = 1;
const EMAIL_VERIFIED = 2;
const EMAIL_FAILED = 3;

const VerifyKYCEmail = ({ addr = '', isError = false, token = '', msg = '', ...rest }) => {
    const { modal, closeModal } = useModalContext();
    const { disconnectWallet, kycInfo, logout, setPendingEmail } = useGlobalContext();
    const [emailAddr, setEmailAddr] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [verifyStatus, setVerifyStatus] = useState(EMAIL_UNVERIFIED);
    const [remainTime, setRemainTime] = useState(0);
    const timerHandler = useRef(null);
    let navigate = useNavigate();
    const isMounted = useRef(true);

    const stopTimer = () => {
        if (!timerHandler.current) return;

        clearInterval(timerHandler.current);
        timerHandler.current = null;
    };

    useEffect(() => {
        if (!kycInfo?.email) return;

        stopTimer();
        closeModal('verifyKYCEmail');
        // eslint-disable-next-line
    }, [kycInfo]);

    useEffect(() => {
        if (addr) isMounted.current && setVerifyStatus(EMAIL_VERIFIED);
        else if (isError) isMounted.current && setVerifyStatus(EMAIL_FAILED);
        else isMounted.current && setVerifyStatus(EMAIL_UNVERIFIED);
    }, [addr, isError]);

    useEffect(() => {
        setErrorMsg(msg);
    }, [msg]);

    const waitingRespond = () => {
        setRemainTime((prev) => {
            // websocket here.

            if (prev >= 0) return prev - 1;

            stopTimer();
            return 0;
        });
    };

    const actionBtnClicked = (e) => {
        if (verifyStatus === EMAIL_UNVERIFIED || verifyStatus === EMAIL_VERIFYING) {
            if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test(emailAddr)) {
                toast.error('Invalid email format.');
                return;
            }

            if (remainTime > 0) return;

            setPendingEmail(emailAddr);
            setRemainTime(120);
            setVerifyStatus(EMAIL_VERIFYING);
            stopTimer();
            timerHandler.current = setInterval(() => {
                waitingRespond();
            }, 1000);

            return fetchWrapper
                .post('/api/User/InsertEmail', { email: emailAddr })
                .then((res) => {
                    toast.success('Email was sent to your email box.');
                })
                .catch((res) => {
                    //toast.error(res.error ?? 'Failed to send email');
                    setErrorMsg(res.error ?? 'Failed to send email');
                    if (res.status === 401) {
                        logout();
                        disconnectWallet();
                    }
                    setVerifyStatus(EMAIL_FAILED);
                    setRemainTime(0);
                });
        }

        if (verifyStatus === EMAIL_FAILED) {
            if (isError) {
                navigate('/member');
                return;
            }

            setVerifyStatus(EMAIL_UNVERIFIED);
            return;
        }

        if (addr) {
            navigate('/member/kyc');
        }

        stopTimer();
        closeModal('verifyKYCEmail');
    };

    const onClose = () => {
        stopTimer();
        navigate('/');
    };

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        <ReactModal
            {...rest}
            ariaHideApp={false}
            isOpen={modal.verifyKYCEmail}
            overlayClassName="modal-overlay"
            className="modal-content verify-kyc-email"
            // shouldCloseOnOverlayClick={true}
            // onRequestClose={onClose}
        >
            <h2 className={`header ${verifyStatus === EMAIL_FAILED ? 'failed' : ''}`}>
                {verifyStatus === EMAIL_FAILED
                    ? 'Email confirmation failed'
                    : `Email confirmation${verifyStatus === EMAIL_VERIFIED ? ' successful' : ''}`}
            </h2>
            {(verifyStatus === EMAIL_UNVERIFIED || verifyStatus === EMAIL_VERIFYING) && (
                <button className="close-button" type="button" onClick={onClose}>
                    <Cross />
                </button>
            )}
            {verifyStatus === EMAIL_UNVERIFIED && (
                <div className="content">
                    <span>Before you can start the KYC process, you need to confirm your email address</span>
                    <input
                        className="ido-input-text"
                        type="text"
                        value={emailAddr}
                        placeholder="Enter your email address"
                        onChange={(e) => {
                            setEmailAddr(e.target.value.trim());
                        }}
                    />
                    <SimpleButton clickHandler={actionBtnClicked} isDisabled={emailAddr === ''}>
                        <span>Send confirmation link</span>
                    </SimpleButton>
                </div>
            )}
            {verifyStatus === EMAIL_VERIFYING && (
                <div className="content">
                    <span>
                        The confirmation link has been sent to:
                        <br />
                        <br />
                        <b>{emailAddr}</b>
                        <br />
                        <br />
                        Please check your inbox for further instructions
                        <br />
                        (also check the junk folder as well).
                    </span>
                    <p href="" onClick={actionBtnClicked}>
                        Haven't received the email?
                        <br />
                        Click here to resend it
                        {remainTime <= 0
                            ? ''
                            : '(' +
                              Math.floor(remainTime / 60) +
                              ':' +
                              (remainTime % 60).toFixed(0).padStart(2, '0') +
                              ')'}
                    </p>
                </div>
            )}
            {verifyStatus === EMAIL_VERIFIED && (
                <div className="content">
                    <span>Email confirmed, you can start the KYC process by clicking the button below.</span>
                    <SimpleButton isNext={true} clickHandler={actionBtnClicked}>
                        <span>Continue to KYC</span>
                    </SimpleButton>
                </div>
            )}
            {verifyStatus === EMAIL_FAILED && (
                <div className="content">
                    {/* <span>{msg ?? 'The link is invalid or expired,please try again!'} </span> */}
                    <span>{errorMsg !== '' ? errorMsg : 'The link is invalid or expired,please try again!'}</span>
                    <SimpleButton className="failed" clickHandler={actionBtnClicked}>
                        <span>Try again</span>
                    </SimpleButton>
                </div>
            )}
        </ReactModal>
    );
};

export default VerifyKYCEmail;
