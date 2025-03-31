import clsx from 'clsx';
import dayjs from 'dayjs';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React, { useEffect, useState, useRef } from 'react';
import { useTimerContext } from '../../context/timer/TimerState';
import { SALE_STATUS } from '../../config/constants';
import { useSaleContext } from '../../context/sale/SaleState';

const Countdown = ({ isBoard = true, ...rest }) => {
    const { salePublic, getCurrentSaleStatus, getEndTime } = useSaleContext();
    const { currentTime } = useTimerContext();
    const [day, setDay] = useState(0);
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);
    const isMounted = useRef(true);

    const _saleStatus = getCurrentSaleStatus(currentTime);

    const getText = (isShowing = false) => {
        switch (_saleStatus) {
            case SALE_STATUS.New:
                return 'Whitelist opens in';
            case SALE_STATUS.Open:
                return 'Whitelist closes in';
            case SALE_STATUS.Closed:
                if (salePublic?.rounds.length === 1) return 'Sale starts in';
                else return 'Round 1 starts in';
            case SALE_STATUS.Round1:
                if (salePublic?.rounds.length === 1) return 'Sale ends in';
                else return 'Round 1 ends in';
            case SALE_STATUS.Round2:
                return 'Round 2 ends in';
            case SALE_STATUS.Round3:
                return 'Round 3 ends in';
            case SALE_STATUS.Round1End:
            case SALE_STATUS.Round2End:
            case SALE_STATUS.Round3End:
                return 'Token claiming starts in';
            case SALE_STATUS.Claiming:
                if (isShowing) {
                    const endTime = getEndTime(currentTime);
                    if (endTime === salePublic?.claimingEndsAt) return 'Claiming ends in';
                }
                return 'Next Unlock in';
            case SALE_STATUS.ClaimingEnds:
                return 'Concluded';
            default:
                break;
        }
    };

    const initCountdown = () => {
        setSecond(0);
        setMinute(0);
        setHour(0);
        setDay(0);
    };

    useEffect(() => {
        if (!currentTime) return;

        const endTime = getEndTime(currentTime);
        if (!endTime) {
            initCountdown();
            return;
        }

        let remainingTime = Math.floor(dayjs(endTime).diff(currentTime));
        // console.log(remainingTime);
        let diff = remainingTime / 1000;

        if (remainingTime < 0) {
            initCountdown();
            return;
        }

        isMounted.current && setSecond(diff % 60);

        diff /= 60;
        isMounted.current && setMinute(diff % 60);

        diff /= 60;
        isMounted.current && setHour(diff % 24);
        isMounted.current && setDay(diff / 24);
        remainingTime--;

        // eslint-disable-next-line
    }, [currentTime]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        <SkeletonTheme baseColor="#070D1D22" highlightColor="#070D1D80">
            <div className={clsx('countdown-wrapper', `${isBoard ? 'outside' : ''}`)} {...rest}>
                {!isBoard && (
                    <div className={clsx('header', `${getText() === 'Concluded' ? 'expired' : ''}`)}>
                        {currentTime && salePublic?.id && _saleStatus >= SALE_STATUS.New ? (
                            <>
                                <span>{getText(true) + ':'}</span>
                                <span>{getEndTime() ? dayjs(getEndTime()).format('MM/DD/YY HH:mm') : 'TBA'}</span>
                            </>
                        ) : (
                            <Skeleton height={10} width={200} />
                        )}
                    </div>
                )}

                {(isBoard || getText() !== 'Concluded') &&
                (!currentTime || (Math.floor(day + hour + minute + second) === 0 && getText() !== 'Concluded')) ? (
                    !currentTime ? (
                        isBoard ? (
                            <Skeleton height={32} borderRadius={12} width={200} style={{ marginTop: '4px' }} />
                        ) : (
                            <Skeleton height={32} borderRadius={12} style={{ marginTop: '4px' }} />
                        )
                    ) : (
                        <div className={clsx('time', `${isBoard ? 'board' : ''}`)}>TBA</div>
                    )
                ) : (
                    <div className={clsx('time', `${isBoard ? 'board' : ''}`)}>
                        <p>
                            {Math.floor(day)}
                            <sub>D</sub>
                        </p>
                        <p>
                            {Math.floor(hour)}
                            <sub>H</sub>
                        </p>
                        <p>
                            {Math.floor(minute)}
                            <sub>MIN</sub>
                        </p>
                        <p>
                            {Math.floor(second)}
                            <sub>SEC</sub>
                        </p>
                    </div>
                )}

                {isBoard && (
                    <div className="footer">
                        <span>
                            {currentTime && salePublic?.id ? getText(true) : <Skeleton height={20} width={200} />}
                        </span>
                    </div>
                )}
            </div>
        </SkeletonTheme>
    );
};

export default Countdown;
