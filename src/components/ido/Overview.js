import { utils } from 'ethers';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React from 'react';
import { Contribute, TransactionStatus } from '../modals';
import { ControlButton, Countdown, PreviewCountdown } from '../reusable';
import { useWidth } from '../../hooks';
import { formatterInt, formatterFloat, getNumberSuffix } from '../../helpers/functions';
// import { OtarisLogo } from '../../assets/logos';
import { Discord, Globe, Medium, Telegram, Twitter } from '../../assets/icons';
import ProjectLogo from '../../assets/svg/project-logo.svg';
import { PHABLET_WIDTH } from '../../config/constants';

const Overview = ({ data = '', isPreview = false }) => {
    const windowWidth = useWidth();

    const overviewInfo = [
        {
            label: 'Initial Token Circulation',
            value: data?.project?.initialTokenCirculation
                ? `${
                      windowWidth > PHABLET_WIDTH
                          ? formatterInt.format(data.project.initialTokenCirculation)
                          : getNumberSuffix(+data.project.initialTokenCirculation)
                  } ${!data?.project?.tickerSymbol ? 'TBA' : data.project.tickerSymbol}`
                : 'TBA',
        },
        {
            label: 'Total Supply',
            value: data?.project?.totalSupply
                ? `${
                      windowWidth > PHABLET_WIDTH
                          ? formatterInt.format(data.project.totalSupply)
                          : getNumberSuffix(+data.project.totalSupply)
                  } ${!data?.project?.tickerSymbol ? 'TBA' : data.project.tickerSymbol}`
                : 'TBA',
        },
        {
            label: 'Public Sale Price',
            value: data?.project?.publicSalePrice
                ? `${
                      windowWidth > PHABLET_WIDTH
                          ? formatterFloat.format(data.project.publicSalePrice)
                          : getNumberSuffix(+data.project.publicSalePrice)
                  } USD`
                : 'TBA',
        },
        {
            label: 'FDV at Launch',
            value:
                data?.project?.totalSupply && data?.project?.publicSalePrice
                    ? `${
                          windowWidth > PHABLET_WIDTH
                              ? formatterInt.format(+data.project.totalSupply * +data.project.publicSalePrice)
                              : getNumberSuffix(+data.project.totalSupply * +data.project.publicSalePrice)
                      } USD`
                    : 'TBA',
        },
        {
            label: 'Initial Market Cap',
            value:
                data?.project?.initialTokenCirculation && data?.project.publicSalePrice
                    ? `${
                          windowWidth > PHABLET_WIDTH
                              ? formatterInt.format(
                                    +data.project.initialTokenCirculation * data?.project.publicSalePrice
                                )
                              : getNumberSuffix(data.project.initialTokenCirculation * +data?.project.publicSalePrice)
                      } USD`
                    : 'TBA',
        },
    ];

    return (
        <>
            <SkeletonTheme baseColor="#070D1D22" highlightColor="#070D1D80">
                <div className="overview">
                    <div className="left-panel">
                        <div className="logo-wrapper">
                            {!data?.project?.logo && !data?.name ? (
                                <Skeleton height={20} />
                            ) : (
                                <>
                                    <img
                                        width={50}
                                        src={!data?.project?.logo ? ProjectLogo : data.project.logo}
                                        alt="project logo"
                                    />
                                    <span>{data?.name ? data.name.toUpperCase() : 'TBA'}</span>
                                </>
                            )}
                        </div>
                        <div className="token-info">
                            <span className="label">Raise Amount:</span>
                            <span className="value">
                                {!data?.maximumRaiseAmountInPaymentToken ||
                                !data?.paymentTokenDecimals ||
                                !data?.paymentTokenSymbol
                                    ? 'TBA'
                                    : `${formatterInt.format(
                                          +utils.formatUnits(
                                              data.maximumRaiseAmountInPaymentToken,
                                              data.paymentTokenDecimals
                                          )
                                      )} ${data.paymentTokenSymbol}`}
                            </span>
                        </div>
                        <div className="token-info">
                            <span className="label">Price:</span>
                            <span className="value">
                                1 {!data?.project?.tickerSymbol ? 'TBA' : data.project.tickerSymbol} =
                                {!data?.tokenPriceInPaymentToken ||
                                !data?.paymentTokenDecimals ||
                                !data?.paymentTokenSymbol
                                    ? 'TBA'
                                    : `${utils.formatUnits(data.tokenPriceInPaymentToken, data.paymentTokenDecimals)} ${
                                          data.paymentTokenSymbol
                                      }`}
                            </span>
                        </div>
                        <ControlButton style={{ marginTop: '1rem' }} isPreview={isPreview} data={data} />
                        {isPreview ? (
                            <PreviewCountdown data={data} style={{ marginTop: '1rem' }} />
                        ) : (
                            <Countdown isBoard={false} style={{ marginTop: '1rem' }} />
                        )}
                        <div className="logo-back">
                            <img
                                src={data?.project?.logo ? data.project.logo : ProjectLogo}
                                width={100}
                                alt="logo back"
                            />
                        </div>
                        {/* {data?.type && <div className="info-toggle">{data.type}</div>} */}
                    </div>

                    <div className="right-panel">
                        {(data?.project?.website ||
                            data?.project?.telegram ||
                            data?.project?.medium ||
                            data?.project?.twitter) && (
                            <div className="social-wrapper">
                                {data?.project?.website && (
                                    <a
                                        href={data.project.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="Go to Website"
                                    >
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
                                    <a
                                        href={data.project.twitter}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="Go to Twitter"
                                    >
                                        <Twitter fill="#fff" />
                                    </a>
                                )}
                                {data?.project?.medium && (
                                    <a
                                        href={data.project.medium}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="Go to Medium"
                                    >
                                        {data.project.medium.indexOf('medium.com') > 0 ? (
                                            <Medium fill="#fff" />
                                        ) : (
                                            <Discord fill="#fff" />
                                        )}
                                    </a>
                                )}
                            </div>
                        )}
                        <div className="overview-info">
                            <div className="info-container">
                                <h2>Overview</h2>
                                <span className="overview-detail">
                                    {!data?.project?.overview ? 'TBA' : data.project.overview}
                                </span>
                            </div>
                            <div className="info-container">
                                <h2>Key Metrics</h2>
                                <div className="item-container">
                                    {overviewInfo.map((item, index) => (
                                        <div key={index} className="item">
                                            <span className="label">{item.label}</span>
                                            <div className="space-gap" />
                                            <span className="value">
                                                {item.value !== '' ? item.value : <Skeleton width={100} height={15} />}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SkeletonTheme>
            {!isPreview && <Contribute />}
            {!isPreview && <TransactionStatus />}
        </>
    );
};

export default Overview;
