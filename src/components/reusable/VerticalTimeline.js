import clsx from 'clsx';
import dayjs from 'dayjs';
import { utils } from 'ethers';
import React, { useMemo } from 'react';
import { StackedProgressBar } from '../reusable';
import { getNumberSuffix, currentAvailableInfo } from '../../helpers/functions';
import { useTimerContext } from '../../context/timer/TimerState';
import { Exclamation } from '../../assets/icons';
import { SALE_STATUS, SALE_STEP, SALE_TYPE } from '../../config/constants';
import { formatterInt } from '../../helpers/functions';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useSaleContext } from '../../context/sale/SaleState';

const ProgressBarElement = ({ progress }) => {
    const Parentdiv = {
        width: '100%',
        height: '15px',
        background: '#3F5266',
        borderRadius: '20px',
    };

    const Childdiv = {
        height: '100%',
        width: `${progress === 0 ? 0 : progress > 5 ? progress : 5}%`,
        background: '#5FD2A2',
        borderRadius: '20px',
    };

    return (
        <div style={Parentdiv}>
            <div style={Childdiv}></div>
        </div>
    );
};

const SaleRound = () => {
    const { salePublic } = useSaleContext();
    const { tiersInfo } = useGlobalContext();

    let progress = 0;
    if (salePublic.type === SALE_TYPE.Private) {
        progress =
            +salePublic.allocation > 0
                ? +utils.formatUnits(
                      utils.parseUnits(salePublic.contribution, 0).div(utils.parseUnits(salePublic.allocation, 0)),
                      0
                  )
                : 0;
    } else {
        progress = +salePublic.maxSold > 0 ? (+salePublic.totalSold / +salePublic.maxSold) * 100 : 0;
    }

    let totalToken = +salePublic.totalSold;
    let maxToken = +salePublic.maxSold;

    const getContribution = (id) => {
        const currentInfo = currentAvailableInfo(id, salePublic.tiers);
        const progress =
            !currentInfo.contribution || !currentInfo.allocation
                ? 0
                : +utils.formatUnits(
                      utils
                          .parseUnits(currentInfo.contribution, 0)
                          .mul(100)
                          .div(utils.parseUnits(currentInfo.allocation, 0)),
                      0
                  );

        return {
            total: !currentInfo.contribution
                ? 0
                : utils.formatUnits(currentInfo.contribution, salePublic.paymentTokenDecimals),
            max: !currentInfo.allocation
                ? 0
                : utils.formatUnits(currentInfo.allocation, salePublic.paymentTokenDecimals),
            progress: progress > 100 ? 100 : progress,
        };
    };

    return (
        <div className="bar-info">
            <div className="progress-bar-wrapper-sp">
                <div className="title-bar">
                    <span>Total</span>
                </div>
                <ProgressBarElement progress={progress} />
                <div className="token-status-bar">
                    <span>
                        {getNumberSuffix(Number(totalToken))}/{getNumberSuffix(Number(maxToken))}&nbsp;
                        {salePublic?.paymentTokenSymbol}
                    </span>
                </div>
            </div>
            <div className="vertical-divider"></div>
            {salePublic.type === SALE_TYPE.TierBased && (
                <div className="vertical-whitelist-wrapper">
                    {tiersInfo.slice(1).map((tier) => (
                        <div className="each-tier-wrapper" key={tier.name}>
                            <div className="tier-info">
                                <img src={tier.logo} alt={`${tier.name}`} />
                                <span style={{ fontSize: '14px' }}>{tier.name}</span>
                            </div>
                            <ProgressBarElement progress={getContribution(tier.id).progress} />
                            <span className="applied-info" style={{ marginLeft: 0, fontSize: '14px' }}>
                                {formatterInt.format(getContribution(tier.id).total)}/
                                {formatterInt.format(getContribution(tier.id).max)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const TierBasedWhiteList = () => {
    const { tiersInfo } = useGlobalContext();
    const { salePublic } = useSaleContext();
    return (
        <div className="bar-info">
            <div className="vertical-whitelist-wrapper">
                {salePublic.type === SALE_TYPE.Unlimited ? (
                    <>
                        <span>Total Applied</span>
                        <span>
                            {salePublic.totalApplied}/{salePublic.unlimitedAvailableSpots}
                        </span>
                    </>
                ) : (
                    tiersInfo.slice(1).map((tier) => (
                        <div className="each-tier-wrapper">
                            <div className="tier-info">
                                <img src={tier.logo} alt={`${tier.name}`} />
                                <span>{tier.name}</span>
                            </div>
                            <span className="applied-info">
                                {currentAvailableInfo(tier.id, salePublic.tiers).applied}/
                                {currentAvailableInfo(tier.id, salePublic.tiers).spots}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const TimelineElement = ({ timelineData, timelineStatus }) => {
    const { salePublic } = useSaleContext();

    const getDivStyle = () => {
        if (timelineData.keyIndex < timelineStatus) return 'Completed';
        if (timelineData.keyIndex === timelineStatus) {
            if (timelineStatus === SALE_STATUS.ClaimingEnds) {
                if (
                    +utils.formatUnits(salePublic.claimableTokens, salePublic.project.tokenDecimals) > 0 ||
                    +utils.formatUnits(salePublic.lockedTokens, salePublic.project.tokenDecimals) > 0
                )
                    return 'Ongoing';
                return 'Completed';
            } else if (timelineStatus === SALE_STATUS.Closed) return 'Completed';
            return 'Ongoing';
        }
        return 'Upcoming';
    };

    return (
        <div className="vertical-timeline-container">
            <div className="spot-container">
                <div className="spot-wrapper">
                    <div className={clsx('spot', `${getDivStyle()}`)}>
                        <span className="spot-title">{timelineData.title}</span>
                    </div>
                </div>
                <div className="spot-info">
                    <span className="step">
                        {timelineData.stageTitle}
                        <div className="icon-container" /*data-tip data-for={`stageInfoTip${timelineDataIndex}`}*/>
                            <Exclamation />
                        </div>
                        {/* <ReactTooltip
                            className="custom-tooltip"
                            id={`stageInfoTip${timelineDataIndex}`}
                            place="bottom"
                            effect="solid"
                            delayHide={100}
                        >
                            {timelineData.stageInfo}
                        </ReactTooltip> */}
                    </span>

                    <span className="state">
                        {timelineData.dateTime ? dayjs(timelineData.dateTime).format('MM/DD/YYYY HH:mm') : 'TBA'}
                    </span>
                    {/* {timelineData.stageStatus && (
                        <span
                            className={clsx(
                                'state',
                                `${
                                    (timelineData.keyIndex === SALE_STATUS.Round1 ||
                                        timelineData.keyIndex === SALE_STATUS.Round2) &&
                                    timelineStatus === SALE_STATUS.Round3
                                        ? 'current'
                                        : ''
                                }`
                            )}
                        >
                            {timelineData.stageStatus}
                        </span>
                    )} */}
                </div>
            </div>
            <div className="bar-container">
                <div className="bar-wrapper">
                    <div
                        className={clsx('bar', `${getDivStyle()}`)}
                        style={timelineData.keyIndex === SALE_STATUS.ClaimingEnds ? { minHeight: 0 } : {}}
                    ></div>
                </div>
                {timelineStatus === timelineData.keyIndex && timelineStatus === SALE_STATUS.Open && (
                    <TierBasedWhiteList />
                )}
                {timelineStatus === timelineData.keyIndex &&
                    timelineData.keyIndex >= SALE_STATUS.Round1 &&
                    timelineData.keyIndex <= SALE_STATUS.Round3 && <SaleRound />}
                {timelineStatus === timelineData.keyIndex &&
                    timelineStatus === SALE_STATUS.Claiming &&
                    +utils.formatUnits(salePublic.totalPurchasedTokens, salePublic.project.tokenDecimals) !== 0 && (
                        <div className="bar-info">
                            <StackedProgressBar isTimeline={true} />
                        </div>
                    )}
                {timelineStatus === timelineData.keyIndex &&
                    timelineStatus === SALE_STATUS.ClaimingEnds &&
                    (+utils.formatUnits(salePublic.claimableTokens, salePublic.project.tokenDecimals) > 0 ||
                        +utils.formatUnits(salePublic.lockedTokens, salePublic.project.tokenDecimals) > 0) && (
                        <div className="bar-info">
                            <StackedProgressBar isTimeline={true} />
                        </div>
                    )}
            </div>
        </div>
    );
};

const VerticalTimeline = () => {
    const { salePublic, getCurrentSaleStatus, getStageInfo } = useSaleContext();

    let timelineInfo = [];

    if (salePublic.type !== SALE_TYPE.Private) {
        timelineInfo.push(
            {
                keyIndex: SALE_STATUS.Open,
                title: 'Open',
                dateTime: getStageInfo(SALE_STEP.WhiteList).startsAt,
                stageTitle: 'Whitelisting',
            },
            {
                keyIndex: SALE_STATUS.Closed,
                title: 'Closed',
                dateTime: getStageInfo(SALE_STEP.WhiteList).endsAt,
                stageTitle: 'Whitelisting',
            }
        );
    }

    if (salePublic.rounds.length < 1) {
        timelineInfo.push({
            index: SALE_STATUS.Round1,
            title: 'Sale\n Start',
            dateTime: null,
            stageTitle: 'Sale',
        });
    } else {
        for (let index = 1; index <= salePublic.rounds.length; index++) {
            timelineInfo.push({
                keyIndex: SALE_STATUS.Round1 + (index - 1) * 2,
                title: salePublic.rounds.length === 1 ? 'Sale\n Start' : 'Round ' + index,
                dateTime: getStageInfo(SALE_STEP.Sale, index).startsAt,
                stageTitle: 'Sale',
            });
        }
    }

    timelineInfo.push(
        {
            keyIndex: SALE_STATUS.Claiming,
            title: 'First\n Tranche',
            dateTime: getStageInfo('Claiming').startsAt,
            stageTitle: 'Token Release',
        },
        {
            keyIndex: SALE_STATUS.ClaimingEnds,
            title: 'Completed',
            dateTime: getStageInfo('Claiming').endsAt,
            stageTitle: 'Token Release',
        }
    );

    const { currentTime } = useTimerContext();
    const currentStatus = useMemo(() => {
        if (!currentTime) return SALE_STATUS.New;
        else return getCurrentSaleStatus(currentTime);
        // eslint-disable-next-line
    }, [currentTime]);

    return (
        <div className="vertical-timeline-wrapper">
            {timelineInfo.map((item, index) => (
                <TimelineElement timelineData={item} timelineStatus={currentStatus} key={index} />
            ))}
        </div>
    );
};

export default VerticalTimeline;
