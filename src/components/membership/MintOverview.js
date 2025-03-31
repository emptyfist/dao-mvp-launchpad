import { utils } from 'ethers';
import React, { useState } from 'react';
import useWidth from '../../hooks/useWidth';
import { TABLET_WIDTH, MOBILE_WIDTH } from '../../config/constants';
import { useGlobalContext } from '../../context/global/GlobalState';
import { formatterInt } from '../../helpers/functions';

const MintOverview = () => {
    const windowWidth = useWidth();
    const [currentTab, setCurrentTab] = useState(windowWidth > TABLET_WIDTH ? 3 : 0);
    const { tiersInfo } = useGlobalContext();

    const setTransform = (step) => {
        return step * 100;
    };

    // const mintInfoItem = [
    //     [
    //         { title: 'MINT LIMIT', amount: '0 / ∞' },
    //         { title: 'REQUIREMENT', amount: '3,000 OTA' },
    //         { title: 'IDO POOL ALLOCATION', amount: '40%' },
    //         { title: 'PRIVATE SALE ALLOCATION', amount: 'NO' },
    //     ],
    //     [
    //         { title: 'MINT LIMIT', amount: '0 / 900' },
    //         { title: 'REQUIREMENT', amount: '20,000 OTA' },
    //         { title: 'IDO POOL ALLOCATION', amount: '30%' },
    //         { title: 'PRIVATE SALE ALLOCATION', amount: 'NO' },
    //     ],
    //     [
    //         { title: 'MINT LIMIT', amount: '0 / 150' },
    //         { title: 'REQUIREMENT', amount: '100,000 OTA' },
    //         { title: 'IDO POOL ALLOCATION', amount: '20%' },
    //         { title: 'PRIVATE SALE ALLOCATION', amount: 'YES' },
    //     ],
    //     [
    //         { title: 'MINT LIMIT', amount: '0 / 25' },
    //         { title: 'REQUIREMENT', amount: '500,000 OTA' },
    //         { title: 'IDO POOL ALLOCATION', amount: '10%' },
    //         { title: 'PRIVATE SALE ALLOCATION', amount: 'YES' },
    //     ],
    // ];

    const labelIndex = windowWidth >= TABLET_WIDTH ? 4 - currentTab : currentTab + 1;

    return (
        <div className="mint-overview">
            <div className="htab-container">
                <div className="htab-wrapper">
                    {tiersInfo
                        .slice(1)
                        .reverse()
                        .map((item, index) => (
                            <div
                                className="item-container"
                                key={index}
                                onClick={() => {
                                    if (windowWidth >= TABLET_WIDTH) {
                                        setCurrentTab(index);
                                    } else {
                                        setCurrentTab(4 - index - 1);
                                    }
                                }}
                            >
                                {(windowWidth >= TABLET_WIDTH ||
                                    (windowWidth < TABLET_WIDTH && currentTab === 4 - index - 1)) && (
                                    <p
                                        style={{
                                            fontWeight:
                                                (windowWidth < TABLET_WIDTH && currentTab === 4 - index - 1) ||
                                                (windowWidth >= TABLET_WIDTH && currentTab === index)
                                                    ? 'bold'
                                                    : 'normal',
                                            height: windowWidth < MOBILE_WIDTH ? '0' : '1em',
                                            display: windowWidth < MOBILE_WIDTH ? 'none' : 'block',
                                        }}
                                    >
                                        {item.name.toUpperCase()}
                                    </p>
                                )}

                                <img
                                    className={`${item.isExists ? '' : 'image-grayscale'}`}
                                    src={item.logo}
                                    alt={item.name}
                                />
                            </div>
                        ))}

                    <div
                        className="animated-bg"
                        style={{
                            transform:
                                windowWidth >= TABLET_WIDTH
                                    ? `translateY(${setTransform(currentTab)}%)`
                                    : `translateX(${setTransform(currentTab)}%)`,
                        }}
                    />
                </div>
            </div>
            <div className="mint-icon">
                <div style={{ marginTop: '.5rem' }}>
                    {!tiersInfo[4 - currentTab].isExists && <span>COMING SOON</span>}
                </div>
                <img
                    className={`${tiersInfo[4 - currentTab].isExists ? '' : 'image-grayscale'}`}
                    src={tiersInfo[4 - currentTab].logo}
                    alt={tiersInfo[4 - currentTab].name}
                />
                <div></div>
            </div>
            <div className="mint-info">
                <div className="mint-info-wrapper">
                    <div className="mint-info-container">
                        <div className="mint-info-detail">
                            <span className="title">MINT LIMIT</span>
                            <span className="amount">
                                {tiersInfo[labelIndex].isExists
                                    ? `${tiersInfo[labelIndex].mintedAmount ?? 0} / ${
                                          !+tiersInfo[labelIndex].totalAmount ? '∞' : tiersInfo[labelIndex].totalAmount
                                      }`
                                    : 'TBA'}
                            </span>
                        </div>
                        <div className="mint-info-detail">
                            <span className="title">REQUIREMENT</span>
                            <span className="amount">
                                {tiersInfo[labelIndex].isExists && +tiersInfo[labelIndex].basePrice
                                    ? `${formatterInt.format(+utils.formatUnits(tiersInfo[labelIndex].basePrice))} OTA`
                                    : 'TBA'}
                            </span>
                        </div>
                        <div className="mint-info-detail">
                            <span className="title">IDO POOL ALLOCATION</span>
                            <span className="amount">
                                {tiersInfo[labelIndex].isExists && tiersInfo[labelIndex].idoAllocation
                                    ? `${tiersInfo[labelIndex].idoAllocation} %`
                                    : 'TBA'}
                            </span>
                        </div>
                        <div className="mint-info-detail">
                            <span className="title">PRIVATE SALE ALLOCATION</span>
                            <span className="amount">
                                {tiersInfo[labelIndex].isExists
                                    ? tiersInfo[labelIndex].hasExclusiveSaleAllocation
                                        ? 'YES'
                                        : 'NO'
                                    : 'TBA'}
                            </span>
                        </div>
                        {/* {mintInfoItem[windowWidth >= TABLET_WIDTH ? 3 - currentTab : currentTab].map((item) => (
                            <div className="mint-info-detail" key={item.title}>
                                <span className="title">{item.title}</span>
                                <span className="amount">
                                    {!tiersInfo[windowWidth >= TABLET_WIDTH ? 4 - currentTab : labelIndex].isExists
                                        ? 'TBA'
                                        : item.amount}
                                </span>
                            </div>
                        ))} */}
                    </div>
                    <div className="mint-info-icon"></div>
                </div>
                <img src={tiersInfo[labelIndex].logo} alt={tiersInfo[labelIndex].name} />
            </div>
        </div>
    );
};

export default MintOverview;
