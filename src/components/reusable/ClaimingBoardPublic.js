import clsx from 'clsx';
import { utils } from 'ethers';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React, { useEffect, useRef, useState } from 'react';
import { ControlButton, Countdown, StackedProgressBar } from '.';
import { useTimerContext } from '../../context/timer/TimerState';
import { SALE_BOARD_STATUS, SALE_STATUS } from '../../config/constants';
import { OtarisLogo } from '../../assets/logos';
import { ExpandArrow } from '../../assets/icons';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useSaleContext } from '../../context/sale/SaleState';

const ClaimingBoard = () => {
    const { salePublic, getCurrentSaleStatus } = useSaleContext();
    const { currentTime } = useTimerContext();
    const [collapsed, setCollapsed] = useState(false);
    const isMounted = useRef(true);
    const { personalInfo, tiersInfo } = useGlobalContext();

    const [currentStatus, setCurrentStatus] = useState(SALE_STATUS.New);
    useEffect(() => {
        if (!currentTime) return;
        isMounted.current && setCurrentStatus((prev) => getCurrentSaleStatus(currentTime));
        // eslint-disable-next-line
    }, [currentTime]);

    let saleCompleted = false;
    switch (salePublic.rounds.length) {
        case 1:
            saleCompleted = currentStatus === SALE_STATUS.Round1End;
            break;
        case 2:
            saleCompleted = currentStatus === SALE_STATUS.Round2End;
            break;
        case 3:
            saleCompleted = currentStatus === SALE_STATUS.Round3End;
            break;
        default:
            break;
    }

    const getLabelColor = () => {
        if (currentStatus < SALE_STATUS.Claiming) return SALE_BOARD_STATUS.Upcoming;
        if (currentStatus === SALE_STATUS.Claiming) return SALE_BOARD_STATUS.Ongoing;
        if (currentStatus === SALE_STATUS.ClaimingEnds) {
            if (
                +utils.formatUnits(salePublic.claimableTokens, salePublic.project.tokenDecimals) > 0 ||
                +utils.formatUnits(salePublic.lockedTokens, salePublic.project.tokenDecimals) > 0
            )
                return SALE_BOARD_STATUS.Ongoing;
            return SALE_BOARD_STATUS.Completed;
        }
        if (currentStatus === SALE_STATUS.ClaimingRefund) return SALE_BOARD_STATUS.Ongoing;
        if (currentStatus === SALE_STATUS.ClaimingRefundEnd) return SALE_BOARD_STATUS.Completed;
    };

    useEffect(() => {
        isMounted.current &&
            setCollapsed(
                getLabelColor() !== SALE_BOARD_STATUS.Ongoing &&
                    (getLabelColor() !== SALE_BOARD_STATUS.Upcoming || !saleCompleted)
            );
        // eslint-disable-next-line
    }, [currentStatus]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleClick = () => {
        if (
            (getLabelColor() === SALE_BOARD_STATUS.Upcoming && saleCompleted) ||
            getLabelColor() === SALE_BOARD_STATUS.Ongoing ||
            getLabelColor() === undefined
        )
            return;
        setCollapsed(!collapsed);
    };

    return (
        <SkeletonTheme baseColor="#070D1D22" highlightColor="#070D1D80">
            {currentStatus >= SALE_STATUS.New ? (
                <div className={clsx('claiming-public-wrapper', collapsed ? 'collapsed' : '')}>
                    <div
                        className={clsx(
                            'left-panel',
                            `${
                                getLabelColor() === SALE_BOARD_STATUS.Ongoing ||
                                (getLabelColor() === SALE_BOARD_STATUS.Upcoming && saleCompleted)
                                    ? SALE_BOARD_STATUS.Ongoing
                                    : ''
                            } `
                        )}
                    >
                        <div className={clsx('title-container', `${getLabelColor()}`)} onClick={handleClick}>
                            <div className="title">
                                <span className="name">Stage:</span>
                                <span className="state"> Claiming</span>
                            </div>
                            <div className={'state-group'}>
                                <span
                                    className={clsx(
                                        'title-state',
                                        `${
                                            currentStatus === SALE_STATUS.ClaimingRefund ||
                                            currentStatus === SALE_STATUS.ClaimingRefundEnd
                                                ? SALE_BOARD_STATUS.Refund
                                                : getLabelColor()
                                        }`
                                    )}
                                >
                                    {currentStatus === SALE_STATUS.ClaimingRefund ||
                                    currentStatus === SALE_STATUS.ClaimingRefundEnd
                                        ? SALE_BOARD_STATUS.Refund
                                        : getLabelColor()}
                                </span>
                                <div
                                    className="expand-button"
                                    style={{ transform: `rotate(${collapsed ? 0 : 180}deg)` }}
                                >
                                    {(getLabelColor() !== SALE_BOARD_STATUS.Upcoming || !saleCompleted) &&
                                        getLabelColor() !== SALE_BOARD_STATUS.Ongoing &&
                                        getLabelColor() !== undefined && (
                                            <ExpandArrow
                                                fill={
                                                    getLabelColor() === SALE_BOARD_STATUS.Upcoming
                                                        ? '#bac6d2'
                                                        : '#11a3b7'
                                                }
                                            />
                                        )}
                                </div>
                            </div>
                        </div>
                        <div className={clsx('collapse-area', collapsed ? 'collapsed' : '')}>
                            <div className="panel-content">
                                {currentStatus < SALE_STATUS.Claiming ? (
                                    <span className="detail Upcoming">
                                        {+salePublic.totalSold < +salePublic.maxSold && !saleCompleted
                                            ? 'Wait until the sale is concluded...'
                                            : 'Wait until the token claiming starts...'}
                                    </span>
                                ) : currentStatus === SALE_STATUS.ClaimingRefund ||
                                  currentStatus === SALE_STATUS.ClaimingRefundEnd ? (
                                    <span className={`detail ${getLabelColor()}`}>
                                        Sale has not reached Soft Cap limit...
                                    </span>
                                ) : currentStatus === SALE_STATUS.Claiming &&
                                  (!salePublic.isSaleAndVestingLinked || !salePublic.isVestingDeployed) ? (
                                    <span className={`detail ${getLabelColor()}`}>Coming soon</span>
                                ) : +utils.formatUnits(
                                      salePublic.totalPurchasedTokens,
                                      salePublic.project.tokenDecimals
                                  ) === 0 ? (
                                    <span className={`detail ${getLabelColor()}`}>
                                        You didn’t participated in this sale...
                                    </span>
                                ) : (
                                    <div className="content">
                                        <div className="item-img">
                                            <img
                                                src={tiersInfo[personalInfo.membershipStatus].logo}
                                                alt={tiersInfo[personalInfo.membershipStatus].name}
                                            />
                                            <span>{tiersInfo[personalInfo.membershipStatus].name}</span>
                                        </div>
                                        <StackedProgressBar />
                                    </div>
                                )}
                            </div>
                            {currentStatus === SALE_STATUS.ClaimingRefund ||
                            currentStatus === SALE_STATUS.ClaimingRefundEnd ? (
                                <div className="panel-bottom refund">
                                    <ControlButton style={{ width: '40%' }} />
                                </div>
                            ) : (
                                (+utils.formatUnits(salePublic.claimableTokens, salePublic.project.tokenDecimals) !==
                                    0 ||
                                    +utils.formatUnits(salePublic.lockedTokens, salePublic.project.tokenDecimals) !==
                                        0) && (
                                    <div className="panel-bottom">
                                        <ControlButton style={{ width: '40%' }} />
                                        <div className="logo-back">
                                            <OtarisLogo width={50} height={50} />
                                        </div>
                                        <Countdown style={{ width: '40%' }} />
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                    <div className="right-panel">
                        <div className={clsx('title', `${getLabelColor()}`)} onClick={handleClick}>
                            <span>Stage Info</span>
                        </div>
                        <div className="panel-content">
                            <span>
                                You can claim your tokens according to the vesting schedule's timeline by clicking on
                                the Claim button when the Claiming stage is Ongoing and you have any Claimable tokens.
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="skeleton-container">
                    <Skeleton height={92} borderRadius={20} />
                </div>
            )}
        </SkeletonTheme>
    );
};

export default ClaimingBoard;
