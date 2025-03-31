import React from 'react';
import { SimpleButton } from '../reusable';
import { MEMBERSHIP_STATUS } from '../../config/constants';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useModalContext } from '../../context/modal/ModalState';

const MembershipHeader = ({ status }) => {
    const { account, isValidWallet, personalInfo, tiersInfo } = useGlobalContext();
    const { openModal } = useModalContext();

    const onShowModal = () => {
        openModal('upgradeNFT');
    };

    return (
        <div className="membership-header">
            <div className="mint-status-header">
                <div className="status-wrapper">
                    <div className="status-info">
                        <SimpleButton
                            className="mint-button"
                            clickHandler={onShowModal}
                            isDisabled={
                                !account ||
                                !isValidWallet ||
                                personalInfo.membershipStatus >= tiersInfo.length ||
                                !tiersInfo[personalInfo.membershipStatus + 1].isExists
                            }
                        >
                            {status === MEMBERSHIP_STATUS.Visitor ? 'Mint ' : 'Upgrade to '}
                            {tiersInfo[status + 1].name}
                        </SimpleButton>
                    </div>
                    <div className="status-note">
                        <span>
                            {personalInfo.membershipStatus >= tiersInfo.length ||
                            !tiersInfo[personalInfo.membershipStatus + 1].isExists
                                ? 'TBA'
                                : `${
                                      !+tiersInfo[personalInfo.membershipStatus + 1].totalAmount
                                          ? '∞'
                                          : +tiersInfo[personalInfo.membershipStatus + 1].totalAmount -
                                            +tiersInfo[personalInfo.membershipStatus + 1].mintedAmount
                                  } LEFT`}
                        </span>
                    </div>
                </div>
            </div>
            <div className="header-icon">
                <img src={tiersInfo[status + 1].logo} alt={tiersInfo[status + 1].name} />
            </div>
        </div>
    );
};

export default MembershipHeader;
