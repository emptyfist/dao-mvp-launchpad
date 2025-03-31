import React from 'react';
import { CardWrapper } from '../reusable';
import { useWidth } from '../../hooks';
import { hasError } from '../../helpers/functions';
import { useGlobalContext } from '../../context/global/GlobalState';
import { KYC_STATUS, MOBILE_WIDTH, PHABLET_WIDTH } from '../../config/constants';

const PersonalInfo = () => {
    const windowWidth = useWidth();
    const { account, kycStatus, kycInfo, setKYCInfo } = useGlobalContext();

    const getEllipsisAddress = () => {
        if (!account) return;
        if (windowWidth >= PHABLET_WIDTH) return account;
        if (windowWidth >= MOBILE_WIDTH) return account.slice(0, 4) + '...' + account.slice(-35);
        return account.slice(0, 4) + '...' + account.slice(-15);
    };

    const updateValues = (name, value) => {
        if (name === 'lastName') {
            setKYCInfo({ lastName: value });
        } else {
            setKYCInfo({ firstName: value });
        }
    };

    return (
        <CardWrapper title="Personal Information">
            <div className="kyc-personal-info">
                <div className="personal-addr">
                    <span>Your Ethereum (ERC20) Address:</span>
                    <span className="wallet-attr">{getEllipsisAddress()}</span>
                </div>
                <span className="remark-caption">
                    {'Your connected Ethereum (ERC20) address\r\n will be used for your KYC verification.'}
                </span>
                <div className="two-child-wrapper">
                    <div className="input-with-label">
                        <span className="input-label-title">First name</span>
                        <input
                            className={`ido-input-text ${
                                hasError(kycInfo.errors, 'firstName') === false ? '' : 'has-error'
                            }`}
                            type="text"
                            placeholder="Enter your first name"
                            defaultValue={
                                kycStatus === KYC_STATUS.UNVERIFIED || kycStatus === KYC_STATUS.NONE
                                    ? ''
                                    : kycInfo.firstName
                            }
                            autoComplete="off"
                            onBlur={(e) => updateValues('firstName', e.currentTarget.value)}
                            disabled={kycStatus !== KYC_STATUS.UNVERIFIED && kycStatus !== KYC_STATUS.FAILED}
                        />
                        {hasError(kycInfo.errors, 'firstName') !== false && (
                            <span className="input-label-error">{hasError(kycInfo.errors, 'firstName')}</span>
                        )}
                    </div>
                    <div className="input-with-label">
                        <span className="input-label-title">Last name</span>
                        <input
                            className={`ido-input-text ${
                                hasError(kycInfo.errors, 'lastName') === false ? '' : 'has-error'
                            }`}
                            type="text"
                            placeholder="Enter your last name"
                            defaultValue={
                                kycStatus === KYC_STATUS.UNVERIFIED || kycStatus === KYC_STATUS.NONE
                                    ? ''
                                    : kycInfo.lastName
                            }
                            autoComplete="off"
                            onBlur={(e) => updateValues('lastName', e.currentTarget.value)}
                            disabled={kycStatus !== KYC_STATUS.UNVERIFIED && kycStatus !== KYC_STATUS.FAILED}
                        />
                        {hasError(kycInfo.errors, 'lastName') !== false && (
                            <span className="input-label-error">{hasError(kycInfo.errors, 'lastName')}</span>
                        )}
                    </div>
                </div>
                <div className="input-with-label">
                    <span className="input-label-title">Email</span>
                    <input
                        className="ido-input-text"
                        type="text"
                        placeholder="Enter your email"
                        value={kycInfo.email ?? ''}
                        readOnly
                    />
                </div>
            </div>
        </CardWrapper>
    );
};

export default PersonalInfo;
