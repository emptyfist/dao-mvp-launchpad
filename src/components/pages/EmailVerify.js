import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { VerifyKYCEmail } from '../modals';
import { fetchWrapper } from '../../helpers/fetch-wrapper';
import { useModalContext } from '../../context/modal/ModalState';

const EmailVerify = () => {
    const search = useLocation().search;
    const param = new URLSearchParams(search).get('param');
    const [verifyStatus, setVerified] = useState({ isError: false, msg: '' });
    const isMounted = useRef(true);

    const { openModal } = useModalContext();
    useEffect(() => {
        const verifyEmail = async () => {
            await fetchWrapper
                .post(`/api/User/VerifyEmail/${param}`)
                .then((res) => {
                    setVerified({ isError: false, msg: res });
                })
                .catch((res) => {
                    setVerified({ isError: true, msg: res?.error });
                });

            openModal('verifyKYCEmail');
        };

        isMounted.current && verifyEmail();

        return () => {
            isMounted.current = false;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <VerifyKYCEmail
            addr={!verifyStatus.isError ? verifyStatus.msg : ''}
            isError={verifyStatus.isError}
            msg={verifyStatus.msg}
        />
    );
};

export default EmailVerify;
