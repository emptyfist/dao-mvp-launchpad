import clsx from 'clsx';
import React, { useState, useEffect, useRef } from 'react';
import { ProgressBar, Countdown, ControlButton } from '../reusable';
import { OtarisLogo } from '../../assets/logos';
import { ExpandArrow } from '../../assets/icons';
import { SALE_BOARD_STATUS, SALE_TYPE, SALE_STATUS } from '../../config/constants';
import { useTimerContext } from '../../context/timer/TimerState';
import { useSaleContext } from '../../context/sale/SaleState';

const RoundBoard = () => {
    const { currentTime } = useTimerContext();
    const { salePublic, getCurrentSaleStatus } = useSaleContext();
    const [collapsed, setCollapsed] = useState(false);
    const isMounted = useRef(true);

    const [roundStep, setRoundStep] = useState(0);
    const [currentStatus, setCurrentStatus] = useState(SALE_STATUS.New);

    useEffect(() => {
        if (!currentTime || !salePublic?.rounds.length) {
            isMounted.current && setCurrentStatus(SALE_STATUS.New);
            return;
        }

        let status = getCurrentSaleStatus(currentTime);
        if (isMounted.current) {
            if (status <= SALE_STATUS.Round1) setRoundStep(1);
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
                    if (salePublic.rounds.length > 2) return SALE_BOARD_STATUS.Ongoing;
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

    return (
        <div className={clsx('round-wrapper', collapsed ? 'collapsed' : '')}>
            <div className={clsx('left-panel', `${getLabelColor(roundStep)}`)}>
                <div className={clsx('title-container', `${getLabelColor(roundStep)}`)} onClick={handleClick}>
                    <div className="title">
                        <span className="name">Stage:</span>
                        <span className="state">
                            {' '}
                            {`Sale${
                                salePublic?.rounds.length <= 1 || salePublic.type === SALE_TYPE.Private
                                    ? ''
                                    : ' - Round ' + roundStep
                            }`}
                        </span>
                    </div>

                    <div className={'state-group'}>
                        <span className={clsx('title-state', `${getLabelColor(roundStep)}`)}>
                            {getLabelColor(roundStep)}
                        </span>
                        <div className="expand-button" style={{ transform: `rotate(${collapsed ? 0 : 180}deg)` }}>
                            {getLabelColor(roundStep) !== undefined &&
                                getLabelColor(roundStep) !== SALE_BOARD_STATUS.Ongoing &&
                                (roundStep !== 1 || currentStatus !== SALE_STATUS.Closed) && (
                                    <ExpandArrow
                                        fill={
                                            getLabelColor(roundStep) === SALE_BOARD_STATUS.Upcoming
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
                        {roundStep === 1 && currentStatus === SALE_STATUS.Closed ? (
                            <span className="detail Upcoming">
                                Whitelist results will be announced when the sale starts
                            </span>
                        ) : (
                            <ProgressBar title={'Total'} isBoard={true} />
                        )}
                    </div>
                    {(getLabelColor(roundStep) === SALE_BOARD_STATUS.Ongoing ||
                        (roundStep === 1 && currentStatus === SALE_STATUS.Closed)) && (
                        <div className="panel-bottom">
                            <ControlButton style={{ width: '40%' }} />
                            <div className="logo-back">
                                <OtarisLogo width={50} height={50} />
                            </div>
                            <Countdown style={{ width: '40%' }} />
                        </div>
                    )}
                </div>
            </div>
            <div className="right-panel">
                <div className={clsx('title', `${getLabelColor(roundStep)}`)} onClick={handleClick}>
                    <span>Stage Info</span>
                </div>
                <div className={clsx('collapse-area panel-content', collapsed ? 'collapsed' : '')}>
                    <span>
                        You can contribute to the sale with the exact amount defined in the investment contract by
                        clicking on the Contribute button when the Sale is Ongoing.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RoundBoard;
