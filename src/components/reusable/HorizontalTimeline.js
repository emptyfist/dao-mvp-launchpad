import clsx from 'clsx';
import dayjs from 'dayjs';
import { utils } from 'ethers';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React, { useMemo } from 'react';
import { useTimerContext } from '../../context/timer/TimerState';
import { SALE_STATUS, SALE_STEP, SALE_TYPE } from '../../config/constants';
import { useSaleContext } from '../../context/sale/SaleState';

const TimelineElement = ({ timelineData, timelineStatus, length, timelineDataIndex, startIndex }) => {
    const { salePublic } = useSaleContext();

    const getWidth = () => {
        if (timelineDataIndex === startIndex || timelineDataIndex === SALE_STATUS.ClaimingEnds)
            return {
                width: `${100 / (length * 2 - 2)}%`,
            };

        return {
            width: `${(100 / (length * 2 - 2)) * 2 - 1}%`,
        };
    };

    const getAlignPos = () => {
        if (timelineDataIndex === startIndex) return 'leftAlign';
        else if (timelineDataIndex === SALE_STATUS.ClaimingEnds) return 'rightAlign';

        return 'centerAlign';
    };

    let lockedTokens = utils.parseUnits(salePublic.lockedTokens, 0);

    const getDivStyle = () => {
        if (timelineDataIndex < timelineStatus) return 'Completed';
        if (timelineDataIndex === timelineStatus) {
            if (timelineStatus === SALE_STATUS.ClaimingEnds) {
                if (
                    +utils.formatUnits(salePublic.claimableTokens, salePublic.project.tokenDecimals) > 0 ||
                    +utils.formatUnits(lockedTokens, salePublic.project.tokenDecimals) > 0
                )
                    return 'Ongoing';
                return 'Completed';
            } else if (timelineStatus === SALE_STATUS.Closed) return 'Completed';
            return 'Ongoing';
        }
        return 'Upcoming';
    };

    return (
        <div className={clsx('horizontal-timeline-container', `${getAlignPos()}`)} style={getWidth()}>
            <span className="title">{timelineData.title}</span>
            <div className="spot">
                {timelineDataIndex !== startIndex && <div className={clsx('timeline-bar', `${getDivStyle()}`)}></div>}
                <div className={clsx('timeline-spot', `${getDivStyle()}`)}></div>
                {timelineDataIndex !== SALE_STATUS.ClaimingEnds && (
                    <div className={clsx('timeline-bar', `${getDivStyle()}`)}></div>
                )}
            </div>
            <div className={clsx('detail', `${getAlignPos()}`)}>
                {!timelineData.dateTime ? (
                    'TBA'
                ) : (
                    <>
                        <span className="detail-info">
                            {timelineData.dateTime ? dayjs(timelineData.dateTime).format('MM/DD/YYYY') : 'TBA'}
                        </span>
                        <span className="detail-info">
                            {timelineData.dateTime ? dayjs(timelineData.dateTime).format('HH:mm') : 'TBA'}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

const HorizontalTimeline = () => {
    const { salePublic, getStageInfo, getCurrentSaleStatus } = useSaleContext();
    let timelineInfo = [];

    if (salePublic.type !== SALE_TYPE.Private) {
        timelineInfo.push(
            {
                index: SALE_STATUS.Open,
                title: 'Open',
                dateTime: getStageInfo(SALE_STEP.WhiteList).startsAt,
            },
            {
                index: SALE_STATUS.Closed,
                title: 'Closed',
                dateTime: getStageInfo(SALE_STEP.WhiteList).endsAt,
            }
        );
    }

    if (salePublic.rounds.length < 1) {
        timelineInfo.push(
            {
                index: SALE_STATUS.Round1,
                title: 'Sale Start',
                dateTime: null,
            },
            {
                index: SALE_STATUS.Round1End,
                title: 'Sale End',
                dateTime: null,
            }
        );
    } else {
        for (let index = 1; index <= salePublic.rounds.length; index++) {
            timelineInfo.push({
                index: SALE_STATUS.Round1 + (index - 1) * 2,
                title: salePublic.rounds.length === 1 ? 'Sale Start' : 'Round ' + index,
                dateTime: getStageInfo(SALE_STEP.Sale, index).startsAt,
            });
        }
    }

    timelineInfo.push(
        {
            index: SALE_STATUS.Claiming,
            title: 'Claiming Starts',
            dateTime: getStageInfo(SALE_STEP.Claiming).startsAt,
        },
        {
            index: SALE_STATUS.ClaimingEnds,
            title: 'Claiming Ends',
            dateTime: getStageInfo(SALE_STEP.Claiming).endsAt,
        }
    );

    const { currentTime } = useTimerContext();
    const currentStatus = useMemo(() => {
        if (!currentTime) return SALE_STATUS.Round1;
        else return getCurrentSaleStatus(currentTime);
        // eslint-disable-next-line
    }, [currentTime]);

    return (
        <SkeletonTheme baseColor="#070D1D22" highlightColor="#070D1D80">
            <div className="horizontal-timeline-wrapper">
                {timelineInfo.length < 1 ? (
                    <Skeleton height={30} borderRadius={12} />
                ) : (
                    timelineInfo.map((item) => (
                        <TimelineElement
                            startIndex={timelineInfo[0].index}
                            timelineData={item}
                            timelineStatus={currentStatus}
                            length={timelineInfo.length}
                            timelineDataIndex={item.index}
                            key={item.index}
                        />
                    ))
                )}
            </div>
        </SkeletonTheme>
    );
};

export default HorizontalTimeline;
