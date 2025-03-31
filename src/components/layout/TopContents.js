import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context/global/GlobalState';
import CollapseArea from './Collapse/CollapseArea';
import { ExpandableArea, SimpleButton } from '../reusable';
import { Farming, Ido, Checked } from '../../assets/icons';
import { formatterFloat } from '../../helpers/functions';
import { getMyPools } from '../../config/mock';

const TopContents = () => {
    const { account, personalInfo, publicInfo, otaBalance, setPersonalInfo, tiersInfo } = useGlobalContext();
    const [isCollapsed, setCollapsed] = useState(true);
    let navigate = useNavigate();

    const getCollapseStatus = useCallback(() => {
        return isCollapsed;
    }, [isCollapsed]);

    const changeCollapse = (e) => {
        if (!account) return;
        setCollapsed((prev) => !prev);
    };

    const maxRows =
        personalInfo.sales.length > personalInfo.stakings.length
            ? personalInfo.sales.length
            : personalInfo.stakings.length;

    const onMembership = () => {
        navigate('/member');
    };

    const isMounted = useRef(true);
    useEffect(() => {
        isMounted.current && setPersonalInfo(getMyPools());
        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line
    }, []);

    return (
        <div className="top-content">
            <div className="back-mask" />
            <div className="back-left-mask" />
            <div className="back-right-mask" />
            <div className="sticky-wrapper" />
            <div className="top-content-wrapper">
                <div className="top-content-container">
                    <div className="left">
                        <img
                            src={tiersInfo[personalInfo.membershipStatus].logo}
                            alt={tiersInfo[personalInfo.membershipStatus].name}
                        />
                        <div className="item-container">
                            <div className="item-header">
                                <span className="title">Personal Info</span>
                                <div className="space-gap" />
                            </div>
                            <div className="item">
                                <span className="membership">
                                    Otaris {tiersInfo[personalInfo.membershipStatus].name}
                                </span>
                                <Checked fill="#33ABE6" width={18} height={18} />
                            </div>
                            <div className="item">
                                <span className="address">
                                    {!account ? '0x00...0000' : `${account.slice(0, 4)}...${account.slice(-4)}`}
                                </span>
                            </div>
                            <SimpleButton
                                tooltipId="getMembershipTip"
                                className="has-qa-mark"
                                isQA={true}
                                clickHandler={onMembership}
                            >
                                <span>Get NFT Membership</span>
                            </SimpleButton>
                        </div>
                    </div>
                    <div className="item-container">
                        <div className="item-header">
                            <span className="title">My Actions</span>
                            <div className="space-gap" />
                        </div>
                        <div className="item-content">
                            <div className="subtitle-container">
                                <Farming />
                                <span className="subtitle">Unclaimed Rewards:</span>
                            </div>
                            <span className="value">~${formatterFloat.format(personalInfo.claimableRewards)}</span>
                        </div>
                        <div className="item-content">
                            <div className="subtitle-container">
                                <Ido />
                                <span className="subtitle">Sales Contributions:</span>
                            </div>
                            <span className="value">{`${personalInfo.contributions} Available`}</span>
                        </div>
                        <SimpleButton clickHandler={changeCollapse} isDisabled={!account}>
                            {isCollapsed ? 'See All' : 'Collapse'}
                        </SimpleButton>
                    </div>
                    <div className="item-container">
                        <div className="item-header">
                            <span className="title">Otaris in Wallet</span>
                            <div className="space-gap" />
                        </div>
                        <div className="item">
                            <span className="token">{`${
                                !publicInfo.tokenAddress
                                    ? 'TBA'
                                    : account
                                    ? formatterFloat.format(otaBalance) + ' ' + publicInfo.tickerSymbol
                                    : 0 + ' ' + publicInfo.tickerSymbol
                            }`}</span>
                        </div>
                        <div className="item">
                            <span className="amount">{`${publicInfo.tokenAddress ? '~ $XXX.XX' : 'TBA'}`}</span>
                        </div>
                        <SimpleButton>Get OTA</SimpleButton>
                    </div>
                </div>
                <div className="top-content-container-sp">
                    <div className="item-membership">
                        <img
                            src={tiersInfo[personalInfo.membershipStatus].logo}
                            alt={tiersInfo[personalInfo.membershipStatus].name}
                        />
                        <div className="item-title">
                            <span className="title">Otaris {tiersInfo[personalInfo.membershipStatus].name}</span>
                            <Checked fill="#33ABE6" width={18} height={18} />
                        </div>
                    </div>
                    <div className="item-content">
                        <div className="subtitle-container">
                            <Farming />
                            <span className="subtitle">Unclaimed Rewards:</span>
                        </div>
                        <span className="value">~${formatterFloat.format(personalInfo.claimableRewards)}</span>
                    </div>
                    <div className="item-content">
                        <div className="subtitle-container">
                            <Ido />
                            <span className="subtitle">Sales Contributions:</span>
                        </div>
                        <span className="value">{`${personalInfo.contributions} Available`}</span>
                    </div>
                </div>
                <ExpandableArea
                    isTop={true}
                    isDisabled={!account}
                    isCollapsed={getCollapseStatus}
                    changeCollapseStatus={setCollapsed}
                    maxHeight={250 + (maxRows < 5 ? 110 * maxRows : 550)}
                >
                    <CollapseArea />
                </ExpandableArea>
            </div>
        </div>
    );
};

export default TopContents;
