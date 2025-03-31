import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useGlobalContext } from '../../context/global/GlobalState';
import { KYCStatus, ArrowLeft } from '../../assets/icons';
import { KYC_STATUS } from '../../config/constants';

const KYCStatusHeader = ({ hideBack = false }) => {
    const { kycStatus, isKYCSubmitting } = useGlobalContext();
    const navigate = useNavigate();

    const backClicked = () => {
        if (isKYCSubmitting) return;
        navigate('/member');
    };

    const getNoteBg = () => {
        if (kycStatus !== KYC_STATUS.FAILED) return 'green-note';
        return 'red-note';
    };

    const getStatusBg = () => {
        if (kycStatus === KYC_STATUS.UNVERIFIED || kycStatus === KYC_STATUS.NONE) return 'gray-note';
        if (kycStatus !== KYC_STATUS.FAILED) return 'green-note';
        return 'red-note';
    };

    const getNotes = () => {
        switch (kycStatus) {
            case KYC_STATUS.VERIFYING:
                return 'Your KYC information is being reviewed right now. It may take a maximum of 2-3 days.';
            case KYC_STATUS.VERIFIED:
                return 'Congratulations! Your KYC information has been successfully verified!';
            case KYC_STATUS.FAILED:
                return 'Your KYC verification has failed. Please resubmit your KYC information.';
            default:
                return 'KYC will be necessary to have access to IDOs and private sales, depending on their specific terms';
        }
    };

    return (
        <div className="kyc-status-header">
            <div className="caption-wrapper">KYC Status</div>
            <div className={clsx('status-wrapper', getNoteBg(kycStatus))}>
                <div className={clsx('status-info', getStatusBg(kycStatus))}>
                    <KYCStatus />
                    <span>
                        {kycStatus === KYC_STATUS.NONE || kycStatus === KYC_STATUS.UNVERIFIED
                            ? 'Verify KYC'
                            : kycStatus}
                    </span>
                </div>
                <div className="status-note">
                    <span className={clsx('note-wrapper', getNoteBg(kycStatus))}>Please note:</span>
                    <span>{getNotes()}</span>
                </div>
            </div>
            {!hideBack && (
                <div className="back-wrapper" disabled={isKYCSubmitting} onClick={(e) => backClicked()}>
                    <ArrowLeft />
                    <span>Back</span>
                </div>
            )}
        </div>
    );
};

export default KYCStatusHeader;
