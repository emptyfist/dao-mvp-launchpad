import clsx from 'clsx';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React, { useEffect, useRef, useState } from 'react';
import { Countdown, ControlButton } from '../reusable';
import { currentAvailableInfo, formatterInt } from '../../helpers/functions';
import { SALE_BOARD_STATUS, SALE_STATUS } from '../../config/constants';
import { ExpandArrow } from '../../assets/icons';
import { OtarisLogo } from '../../assets/logos';
import { useSaleContext } from '../../context/sale/SaleState';
import { useGlobalContext } from '../../context/global/GlobalState';

const WhitelistBoardPublic = () => {
    const { personalInfo, tiersInfo } = useGlobalContext();
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
                <div className={clsx('whitelist-public-wrapper', collapsed ? 'collapsed' : '')}>
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
                                <div className="item-container public">
                                    {tiersInfo.slice(1).map((item, index) => (
                                        <div
                                            className={clsx(
                                                'item',
                                                personalInfo.membershipStatus === item.blockchainTierId + 1
                                                    ? 'active'
                                                    : ''
                                            )}
                                            key={index}
                                        >
                                            <div className="item-img">
                                                <img
                                                    className={`${item.isExists ? '' : 'image-grayscale'}`}
                                                    src={item.logo}
                                                    alt={item.name}
                                                />
                                                <span>{`${item.name}${
                                                    personalInfo.membershipStatus === item.blockchainTierId + 1
                                                        ? '(You)'
                                                        : ''
                                                }`}</span>
                                            </div>
                                            <div className="item-value">
                                                {item.isExists ? (
                                                    <>
                                                        {getLabelColor() !== SALE_BOARD_STATUS.Upcoming && (
                                                            <span>
                                                                {formatterInt.format(
                                                                    currentAvailableInfo(item.id, salePublic.tiers)
                                                                        .applied
                                                                )}{' '}
                                                                Whitelists
                                                            </span>
                                                        )}
                                                        <span>
                                                            {formatterInt.format(
                                                                currentAvailableInfo(item.id, salePublic.tiers).spots
                                                            )}{' '}
                                                            Available
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span>Not available for this sale</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* )}
                                {saleType === 2 && (
                                    <div className="item-container exclusive">
                                        {MemberShipInfo.slice()
                                            .reverse()
                                            .map(
                                                (item, index) =>
                                                    index > 1 && (
                                                        <div className="item" key={index}>
                                                            <div className="item-img">
                                                                <img src={item.img} alt={item.title} />
                                                                <span>{item.title}</span>
                                                            </div>
                                                            <div className="item-value">
                                                                <span>
                                                                    {formatterInt.format(whitelistValue[index].whitelist)}{' '}
                                                                    Whitelists
                                                                </span>
                                                                <span>
                                                                    {formatterInt.format(whitelistValue[index].available)} Available
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                            )}
                                    </div>
                                )} */}
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

export default WhitelistBoardPublic;
