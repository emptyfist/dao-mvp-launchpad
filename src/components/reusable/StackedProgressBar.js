import clsx from 'clsx';
import { utils } from 'ethers';
import React from 'react';
import { formatterFloat } from '../../helpers/functions';
import { useSaleContext } from '../../context/sale/SaleState';

const StackedProgressBar = ({ isTimeline = false }) => {
    const { salePublic } = useSaleContext();

    let totalToken = utils.parseUnits(salePublic.totalPurchasedTokens, 0);
    let percentClaimed =
        +totalToken !== 0
            ? +utils.formatUnits(utils.parseUnits(salePublic.claimedTokens, 0).mul(1000).div(totalToken), 0) / 10
            : 0;
    let percentUnclaimed =
        +totalToken !== 0
            ? +utils.formatUnits(utils.parseUnits(salePublic.claimableTokens, 0).mul(1000).div(totalToken), 0) / 10
            : 0;

    let lockedTokens = utils.parseUnits(salePublic.lockedTokens, 0);

    let percentLocked = +totalToken !== 0 ? +utils.formatUnits(lockedTokens.mul(1000).div(totalToken), 0) / 10 : 0;

    const Rootdiv = {
        position: 'relative',
        height: `${!isTimeline ? '20px' : '15px'}`,
        width: '100%',
        background: '#3F5266',
        borderRadius: '20px',
        boxShadow: `${
            !isTimeline
                ? '0px 0px 0px 1.6px #1A2238, -4px -4px 8px rgba(255, 255, 255, 0.1), 4px 8px 8px rgba(1, 7, 19, 0.2)'
                : ''
        }`,
    };

    const Parentdiv = {
        height: '100%',
        width: `${percentClaimed + percentUnclaimed}%`,
        background: '#11A3B7',
        borderRadius: '20px',
    };

    const Childdiv = {
        position: 'absolute',
        height: `${!isTimeline ? '20px' : '15px'}`,
        width: `${percentClaimed}%`,
        background: 'linear-gradient(180deg, #22b9b5 0%, #37d6b2 100%)',
        borderRadius: '20px',
        top: '0',
    };

    return (
        <div className="stackedprogress-bar-wrapper">
            <div style={Rootdiv}>
                <div style={Parentdiv}></div>
                <div style={Childdiv}></div>
            </div>
            <div className={clsx('token-status-bar', `${!isTimeline ? '' : 'timeline'}`)}>
                <div className="info">
                    <div className="round1"></div>
                    <span>
                        Claimed:{' '}
                        {formatterFloat.format(
                            utils.formatUnits(
                                utils.parseUnits(salePublic.claimedTokens, 0),
                                salePublic.project.tokenDecimals
                            )
                        )}{' '}
                        {salePublic.project.tickerSymbol} (
                        {Intl.NumberFormat('en-US', {
                            maximumFractionDigits: 2,
                        }).format(percentClaimed)}
                        %)
                    </span>
                </div>
                <div className="info">
                    <div className="round2"></div>
                    <span>
                        Claimable:{' '}
                        {formatterFloat.format(
                            utils.formatUnits(
                                utils.parseUnits(salePublic.claimableTokens, 0),
                                salePublic.project.tokenDecimals
                            )
                        )}{' '}
                        {salePublic.project.tickerSymbol} (
                        {Intl.NumberFormat('en-US', {
                            maximumFractionDigits: 2,
                        }).format(percentUnclaimed)}
                        %)
                    </span>
                </div>
                <div className="info">
                    <div className="round3"></div>
                    <span>
                        Locked:{' '}
                        {formatterFloat.format(utils.formatUnits(lockedTokens, salePublic.project.tokenDecimals))}{' '}
                        {salePublic.project.tickerSymbol} (
                        {Intl.NumberFormat('en-US', {
                            maximumFractionDigits: 2,
                        }).format(percentLocked ?? 0)}
                        %)
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StackedProgressBar;
