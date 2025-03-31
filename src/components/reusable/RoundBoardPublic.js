import clsx from 'clsx';
import { utils } from 'ethers';
import React, { useEffect, useRef, useState } from 'react';
import { OtarisLogo } from '../../assets/logos';
import { ExpandArrow } from '../../assets/icons';
import { ProgressBar, Countdown, ControlButton } from '../reusable';
import { currentAvailableInfo } from '../../helpers/functions';
import { useTimerContext } from '../../context/timer/TimerState';
import { SALE_BOARD_STATUS, SALE_STATUS } from '../../config/constants';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useSaleContext } from '../../context/sale/SaleState';

const formatterInt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

const ProgressBarElement = ({ progress }) => {
    const Parentdiv = {
        width: '100%',
        height: '10px',
        background: '#3F5266',
        borderRadius: '20px',
    };

    const Childdiv = {
        height: '100%',
        width: `${progress}%`,
        background: '#5FD2A2',
        borderRadius: '20px',
    };

    return (
        <div className="progress-bar-wrapper-sp">
            <div style={Parentdiv}>
                <div style={Childdiv}></div>
            </div>
        </div>
    );
};

const RoundBoardPublic = () => {
    const { tiersInfo } = useGlobalContext();
    const { currentTime } = useTimerContext();
    const { salePublic, getCurrentSaleStatus } = useSaleContext();
    const [collapsed, setCollapsed] = useState(false);
    const isMounted = useRef(true);

    const [roundStep, setRoundStep] = useState(1);
    const [currentStatus, setCurrentStatus] = useState(SALE_STATUS.New);

    useEffect(() => {
        if (!currentTime || !salePublic?.rounds.length) {
            isMounted.current && setCurrentStatus(SALE_STATUS.New);
            return;
        }

        let status = getCurrentSaleStatus(currentTime);
        if (isMounted.current) {
            if (status < SALE_STATUS.Round1) setRoundStep(1);
            else if (status >= SALE_STATUS.Round1 && status < SALE_STATUS.Round2) setRoundStep(1);
            else if (salePublic.rounds.length === 2 && status >= SALE_STATUS.Round2) setRoundStep(2);
            else if (salePublic.rounds.length === 3) {
                if (status >= SALE_STATUS.Round3) setRoundStep(3);
                else setRoundStep(2);
            } else setRoundStep(salePublic.rounds.length);
        }

        isMounted.current && setCurrentStatus((prev) => status);
        // eslint-disable-next-line
    }, [currentTime, salePublic]);

    const getLabelColor = (roundStep) => {
        if (currentStatus >= SALE_STATUS.New && currentStatus <= SALE_STATUS.Closed) return SALE_BOARD_STATUS.Upcoming;

        if (currentStatus >= SALE_STATUS.Round3End) return SALE_BOARD_STATUS.Completed;

        if (roundStep === 1) {
            switch (currentStatus) {
                case SALE_STATUS.Round1:
                    return SALE_BOARD_STATUS.Ongoing;
                case SALE_STATUS.Round1End:
                case SALE_STATUS.Round2:
                    if (salePublic?.rounds.length > 1) return SALE_BOARD_STATUS.Ongoing;
                    return SALE_BOARD_STATUS.Completed;
                case SALE_STATUS.Round2End:
                case SALE_STATUS.Round3:
                    return SALE_BOARD_STATUS.Completed;
                default:
                    break;
            }
        } else if (roundStep === 2) {
            switch (currentStatus) {
                case SALE_STATUS.Round1:
                case SALE_STATUS.Round1End:
                    return SALE_BOARD_STATUS.Ongoing;
                case SALE_STATUS.Round2:
                    if (salePublic?.rounds.length === 2 && +salePublic.totalSold >= +salePublic.maxSold)
                        return SALE_BOARD_STATUS.Completed;
                    return SALE_BOARD_STATUS.Ongoing;
                case SALE_STATUS.Round2End:
                case SALE_STATUS.Round3:
                    if (salePublic?.rounds.length > 2) return SALE_BOARD_STATUS.Ongoing;
                    return SALE_BOARD_STATUS.Completed;
                default:
                    break;
            }
        } else {
            switch (currentStatus) {
                case SALE_STATUS.Round1:
                case SALE_STATUS.Round1End:
                case SALE_STATUS.Round2:
                case SALE_STATUS.Round2End:
                    return SALE_BOARD_STATUS.Ongoing;
                case SALE_STATUS.Round3:
                    if (salePublic?.rounds.length === 3 && +salePublic.totalSold >= +salePublic.maxSold)
                        return SALE_BOARD_STATUS.Completed;
                    return SALE_BOARD_STATUS.Ongoing;
                default:
                    break;
            }
        }
    };

    useEffect(() => {
        isMounted.current &&
            setCollapsed(
                getLabelColor(roundStep) !== SALE_BOARD_STATUS.Ongoing &&
                    (roundStep !== 1 || currentStatus !== SALE_STATUS.Closed)
            );
        // eslint-disable-next-line
    }, [salePublic, currentStatus]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleClick = () => {
        if (
            getLabelColor(roundStep) === SALE_BOARD_STATUS.Ongoing ||
            getLabelColor(roundStep) === undefined ||
            (roundStep === 1 && currentStatus === SALE_STATUS.Closed)
        )
            return;
        setCollapsed(!collapsed);
    };

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
        <div className={clsx('round-public-wrapper', collapsed ? 'collapsed' : '')}>
            <div className={clsx('left-panel', `${getLabelColor(roundStep)}`)}>
                <div className={clsx('title-container', `${getLabelColor(roundStep)}`)} onClick={handleClick}>
                    <div className="title">
                        <span className="name">Stage:</span>
                        <span className="state"> Sale - Round{roundStep}</span>
                    </div>
                    <div className={'state-group'}>
                        <span className={clsx('title-state', `${getLabelColor(roundStep)}`)}>
                            {getLabelColor(roundStep)}
                        </span>
                        <div className="expand-button" style={{ transform: `rotate(${collapsed ? 0 : 180}deg)` }}>
                            {getLabelColor(roundStep) !== undefined &&
                                getLabelColor(roundStep) !== SALE_BOARD_STATUS.Ongoing && (
                                    <ExpandArrow
                                        fill={
                                            getLabelColor(roundStep) === SALE_BOARD_STATUS.Upcoming
                                                ? '#bac6d2'
                                                : getLabelColor(roundStep) === 'Closed'
                                                ? '#c86267'
                                                : '#11a3b7'
                                        }
                                    />
                                )}
                        </div>
                    </div>
                </div>
                <div className={clsx('collapse-area', collapsed ? 'collapsed' : '')}>
                    <div className="panel-content">
                        <div className="item-container public">
                            {tiersInfo.slice(1).map((item, index) => (
                                <div
                                    className={`item ${item.isExists ? '' : 'coming-soon'} ${
                                        salePublic.membershipTierId === item.id ? 'active' : ''
                                    }`}
                                    key={index}
                                >
                                    <div className="item-img">
                                        <img
                                            className={`${item.isExists ? '' : 'image-grayscale'}`}
                                            src={item.logo}
                                            alt={item.name}
                                        />
                                        <span>{`${item.name}${
                                            salePublic.membershipTierId === item.id ? '(You)' : ''
                                        }`}</span>
                                    </div>
                                    <div className="item-value">
                                        {item.isExists ? (
                                            <>
                                                <span>
                                                    {formatterInt.format(getContribution(item.id).total)} /{' '}
                                                    {formatterInt.format(getContribution(item.id).max)}{' '}
                                                    {salePublic.paymentTokenSymbol ?? 'TBA'}
                                                </span>
                                                {salePublic.membershipTierId === item.id &&
                                                    currentStatus === SALE_STATUS.Round1 && (
                                                        <span>
                                                            {`Contribution limit: ${formatterInt.format(
                                                                +utils.formatUnits(
                                                                    salePublic.allocation,
                                                                    salePublic.paymentTokenDecimals
                                                                )
                                                            )} ${salePublic.paymentTokenSymbol ?? 'TBA'} `}
                                                        </span>
                                                    )}
                                            </>
                                        ) : (
                                            <span>Not available for this sale</span>
                                        )}
                                    </div>
                                    {item.isExists && (
                                        <ProgressBarElement progress={getContribution(item.id).progress} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <ProgressBar title={'Total'} isBoard={true} />
                    </div>
                </div>
                {getLabelColor(roundStep) === SALE_BOARD_STATUS.Ongoing && (
                    <div className="panel-bottom">
                        <ControlButton style={{ width: '40%' }} />
                        <div className="logo-back">
                            <OtarisLogo width={50} height={50} />
                        </div>
                        <Countdown style={{ width: '40%' }} />
                    </div>
                )}
            </div>
            <div className="right-panel">
                <div className={clsx('title', `${getLabelColor(roundStep)}`)} onClick={handleClick}>
                    <span>Stage Info</span>
                </div>
                <div className="panel-content">
                    <span>
                        Only whitelisted users can participate in the sale. Round 1: users can contribute up to their
                        individual allocation for 24 hours. Round 2: First-Come-First-Serve for all whitelisted users
                        until the platform raise cap is reached (without individual allocation cap). Starts right after
                        Round 1 ends and lasts 1 hour.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RoundBoardPublic;
