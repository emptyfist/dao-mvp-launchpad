import React from 'react';
import { Membership } from '../../assets/icons';
import { ContentHeader } from '../reusable';
import { KYCStatusHeader } from '../kyc';
import { MintOverview, MembershipHeader } from '../membership';
import { UpgradeNFT, ImportantNotice, TransactionStatus } from '../modals';
import { useGlobalContext } from '../../context/global/GlobalState';

const MembershipPage = () => {
    const { personalInfo } = useGlobalContext();
    return (
        <div id="membership" className="page">
            <div className="page-title">
                <KYCStatusHeader hideBack={true} />
            </div>
            <div className="page-content">
                <div className="page-subheader">
                    <ContentHeader icon={Membership} title="Memberships" />
                    <MembershipHeader status={personalInfo.membershipStatus} />
                </div>
                <MintOverview />
            </div>
            <UpgradeNFT />
            <ImportantNotice />
            <TransactionStatus />
        </div>
    );
};

export default MembershipPage;
