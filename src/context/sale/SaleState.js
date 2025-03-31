import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useContext, useReducer } from 'react';
import { Contract, utils } from 'ethers';
import config from '../../config/config';
import SaleContext from './SaleContext';
import SaleReducer from './SaleReducer';
import { SET_SALE_PUBLIC, SET_USER_BALANCE, SET_CONTROL_BUTTON_STATUS, SET_TIME_OFFSET } from '../types';
import { CONTROL_BUTTON_STATUS, SALE_STATUS, SALE_STEP, SALE_TYPE } from '../../config/constants';

const SaleProvider = ({ children }) => {
    const initialState = {
        timeOffset: null,
        salePublic: {
            id: '',
            project: {
                logo: '',
                overview: '',
                longProjectIntroduction: '',
                website: '',
                telegram: '',
                twitter: '',
                medium: '',
                tickerSymbol: '',
                initialTokenCirculation: '',
                publicSalePrice: '',
                totalSupply: '',
                tokenAddress: '',
                tokenDecimals: 0,
            },
            name: '',
            type: '',
            paymentTokenAddress: '',
            paymentTokenDecimals: 0,
            paymentTokenSymbol: '',
            isSaleAndVestingLinked: false,
            isVestingDeployed: false,
            maximumRaiseAmountInPaymentToken: '',
            minimumRaiseAmountInPaymentToken: '',
            isMinimumRaiseAmountReached: false,
            tokenPriceInPaymentToken: '',
            totalApplied: 0,
            whitelistStartsAt: '',
            whitelistEndsAt: '',
            rounds: [],
            restrictedCountries: [],
            tiers: [],
            overview: null,
            telegramGroupLink: null,
            discordGroupLink: null,
            twitterLink: null,
            linkToTweet: null,
            unlimitedAvailableSpots: 0,
            question1: null,
            correctAnswer1: null,
            firstIncorrectAnswer1: null,
            secondIncorrectAnswer1: null,
            question2: null,
            correctAnswer2: null,
            firstIncorrectAnswer2: null,
            secondIncorrectAnswer2: null,
            question3: null,
            correctAnswer3: null,
            firstIncorrectAnswer3: null,
            secondIncorrectAnswer3: null,
            totalContribution: 0,
            minimumContributionLeft: 0,
            isCancelled: false,
            vestingAddress: null,
            claimingSchedule: [],
            totalSold: 0,
            maxSold: 0,
            maxContribution: 0,
            allocation: '0',
            isWhitelisted: false,
            isRefunded: false,
            claimedTokens: '0',
            lockedTokens: '0',
            contribution: '0',
            isApplied: false,
            claimableTokens: '0',
            saleAddress: '',
            totalPurchasedTokens: '0',
            membershipTierId: null,
        },
        userBalance: '0',
        controlButtonStatus: CONTROL_BUTTON_STATUS.None,
    };

    const [salesState, dispatch] = useReducer(SaleReducer, initialState);

    const { controlButtonStatus, userBalance, salePublic, timeOffset } = salesState;

    const setControlButtonStatus = (value) => {
        dispatch({
            type: SET_CONTROL_BUTTON_STATUS,
            payload: value,
        });
    };

    const setUserBalance = (value) => {
        dispatch({
            type: SET_USER_BALANCE,
            payload: value,
        });
    };

    const setSalePublic = (value) => {
        dispatch({
            type: SET_SALE_PUBLIC,
            payload: value,
        });
    };

    const setTimeOffset = (value) => {
        dispatch({
            type: SET_TIME_OFFSET,
            payload: value,
        });
    };

    const updateUserBalance = (account, activeProvider) => {
        if (!account || !salePublic?.paymentTokenAddress) return;

        (async () => {
            try {
                const erc20Contract = new Contract(
                    salePublic.paymentTokenAddress,
                    config.abis.erc20,
                    activeProvider.getSigner()
                );

                const userBalance = await erc20Contract.balanceOf(account);

                setUserBalance(
                    utils.formatUnits(
                        userBalance,
                        +salePublic.paymentTokenDecimals > 0 ? salePublic.paymentTokenDecimals : 6
                    )
                );
            } catch (error) {
                console.log(error);
            }
        })();
    };

    const getCurrentSaleStatus = (currentTime = undefined) => {
        dayjs.extend(utc);
        if (currentTime === undefined && timeOffset) currentTime = dayjs().utc().add(timeOffset);

        if (salePublic.type !== SALE_TYPE.Private) {
            if (!salePublic.whitelistStartsAt || dayjs(salePublic.whitelistStartsAt).diff(currentTime) > 0)
                return SALE_STATUS.New;
            if (
                dayjs(salePublic.whitelistStartsAt).diff(currentTime) <= 0 &&
                dayjs(salePublic.whitelistEndsAt).diff(currentTime) > 0
            )
                return SALE_STATUS.Open;
            if (
                dayjs(salePublic.whitelistEndsAt).diff(currentTime) <= 0 &&
                (salePublic.rounds.length < 1 || dayjs(salePublic.rounds[0].startsAt).diff(currentTime) > 0)
            )
                return SALE_STATUS.Closed;
        }

        for (let index = 0; index < salePublic.rounds.length; index++) {
            if (index === 0) {
                if (dayjs(salePublic.rounds[index].startsAt).diff(currentTime) > 0) return SALE_STATUS.Closed;
                else if (dayjs(salePublic.rounds[index].endsAt).diff(currentTime) > 0) {
                    if (
                        salePublic.rounds.length === 1 &&
                        +utils.formatUnits(salePublic.contribution, salePublic.paymentTokenDecimals) >=
                            +utils.formatUnits(salePublic.allocation, salePublic.paymentTokenDecimals)
                    )
                        return SALE_STATUS.Round1End;
                    return SALE_STATUS.Round1;
                }
            } else {
                if (
                    dayjs(salePublic.rounds[index].startsAt).diff(currentTime) <= 0 &&
                    dayjs(salePublic.rounds[index].endsAt).diff(currentTime) > 0
                ) {
                    if (+salePublic.totalSold >= +salePublic.maxSold)
                        return salePublic.rounds.length === 2 ? SALE_STATUS.Round2End : SALE_STATUS.Round3End;
                    else if (
                        index === salePublic.rounds.length - 1 &&
                        +utils.formatUnits(salePublic.maxContribution, salePublic.paymentTokenDecimals) -
                            +utils.formatUnits(salePublic.totalContribution, salePublic.paymentTokenDecimals) <=
                            +utils.formatUnits(salePublic.minimumContributionLeft, salePublic.paymentTokenDecimals)
                    ) {
                        return salePublic.rounds.length === 2 ? SALE_STATUS.Round2End : SALE_STATUS.Round3End;
                    } else
                        return salePublic.rounds.length === 3 && index === 2 ? SALE_STATUS.Round3 : SALE_STATUS.Round2;
                }
            }
        }

        if (salePublic.saleAddress) {
            if (salePublic.isRefunded) {
                return SALE_STATUS.ClaimingRefundEnd;
            } else if (!salePublic.isMinimumRaiseAmountReached) {
                if (+utils.formatUnits(salePublic.contribution, salePublic.paymentTokenDecimals) === 0)
                    return SALE_STATUS.ClaimingEnds;
                return SALE_STATUS.ClaimingRefund;
            }
        }
        // if (
        //     salePublic.minimumRaiseAmountInPaymentToken &&
        //     +utils.formatUnits(salePublic.minimumRaiseAmountInPaymentToken, salePublic.paymentTokenDecimals) >=
        //         +utils.formatUnits(salePublic.totalContribution, salePublic.paymentTokenDecimals)
        // ) {
        //     if (+salePublic.contribution > 0) return SALE_STATUS.ClaimingRefund;
        //     else return SALE_STATUS.ClaimingRefundEnd;
        // }

        if (
            !salePublic.claimingSchedule ||
            salePublic.claimingSchedule.length < 1 ||
            dayjs(salePublic.claimingSchedule[0]).diff(currentTime) > 0
        ) {
            switch (salePublic.rounds.length) {
                case 1:
                    return SALE_STATUS.Round1End;
                case 2:
                    return SALE_STATUS.Round2End;
                default:
                    return SALE_STATUS.Round3End;
            }
        }
        if (
            dayjs(salePublic.claimingSchedule[0]).diff(currentTime) <= 0 &&
            dayjs(salePublic.claimingSchedule[salePublic.claimingSchedule.length - 1]).diff(currentTime) > 0
        ) {
            if (!salePublic.isSaleAndVestingLinked || !salePublic.isVestingDeployed) return SALE_STATUS.Claiming;

            if (
                +utils.formatUnits(salePublic.totalPurchasedTokens, salePublic.project.tokenDecimals) <=
                +utils.formatUnits(salePublic.claimedTokens, salePublic.project.tokenDecimals)
            )
                return SALE_STATUS.ClaimingEnds;
            return SALE_STATUS.Claiming;
        }
        if (dayjs(salePublic.claimingSchedule[salePublic.claimingSchedule.length - 1]).diff(currentTime) <= 0)
            return SALE_STATUS.ClaimingEnds;
    };

    const getStageInfo = (type, round = 0) => {
        if (type === SALE_STEP.WhiteList)
            return { startsAt: salePublic.whitelistStartsAt, endsAt: salePublic.whitelistEndsAt };
        if (type === SALE_STEP.Claiming) {
            if (!salePublic.claimingSchedule?.length)
                return {
                    startsAt: null,
                    endsAt: null,
                    claimingSchedule: [],
                };
            return {
                startsAt: salePublic.claimingSchedule[0],
                endsAt:
                    salePublic.claimingSchedule.length > 1
                        ? salePublic.claimingSchedule[salePublic.claimingSchedule.length - 1]
                        : null,
                claimingSchedule:
                    salePublic.claimingSchedule.length > 2
                        ? salePublic.claimingSchedule.slice(1, salePublic.claimingSchedule.length - 1)
                        : [],
            };
        }

        if (salePublic.rounds.length >= round) return salePublic.rounds[round - 1];
        return { startsAt: null, endsAt: null };
    };

    const getEndTime = (currentTime) => {
        dayjs.extend(utc);
        switch (getCurrentSaleStatus(currentTime)) {
            case SALE_STATUS.New:
                return getStageInfo(SALE_STEP.WhiteList).startsAt;
            case SALE_STATUS.Open:
                return getStageInfo(SALE_STEP.WhiteList).endsAt;
            case SALE_STATUS.Closed:
                return getStageInfo(SALE_STEP.Sale, 1).startsAt;
            case SALE_STATUS.Round1:
                return getStageInfo(SALE_STEP.Sale, 1).endsAt;
            case SALE_STATUS.Round2:
                return getStageInfo(SALE_STEP.Sale, 2).endsAt;
            case SALE_STATUS.Round3:
                return getStageInfo(SALE_STEP.Sale, 3).endsAt;
            case SALE_STATUS.Round1End:
            case SALE_STATUS.Round2End:
            case SALE_STATUS.Round3End:
                return getStageInfo(SALE_STEP.Claiming).startsAt;
            case SALE_STATUS.Claiming:
                const claimStage = getStageInfo(SALE_STEP.Claiming);
                if (claimStage?.claimingSchedule?.length > 0) {
                    for (const schedule of claimStage.claimingSchedule) {
                        if (dayjs(schedule).diff(currentTime) > 0) return schedule;
                    }
                }
                return getStageInfo(SALE_STEP.Claiming).endsAt;
            case SALE_STATUS.ClaimingEnds:
                return getStageInfo(SALE_STEP.Claiming).endsAt;
            default:
                break;
        }
    };

    return (
        <SaleContext.Provider
            value={{
                salesState,
                salePublic,
                setSalePublic,
                getEndTime,
                getCurrentSaleStatus,
                userBalance,
                setUserBalance,
                updateUserBalance,
                controlButtonStatus,
                setControlButtonStatus,
                setTimeOffset,
                getStageInfo,
            }}
        >
            {children}
        </SaleContext.Provider>
    );
};

export const useSaleContext = () => useContext(SaleContext);

export default SaleProvider;
