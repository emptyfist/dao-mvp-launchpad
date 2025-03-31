import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React, { useCallback } from 'react';
import {
    ExpandableArea,
    RoundBoard,
    RoundBoardPublic,
    ClaimingBoard,
    ClaimingBoardPublic,
    VerticalTimeline,
    HorizontalTimeline,
    StickProgressBar,
    WhitelistBoard,
    WhitelistBoardPublic,
} from '../reusable';
import { SALE_TYPE } from '../../config/constants';
import { Ido } from '../../assets/icons';
import { useSaleContext } from '../../context/sale/SaleState';

const Sales = () => {
    const { salePublic } = useSaleContext();
    const getCollapseStatus = useCallback(() => {
        return false;
        // eslint-disable-next-line
    }, [true]);

    return (
        <SkeletonTheme baseColor="#070D1D22" highlightColor="#070D1D80">
            <div className="sales">
                <div className="sales-wrapper">
                    {salePublic.type !== SALE_TYPE.Private && <StickProgressBar />}
                    <HorizontalTimeline />
                    <ExpandableArea isCollapsed={getCollapseStatus}>
                        <div className="page-title">
                            <Ido />
                            <span>Stages</span>
                            <div className="space-gap"></div>
                        </div>
                        <div className="page-container">
                            {!salePublic?.type ? (
                                <Skeleton height={100} width={1024} />
                            ) : salePublic.type === SALE_TYPE.TierBased ? (
                                <>
                                    <WhitelistBoardPublic />
                                    <RoundBoardPublic />
                                    <ClaimingBoardPublic />
                                </>
                            ) : (
                                <>
                                    {salePublic.type === SALE_TYPE.Unlimited && <WhitelistBoard />}
                                    <RoundBoard />
                                    <ClaimingBoard />
                                </>
                            )}
                        </div>
                    </ExpandableArea>
                </div>
                <div className="sales-wrapper-sp">
                    <VerticalTimeline />
                </div>
            </div>
        </SkeletonTheme>
    );
};

export default Sales;
