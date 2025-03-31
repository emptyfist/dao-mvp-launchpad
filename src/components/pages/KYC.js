import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { fetchWrapper } from '../../helpers/fetch-wrapper';
import { KYCStatusHeader, PersonalInfo, UploadDocument } from '../kyc';
import { VerifyKYCEmail } from '../modals';
import { ID_TYPE_DOCUMENT, KYC_STATUS } from '../../config/constants';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useModalContext } from '../../context/modal/ModalState';

const KYC = () => {
    let navigate = useNavigate();
    const { openModal, closeModal } = useModalContext();
    const { kycStatus, kycInfo, /*setKYCStatus,*/ setKYCSubmitting } = useGlobalContext();

    useEffect(() => {
        if (kycStatus !== KYC_STATUS.UNVERIFIED) return;

        if (!kycInfo.email) openModal('verifyKYCEmail');
        else closeModal('verifyKYCEmail');
        // eslint-disable-next-line
    }, [kycStatus]);

    const submitKYCVerify = async () => {
        setKYCSubmitting(true);

        const params2send = {
            firstName: kycInfo.firstName,
            lastName: kycInfo.lastName,
            countryId: kycInfo.countryId,
            document: [],
            face: kycInfo.selfie.substring(kycInfo.selfie.indexOf(',') + 1),
        };

        if (kycInfo.documentType === ID_TYPE_DOCUMENT)
            params2send.document = [
                kycInfo.front.substring(kycInfo.front.indexOf(',') + 1),
                kycInfo.back.substring(kycInfo.back.indexOf(',') + 1),
            ];
        else params2send.document = [kycInfo.front.substring(kycInfo.front.indexOf(',') + 1)];

        const result = await fetchWrapper
            .post('/api/User/KYC/Verify', params2send)
            .then((res) => true)
            .catch((msg) => msg?.error);
        if (result !== true) {
            toast.error(result);
            setKYCSubmitting(false);
            return;
        }

        // if (result === true) setKYCStatus(KYC_STATUS.VERIFYING);

        setKYCSubmitting(false);

        toast.success('Submitted KYC data.');
        navigate('/member');
    };

    return (
        <div id="kyc" className="page">
            <div className="page-title">
                <KYCStatusHeader />
            </div>
            <div className="page-content">
                <PersonalInfo />
                <UploadDocument nextHandler={submitKYCVerify} />
            </div>
            <VerifyKYCEmail />
        </div>
    );
};

export default KYC;
