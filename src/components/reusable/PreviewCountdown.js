import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import ReactTooltip from 'react-tooltip';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React, { useEffect, useState, useRef } from 'react';
import { useTimerContext } from '../../context/timer/TimerState';
import { SALE_GOING_STATUS, SALE_STATUS } from '../../config/constants';
import { useGlobalContext } from '../../context/global/GlobalState';

dayjs.extend(utc);

const PreviewCountdown = ({ data, ...rest }) => {
    const { getSaleStatus, getSaleEndTime, salesList, setSalesList, setSaleStatus } = useGlobalContext();
    const { currentTime } = useTimerContext();
    const [day, setDay] = useState(0);
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);
    const isMounted = useRef(true);

    const _saleStatus = getSaleStatus(currentTime, data?.id ?? '');

    const getText = (isShowing = false) => {
        switch (_saleStatus) {
            case SALE_STATUS.New:
                return 'Whitelist opens in';
            case SALE_STATUS.Open:
                return 'Whitelist closes in';
            case SALE_STATUS.Closed:
                if (data?.rounds.length === 1) return 'Sale starts in';
                else return 'Round 1 starts in';
            case SALE_STATUS.Round1:
                if (data?.rounds.length === 1) return 'Sale ends in';
                else return 'Round 1 ends in';
            case SALE_STATUS.Round2:
                return 'Round2 ends in';
            case SALE_STATUS.Round3:
                return 'Round3 ends in';
            case SALE_STATUS.Round1End:
            case SALE_STATUS.Round2End:
            case SALE_STATUS.Round3End:
                return 'Token claiming starts in';
            case SALE_STATUS.Claiming:
                if (isShowing) {
                    const endTime = getSaleEndTime(currentTime, data?.id ?? '');
                    if (endTime === data?.claimingEndsAt) return 'Claiming ends in';
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
        if (!currentTime || !data?.id) return;

        const endTime = getSaleEndTime(currentTime, data?.id ?? '');
        if (!endTime) {
            initCountdown();
            return;
        }

        let remainingTime = Math.floor(dayjs(endTime).diff(currentTime));
        // console.log(remainingTime);
        let diff = remainingTime / 1000;

        if (remainingTime < 0 || diff < 1) {
            if (
                data.status === SALE_GOING_STATUS.Upcoming ||
                _saleStatus < SALE_STATUS.Open ||
                _saleStatus >= SALE_STATUS.Claiming
            )
                setTimeout(() => {
                    setSalesList(setSaleStatus(salesList, false));
                }, 1000);
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
    }, [currentTime, data]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        <SkeletonTheme baseColor="#070D1D22" highlightColor="#070D1D80">
            <div className="countdown-wrapper outside" {...rest} data-tip data-for={`countdown-tip-${data.id}`}>
                {getText() !== 'Concluded' &&
                (!currentTime || (Math.floor(day + hour + minute + second) === 0 && getText() !== 'Concluded')) ? (
                    !currentTime ? (
                        <Skeleton height={32} borderRadius={12} width={200} style={{ marginTop: '4px' }} />
                    ) : (
                        <div className="time board">TBA</div>
                    )
                ) : (
                    <div className="time board">
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

                <div className="footer">
                    <span>{currentTime && data?.id ? getText(true) : <Skeleton height={10} width={200} />}</span>
                </div>
            </div>
            <ReactTooltip className="countdown-tooltip" id={`countdown-tip-${data.id}`} place="top" effect="solid">
                <span style={{ fontSize: '12px' }}>Next action</span>
                {'\r\n'}
                <span style={{ fontSize: '14px', color: '#5FD2A2' }}>
                    {getSaleEndTime(currentTime, data?.id ?? '')
                        ? dayjs(getSaleEndTime(currentTime, data?.id ?? ''))
                              .utc()
                              .format('MM/DD/YY hh:mm UTC')
                        : 'TBA'}
                </span>
            </ReactTooltip>
        </SkeletonTheme>
    );
};

export default PreviewCountdown;
