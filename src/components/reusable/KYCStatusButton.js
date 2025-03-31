import clsx from 'clsx';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { KYCStatus } from '../../assets/icons';
import { KYC_STATUS } from '../../config/constants';
import { useGlobalContext } from '../../context/global/GlobalState';

const KYCStatusButton = () => {
    const { kycStatus } = useGlobalContext();
    let navigate = useNavigate();

    const getBackgroundForStatus = () => {
        if (kycStatus === KYC_STATUS.VERIFIED) return 'cyan-btn';
        else if (kycStatus === KYC_STATUS.FAILED) return 'red-btn';
        else if (kycStatus === KYC_STATUS.VERIFYING) return 'blue-btn';
        else return 'gray-btn';
    };

    const getToolTips = () => {
        if (kycStatus === KYC_STATUS.UNVERIFIED || kycStatus === KYC_STATUS.NONE) return 'Click to verify your KYC.';
        if (kycStatus === KYC_STATUS.VERIFYING)
            return 'Your KYC is being reviewed right now.\nClick to view your provided information.';
        if (kycStatus === KYC_STATUS.VERIFIED) return 'You have passed the KYC process';

        return 'You have failed the KYC process. Click to\nreview what went wrong.';
    };

    const changeKYCStatus = () => {
        if (kycStatus === KYC_STATUS.VERIFIED) return;

        navigate('/member/kyc');
    };

    return (
        <>
            <button
                data-tip
                data-for="kycStatusTip"
                className={clsx('btn-wrapper', 'btn-box-shadow', 'kyc-wrapper', `${getBackgroundForStatus(kycStatus)}`)}
                onClick={(e) => {
                    changeKYCStatus();
                }}
            >
                <KYCStatus />
                <span>
                    {kycStatus === KYC_STATUS.NONE || kycStatus === KYC_STATUS.UNVERIFIED ? 'Verify KYC' : kycStatus}
                </span>
            </button>
            <ReactTooltip className="custom-tooltip" id="kycStatusTip" place="bottom" effect="solid" delayHide={100}>
                {getToolTips()}
            </ReactTooltip>
        </>
    );
};

export default KYCStatusButton;
