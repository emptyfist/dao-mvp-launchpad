import clsx from 'clsx';
import React, { useState } from 'react';
import { SimpleButton, ManualProgress } from '../reusable';
import { formatterInt, formatterSmallFloat, getNumberSuffix } from '../../helpers/functions';
import { ArrowDown } from '../../assets/icons';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useModalContext } from '../../context/modal/ModalState';

const RewardsTable = ({ rewards }) => {
    return (
        <div className={`rewards-table`}>
            <div className="rewards-table-body">
                {rewards.map((reward, index) => (
                    <div className="rewards-table-row" key={index}>
                        <div className="reward-logo">
                            <img src={reward.logo} alt={reward.ticker} />
                        </div>
                        <div className="reward-claimable">
                            <span className="balance">
                                {getNumberSuffix(+reward.reward)} {reward.ticker}
                            </span>
                            <span className="exchange focus">
                                ~$ {formatterInt.format(+reward.reward * +reward.exchangeRate)}
                            </span>
                        </div>
                        <span className="right">{formatterSmallFloat.format(+reward.apy)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Reward = ({ reward }) => {
    return (
        <div className={`reward-info`}>
            <div className="reward-contents">
                <div className="reward-token-wrapper">
                    <div className="reward-logo">
                        <img src={reward.logo} alt={reward.ticker} />
                    </div>
                    <div className="reward-ticker">
                        <span>EARN</span>
                        <span>{reward.ticker}</span>
                    </div>
                </div>
                <div className="reward-claimable">
                    <span>Claimable Rewards</span>
                    <span className="balance">
                        {getNumberSuffix(+reward.reward)} {reward.ticker}
                    </span>
                    <span className="exchange focus">
                        ~$ {formatterInt.format(+reward.reward * +reward.exchangeRate)}
                    </span>
                </div>
            </div>
        </div>
    );
};

const RewardDetails = ({ data, isOpen }) => {
    return (
        <div className={`reward-details ${isOpen ? 'open' : ''}`}>
            <div className="reward-details-wrapper">
                <div className="reward-potential-title focus">Your potential rewards</div>
                <div className="reward-potential-table">
                    <div className="reward-period">
                        <span className="focus">Weekly</span>
                        <span className="focus">Monthly</span>
                    </div>
                    {data.rewards.map((reward, index) => (
                        <div className="reward-row" key={index}>
                            <span>
                                {getNumberSuffix(+reward.weekly)} {reward.ticker}
                            </span>
                            <span>
                                {getNumberSuffix(+reward.monthly)} {reward.ticker}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="reward-potential-distributed">
                    <ManualProgress
                        title={'Total Rewards Distributed'}
                        progress={Math.ceil(data.totalDistributed)}
                        endTime={data.endsAt}
                    />
                </div>
                <div className="deposit-fee">
                    <span className="focus">Deposit fee:</span>&nbsp;
                    <span>{formatterSmallFloat.format(data.fee)}%</span>
                </div>
                <div className="total-liquidity">
                    <span className="focus">Total Liquidity:</span>&nbsp;
                    <span>
                        {formatterSmallFloat.format(data.totalLiquidity)} {data.baseToken.ticker}
                    </span>
                    &nbsp;&nbsp;
                    <span className="exchange focus">
                        ~${getNumberSuffix(+data.totalLiquidity * +data.exchangeRate)}
                    </span>
                </div>
            </div>
        </div>
    );
};

const PoolCard = ({ data, staking = true }) => {
    const { openModal, setModalData } = useModalContext();
    const { account, isValidWallet } = useGlobalContext();
    const [detailOpen, setDetailOpen] = useState(false);

    const getTotalAPY = () => {
        return data.rewards.reduce((total, reward) => {
            return total + +reward.apy;
        }, 0);
    };

    return (
        // <SkeletonTheme baseColor="#070D1D22" highlightColor="#070D1D80">
        <div className="pool-card">
            <div className="pool-overview">
                <div className="token-info">
                    {staking ? (
                        <>
                            <div className="token-image">
                                <img src={data.baseToken.logo} alt={data.baseToken.ticker} />
                            </div>
                            <div className="token-symbol">
                                <span className="description focus">STAKE</span>
                                <span>{data.baseToken.ticker}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="token-pair">
                                <div className="token-image">
                                    <img src={data.firstToken.logo} alt={data.firstToken.ticker} />
                                </div>
                                <div className="token-image">
                                    <img src={data.secondToken.logo} alt={data.secondToken.ticker} />
                                </div>
                            </div>
                            <div className="token-symbol">
                                <span>{data.firstToken.ticker}</span>
                                <span>{data.secondToken.ticker}</span>
                            </div>
                        </>
                    )}
                </div>
                <div className="pool-info">
                    <div className="div-apy">
                        <span className="label focus">TOTAL APY</span>
                        <span className="apy">{formatterSmallFloat.format(getTotalAPY())}%</span>
                    </div>
                    <div className={`div-indicator ${data.rewards.length === 1 ? 'expand' : ''}`} />
                    <div className="div-balance">
                        <span className="label">Staked Balance</span>
                        <span className="balance">
                            {getNumberSuffix(+data.stakedBalance)} {staking ? data.baseToken.ticker : 'LP'}
                        </span>
                        <span className="exchange focus">
                            ~$ {getNumberSuffix(+data.stakedBalance * +data.exchangeRate)}
                        </span>
                    </div>
                </div>
            </div>
            {data.rewards.length > 1 && (
                <div className="rewards-table-header">
                    <span>Earn</span>
                    <span>Claimable Rewards</span>
                    <span className="right">APY</span>
                </div>
            )}
            {data.rewards.length > 1 ? <RewardsTable rewards={data.rewards} /> : <Reward reward={data.rewards[0]} />}
            <RewardDetails data={data} isOpen={detailOpen} />
            <div className={clsx('button-container', `${data?.balance ? 'with-harvest' : ''}`)}>
                <SimpleButton
                    clickHandler={() => {
                        // if (!isValidWallet || !account) {
                        //     openModal('connectWallet');
                        //     return;
                        // }
                        setModalData({ isStake: staking });
                        openModal('stake');
                    }}
                >
                    {isValidWallet && account ? (data?.balance ? 'Stake/Unstake' : 'Stake') : 'Connect Wallet'}
                </SimpleButton>
                {data?.balance > 0 && <SimpleButton>Harvest</SimpleButton>}
            </div>
            <div className="footer">
                <div
                    className={`details-open ${detailOpen ? 'open' : ''}`}
                    onClick={(e) => setDetailOpen((prev) => !prev)}
                >
                    <span>{detailOpen ? 'Hide' : 'Details'}</span>
                    <ArrowDown />
                </div>
            </div>
        </div>
        // </SkeletonTheme>
    );
};

export default PoolCard;
