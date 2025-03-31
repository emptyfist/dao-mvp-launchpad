import { utils } from 'ethers';
import 'react-loading-skeleton/dist/skeleton.css';
import React, { useState } from 'react';
import ProjectLogo from '../../assets/svg/project-logo.svg';
import UniswapLog from '../../assets/svg/uniswap.svg';
import BinanceLog from '../../assets/svg/binance.svg';
import UndefinedLog from '../../assets/svg/undefined.svg';
import { ArrowDown, Discord, Globe, Medium, Telegram, Twitter } from '../../assets/icons';
import { ControlButton, PreviewCountdown, EllipseButton } from '../reusable';
import { formatterInt } from '../../helpers/functions';
import { SALE_GOING_STATUS } from '../../config/constants';

const LiveCard = ({ data }) => {
    const [isCollapsed, setCollapse] = useState(true);

    return (
        <div className="live-card">
            <div className="project-view">
                {(data?.project?.website ||
                    data?.project?.telegram ||
                    data?.project?.medium ||
                    data?.project?.twitter) && (
                    <div className="social-wrapper">
                        {data?.project?.website && (
                            <a href={data.project.website} target="_blank" rel="noreferrer" aria-label="Go to Website">
                                <Globe fill="#fff" />
                            </a>
                        )}
                        {data?.project?.telegram && (
                            <a
                                href={data.project.telegram}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Go to Telegram"
                            >
                                <Telegram fill="#fff" />
                            </a>
                        )}
                        {data?.project?.twitter && (
                            <a href={data.project.twitter} target="_blank" rel="noreferrer" aria-label="Go to Twitter">
                                <Twitter fill="#fff" />
                            </a>
                        )}
                        {data?.project?.medium && (
                            <a href={data.project.medium} target="_blank" rel="noreferrer" aria-label="Go to Medium">
                                {data.project.medium.indexOf('medium.com') > 0 ? (
                                    <Medium fill="#fff" />
                                ) : (
                                    <Discord fill="#fff" />
                                )}
                            </a>
                        )}
                    </div>
                )}
                <div className="project-logo">
                    <img src={!data?.project?.logo ? ProjectLogo : data.project.logo} alt="project logo" />
                </div>
                <div className="project-info">
                    <span className="project-title">{data?.name ? data.name.toUpperCase() : 'TBA'}</span>
                </div>
                <div
                    className="collapse-wrapper"
                    style={{ transform: `rotate(${isCollapsed ? '0' : '-180'}deg)` }}
                    onClick={(e) => setCollapse((prev) => !prev)}
                >
                    <ArrowDown />
                </div>
                {/* {data?.type && <div className="info-toggle">{data.type}</div>} */}
            </div>
            <div className="project-content">
                <div className="price-wrapper">
                    <div className="price-info">
                        <span>Price:</span>
                        <span>
                            1 {!data?.project?.tickerSymbol ? 'TBA' : data.project.tickerSymbol} ={' '}
                            {!data.paymentTokenSymbol || !data.tokenPriceInPaymentToken || !data.paymentTokenDecimals
                                ? 'TBA'
                                : `${formatterInt.format(
                                      +utils.formatUnits(data.tokenPriceInPaymentToken, data.paymentTokenDecimals)
                                  )} ${data.paymentTokenSymbol}`}
                        </span>
                    </div>
                    <div className="price-info">
                        <span>Total raise:</span>
                        <span>
                            {!data.paymentTokenSymbol ||
                            !data?.maximumRaiseAmountInPaymentToken ||
                            !data?.paymentTokenDecimals
                                ? 'TBA'
                                : `${formatterInt.format(
                                      +utils.formatUnits(
                                          data.maximumRaiseAmountInPaymentToken,
                                          data.paymentTokenDecimals
                                      )
                                  )} ${data.paymentTokenSymbol}`}
                        </span>
                    </div>
                </div>
                <ControlButton data={data} isPreview={true} />
                {data.status !== SALE_GOING_STATUS.Completed ? (
                    <PreviewCountdown data={data} />
                ) : (
                    <div className="footer-container">
                        {data?.project?.uniswapMarket && (
                            <EllipseButton>
                                <a
                                    href={data.project.uniswapMarket}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Go to Uniswap"
                                >
                                    <img src={UniswapLog} alt="uniswap logo" />
                                </a>
                            </EllipseButton>
                        )}
                        {data?.project?.binanceMarket && (
                            <EllipseButton>
                                <a
                                    href={data.project.binanceMarket}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Go to Binance"
                                >
                                    <img src={BinanceLog} alt="binance logo" />
                                </a>
                            </EllipseButton>
                        )}
                        {data?.project?.coinbaseMarket && (
                            <EllipseButton>
                                <a
                                    href={data.project.coinbaseMarket}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Go to Coinbase"
                                >
                                    <img src={UndefinedLog} alt="undefined logo" />
                                </a>
                            </EllipseButton>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveCard;
