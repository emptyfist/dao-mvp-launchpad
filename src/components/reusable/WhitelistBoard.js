import clsx from 'clsx';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React, { useState, useEffect, useRef } from 'react';
import { Countdown, ControlButton } from '../reusable';
import { formatterInt } from '../../helpers/functions';
import { OtarisLogo } from '../../assets/logos';
import { ExpandArrow } from '../../assets/icons';
import { SALE_BOARD_STATUS, SALE_STATUS } from '../../config/constants';
import { useSaleContext } from '../../context/sale/SaleState';

const WhitelistBoard = () => {
    const { salePublic, getCurrentSaleStatus } = useSaleContext();
    const [collapsed, setCollapsed] = useState(false);
    const isMounted = useRef(true);

    const getLabelColor = () => {
        switch (getCurrentSaleStatus()) {
            case SALE_STATUS.New:
                return SALE_BOARD_STATUS.Upcoming;
            case SALE_STATUS.Open:
                return SALE_BOARD_STATUS.Ongoing;
            default:
                return SALE_BOARD_STATUS.Completed;
        }
    };

    useEffect(() => {
        isMounted.current && setCollapsed(getLabelColor() !== SALE_BOARD_STATUS.Ongoing);
        // eslint-disable-next-line
    }, [salePublic]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleClick = () => {
        if (
            getLabelColor() === SALE_BOARD_STATUS.Ongoing ||
            getLabelColor() === 'Closed' ||
            getLabelColor() === undefined
        )
            return;
        setCollapsed(!collapsed);
    };

    return (
        <SkeletonTheme baseColor="#070D1D22" highlightColor="#070D1D80">
            {getCurrentSaleStatus() >= SALE_STATUS.New ? (
                <div className={clsx('whitelist-wrapper', collapsed ? 'collapsed' : '')}>
                    <div className={clsx('left-panel', `${getLabelColor()}`)}>
                        <div className={clsx('title-container', `${getLabelColor()}`)} onClick={handleClick}>
                            <div className="title">
                                <span className="name">Stage:</span>
                                <span className="state"> Whitelisting</span>
                            </div>
                            <div className={'state-group'}>
                                <span className={clsx('title-state', `${getLabelColor()}`)}>{getLabelColor()}</span>
                                <div
                                    className="expand-button"
                                    style={{ transform: `rotate(${collapsed ? 0 : 180}deg)` }}
                                >
                                    {getLabelColor() !== undefined && getLabelColor() !== SALE_BOARD_STATUS.Ongoing && (
                                        <ExpandArrow
                                            fill={
                                                getLabelColor() === SALE_BOARD_STATUS.Upcoming ? '#bac6d2' : '#11a3b7'
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={clsx('collapse-area', collapsed ? 'collapsed' : '')}>
                            <div className="panel-content">
                                <div className="content-spots">
                                    <span className={clsx('label', `${getLabelColor()}`)}>Available Spots:</span>
                                    <span className="amount">
                                        {' '}
                                        {formatterInt.format(
                                            +salePublic.unlimitedAvailableSpots - +salePublic.totalApplied
                                        )}
                                        {'/'}
                                        {formatterInt.format(+salePublic.unlimitedAvailableSpots)}
                                    </span>
                                </div>
                                <div className="content-whitelist">
                                    <span className={clsx('label', `${getLabelColor()}`)}>Applied to Whitelist:</span>
                                    <span className="amount"> {formatterInt.format(salePublic.totalApplied)}</span>
                                </div>
                            </div>
                            {getLabelColor() !== SALE_BOARD_STATUS.Completed && (
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
                        <div className={clsx('title', `${getLabelColor()}`)} onClick={handleClick}>
                            <span>Stage Info</span>
                        </div>
                        <div className={clsx('collapse-area panel-content', collapsed ? 'collapsed' : '')}>
                            <span>
                                You have to apply to the whitelist in order to participate in the whitelist lottery.
                                When you apply to the whitelist, you need to fill out the KYC form. Only users with
                                verified KYC can participate in the lottery. Lottery results will be announced at the
                                beginning of the 1st round of the sale.
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

export default WhitelistBoard;
