import clsx from 'clsx';
import { utils } from 'ethers';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React from 'react';
import { SALE_STATUS } from '../../config/constants';
import { useSaleContext } from '../../context/sale/SaleState';

const WHITELIST = 0;
const SALE = 1;
const CLAIMING = 2;

const stickProcessInfo = [
    { title: 'Whitelist', percent: 33.3 },
    { title: 'Sale', percent: 33.3 },
    { title: 'Claiming', percent: 33.3 },
];

const StickProgressBarElement = ({ processData, processStatus, processDataIndex }) => {
    const { salePublic } = useSaleContext();

    const H_div = {
        width: `${processData.percent}%`,
    };

    let lockedTokens = utils
        .parseUnits(salePublic.totalPurchasedTokens, 0)
        .sub(utils.parseUnits(salePublic.claimedTokens, 0))
        .sub(utils.parseUnits(salePublic.claimableTokens, 0));

    const getDivStyle = (isEnd = false) => {
        switch (processDataIndex) {
            case WHITELIST:
                if (processStatus < SALE_STATUS.Open) return 'Upcoming';
                if (processStatus >= SALE_STATUS.Closed) {
                    // if (isEnd && (processStatus === SALE_STATUS.Round1 || processStatus === SALE_STATUS.Round2))
                    //     return 'Ongoing';
                    return 'Completed';
                }
                return 'Ongoing';
            case SALE:
                if (processStatus < SALE_STATUS.Round1) return 'Upcoming';
                if (processStatus >= SALE_STATUS.Round2End) {
                    return 'Completed';
                }
                return 'Ongoing';
            case CLAIMING:
                if (processStatus < SALE_STATUS.Claiming) return 'Upcoming';
                if (processStatus === SALE_STATUS.ClaimingEnds) {
                    if (
                        +utils.formatUnits(salePublic.claimableTokens, salePublic.project.tokenDecimals) > 0 ||
                        +utils.formatUnits(lockedTokens, salePublic.project.tokenDecimals) > 0
                    )
                        return 'Ongoing';
                    return 'Completed';
                }
                return 'Ongoing';
            default:
                break;
        }
    };

    return (
        <div style={H_div} className="stickprogress-bar-container">
            <span className="title">{processData.title}</span>
            <div className="progress">
                {processDataIndex === 0 && <div className={clsx('v-div', `${getDivStyle()}`)}></div>}
                <div className={clsx('h-div', `${getDivStyle()}`)}></div>

                <div className={clsx('v-div', `${getDivStyle(true)}`)}></div>
            </div>
        </div>
    );
};

const StickProgressBar = () => {
    const { getCurrentSaleStatus, salePublic } = useSaleContext();

    return (
        <SkeletonTheme baseColor="#070D1D22" highlightColor="#070D1D80">
            <div className="stickprogress-bar-wrapper">
                {!salePublic?.id ? (
                    <Skeleton height={30} borderRadius={12} />
                ) : (
                    stickProcessInfo.map((item, index) => (
                        <StickProgressBarElement
                            processData={item}
                            processStatus={getCurrentSaleStatus()}
                            processDataIndex={index}
                            key={index}
                        />
                    ))
                )}
            </div>
        </SkeletonTheme>
    );
};

export default StickProgressBar;
