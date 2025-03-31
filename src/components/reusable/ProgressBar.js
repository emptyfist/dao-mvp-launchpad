import clsx from 'clsx';
import { utils } from 'ethers';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React from 'react';
import { useWidth } from '../../hooks';
import { getNumberSuffix, formatterFloat, formatterSmallFloat } from '../../helpers/functions';
import { PHABLET_WIDTH, SALE_TYPE } from '../../config/constants';
import { useSaleContext } from '../../context/sale/SaleState';

const ProgressBar = ({ title, isBoard = false }) => {
    const { salePublic } = useSaleContext();
    const windowWidth = useWidth();

    let progress = 0;
    if (salePublic.type === SALE_TYPE.Private) {
        progress =
            +salePublic.allocation > 0
                ? +utils.formatUnits(
                      utils.parseUnits(salePublic.contribution, 0).div(utils.parseUnits(salePublic.allocation, 0)),
                      0
                  ) * 100
                : 0;
    } else {
        progress = +salePublic.maxSold > 0 ? (+salePublic.totalSold / +salePublic.maxSold) * 100 : 0;
    }

    const Parentdiv = {
        width: '100%',
        background: '#1A2238',
        borderRadius: '20px',
        boxShadow: '0px 0px 0px 1.6px #1A2238, -4px -4px 8px rgba(255, 255, 255, 0.1), 4px 8px 8px rgba(1, 7, 19, 0.2)',
    };

    const Childdiv = {
        height: '100%',
        width: `${progress === 0 ? 0 : progress > 5 ? progress : 5}%`,
        background: isBoard
            ? 'linear-gradient(110.05deg, #3BDCB1 13.06%, #11A3B7 84.95%)'
            : 'linear-gradient(180deg, #22b9b5 0%, #37d6b2 100%)',
        borderRadius: '20px',
    };

    return (
        <SkeletonTheme baseColor="#070D1D22" highlightColor="#070D1D80">
            <div className="progress-bar-wrapper">
                <div className={clsx('title-bar', `${isBoard ? 'board' : ''}`)}>
                    <span>{title}</span>
                    {progress >= 0 ? (
                        <span>{formatterSmallFloat.format(progress)}%</span>
                    ) : (
                        <Skeleton height={25} width={200} />
                    )}
                </div>
                <div style={Parentdiv} className={clsx('rootDiv', `${isBoard ? 'board' : ''}`)}>
                    <div style={Childdiv}></div>
                </div>
                {salePublic.type === SALE_TYPE.Private ? (
                    <div className={clsx('token-status-bar', `${isBoard ? 'board' : ''}`)}>
                        {windowWidth > PHABLET_WIDTH ? (
                            <>
                                <span>
                                    {`${formatterFloat.format(
                                        +utils.formatUnits(salePublic.contribution, salePublic.paymentTokenDecimals)
                                    )} ${salePublic?.paymentTokenSymbol ? salePublic?.paymentTokenSymbol : 'TBA'}`}
                                </span>
                                <span>
                                    {`${formatterFloat.format(
                                        +utils.formatUnits(salePublic.allocation, salePublic.paymentTokenDecimals)
                                    )} ${salePublic?.paymentTokenSymbol ? salePublic?.paymentTokenSymbol : 'TBA'}`}
                                </span>
                            </>
                        ) : (
                            <>
                                <span>
                                    {`${getNumberSuffix(
                                        Number(
                                            utils.formatUnits(salePublic.contribution, salePublic.paymentTokenDecimals)
                                        )
                                    )} ${salePublic?.paymentTokenSymbol ? salePublic?.paymentTokenSymbol : 'TBA'}`}
                                </span>
                                <span>
                                    {`${getNumberSuffix(
                                        Number(
                                            utils.formatUnits(salePublic.allocation, salePublic.paymentTokenDecimals)
                                        )
                                    )} ${salePublic?.paymentTokenSymbol ? salePublic?.paymentTokenSymbol : 'TBA'}`}
                                </span>
                            </>
                        )}
                    </div>
                ) : (
                    <div className={clsx('token-status-bar', `${isBoard ? 'board' : ''}`)}>
                        {windowWidth > PHABLET_WIDTH ? (
                            <>
                                <span>
                                    {!salePublic.saleAddress || !salePublic?.maxContribution
                                        ? 'TBA'
                                        : `${formatterFloat.format(
                                              utils.formatUnits(
                                                  salePublic.totalContribution,
                                                  salePublic.paymentTokenDecimals
                                              )
                                          )}/${formatterFloat.format(
                                              utils.formatUnits(
                                                  salePublic.maxContribution,
                                                  salePublic.paymentTokenDecimals
                                              )
                                          )} ${salePublic?.paymentTokenSymbol}`}
                                </span>
                                <span>
                                    {!salePublic.saleAddress || !salePublic?.maxSold
                                        ? 'TBA'
                                        : `${formatterFloat.format(salePublic.totalSold)}/
                                        ${formatterFloat.format(salePublic.maxSold)} ${
                                              salePublic.project.tickerSymbol ?? 'TBA'
                                          }`}
                                </span>
                            </>
                        ) : (
                            <>
                                <span>
                                    {!salePublic.saleAddress || !salePublic?.maxContribution
                                        ? 'TBA'
                                        : `${getNumberSuffix(
                                              Number(
                                                  utils.formatUnits(
                                                      salePublic.totalContribution,
                                                      salePublic.paymentTokenDecimals
                                                  )
                                              )
                                          )}/${getNumberSuffix(
                                              Number(
                                                  utils.formatUnits(
                                                      salePublic.maxContribution,
                                                      salePublic.paymentTokenDecimals
                                                  )
                                              )
                                          )} ${salePublic?.paymentTokenSymbol}`}
                                </span>
                                <span>
                                    {!salePublic.saleAddress || salePublic?.maxSold
                                        ? 'TBA'
                                        : `${getNumberSuffix(Number(salePublic.totalSold))}/${getNumberSuffix(
                                              Number(salePublic.maxSold)
                                          )} ${salePublic.project.tickerSymbol}`}
                                </span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </SkeletonTheme>
    );
};

export default ProgressBar;
