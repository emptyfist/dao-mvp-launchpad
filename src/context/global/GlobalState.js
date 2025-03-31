import dayjs from 'dayjs';
import { ethers } from 'ethers';
import utc from 'dayjs/plugin/utc';
import socketIOClient from 'socket.io-client';
import { Contract, utils } from 'ethers';
import React, { useContext, useReducer, useRef } from 'react';
import GlobalContext from './GlobalContext';
import GlobalReducer from './GlobalReducer';
import config from '../../config/config';
import { MemberShipInfo } from '../../config/membershipinfo';

import {
    SET_ACCOUNT,
    SET_WALLET_CONNECTION,
    DISCONNECT_WALLET,
    SET_WALLET_STATUS,
    SET_JWT_TOKEN,
    SET_KYC_STATUS,
    SET_KYC_INFO,
    SET_KYC_SUBMITTING,
    SET_WRONG_NETWORK,
    SET_SALES_LIST,
    SET_PERSONAL_INFO,
    SET_FARMING_POOLS,
    SET_STAKING_POOLS,
    SET_PENDING_EMAIL,
    SET_KYC_EMAIL,
    SET_OTA_BALANCE,
    SET_PUBLIC_INFO,
    SET_TIERS_INFO,
    SET_TIERS_UPDATE,
    SET_MEMBERSHIP_STATUS,
    SET_GLOBAL_TIME_OFFSET,
} from '../types';
import {
    ID_TYPE_DOCUMENT,
    KYC_STATUS,
    MEMBERSHIP_STATUS,
    SALE_STEP,
    SALE_STATUS,
    SALE_TYPE,
    SALE_GOING_STATUS,
} from '../../config/constants';
import { fetchWrapper } from '../../helpers/fetch-wrapper';

let WSS_URL = '';
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    WSS_URL = process.env.REACT_APP_WS_URL;
} else {
    const patterns = window.location.href.split('-');
    WSS_URL = `wss://${patterns[1]}-api.faculty.tools`;
}

const GlobalProvider = ({ children }) => {
    const privateSocket = useRef(
        socketIOClient(WSS_URL, {
            autoConnect: false,
            path: '/auth',
        })
    );

    const publicSocket = useRef(
        socketIOClient(WSS_URL, {
            autoConnect: false,
            path: '/public',
        })
    );

    const initialState = {
        timeOffset: null,
        currentWallet: '',
        activeProvider: null,
        account: null,
        isValidWallet: false,
        jwtToken: false,
        kycStatus: KYC_STATUS.NONE,
        kycInfo: {
            documentType: ID_TYPE_DOCUMENT,
            countryId: '',
            firstName: '',
            lastName: '',
            email: '',
            front: null,
            frontName: '',
            back: null,
            backName: '',
            selfie: null,
            selfieName: '',
            errors: null,
            telegramUsername: '',
            twitterUsername: '',
        },
        personalInfo: {
            claimableRewards: 0,
            contributions: 0,
            membershipStatus: MEMBERSHIP_STATUS.Visitor,
            sales: [],
            stakings: [],
        },
        publicInfo: {
            tierFactoryAddress: '',
            tickerSymbol: '',
            tokenAddress: '',
        },
        tiersInfo: MemberShipInfo,
        farmings: [],
        stakings: [],
        otalBalance: '0',
        wrongNetwork: false,
        salesList: [],
        isKYCSubmitting: false,
        pendingEmail: '',
    };

    const reCaptchaRef = useRef();
    const [state, dispatch] = useReducer(GlobalReducer, initialState);

    const {
        account,
        currentWallet,
        activeProvider,
        timeOffset,
        isValidWallet,
        jwtToken,
        kycInfo,
        kycStatus,
        personalInfo,
        publicInfo,
        wrongNetwork,
        salesList,
        otaBalance,
        farmings,
        stakings,
        isKYCSubmitting,
        pendingEmail,
        tiersInfo,
    } = state;

    const setAccount = (data) => {
        dispatch({
            type: SET_ACCOUNT,
            payload: data,
        });
    };

    const setGlobalTimeOffset = (value) => {
        dispatch({
            type: SET_GLOBAL_TIME_OFFSET,
            payload: value,
        });
    };

    const setPublicInfo = (data) => {
        dispatch({
            type: SET_PUBLIC_INFO,
            payload: data,
        });
    };

    const updateTiersInfo = (data) => {
        dispatch({
            type: SET_TIERS_UPDATE,
            payload: data,
        });
    };

    const setTiersInfo = (data) => {
        dispatch({
            type: SET_TIERS_INFO,
            payload: data,
        });
    };

    const updateOTABalance = () => {
        (async () => {
            try {
                const erc20Contract = new Contract(
                    publicInfo.tokenAddress,
                    config.abis.erc20,
                    activeProvider.getSigner()
                );

                const userBalance = await erc20Contract.balanceOf(account);

                setOTABalance(utils.formatUnits(userBalance));
            } catch (error) {
                console.log(error);
            }
        })();
    };

    const setOTABalance = (value) => {
        dispatch({
            type: SET_OTA_BALANCE,
            payload: value,
        });
    };

    const setKYCEmail = () => {
        dispatch({
            type: SET_KYC_EMAIL,
        });
    };

    const setKYCSubmitting = (value) => {
        dispatch({
            type: SET_KYC_SUBMITTING,
            payload: value,
        });
    };

    const setPendingEmail = (value) => {
        dispatch({
            type: SET_PENDING_EMAIL,
            payload: value,
        });
    };

    const setFarmings = (data) => {
        dispatch({
            type: SET_FARMING_POOLS,
            payload: data,
        });
    };

    const setStakings = (data) => {
        dispatch({
            type: SET_STAKING_POOLS,
            payload: data,
        });
    };

    const setPersonalInfo = (value) => {
        dispatch({
            type: SET_PERSONAL_INFO,
            payload: value,
        });
    };

    const setWrongNetwork = (value) => {
        dispatch({
            type: SET_WRONG_NETWORK,
            payload: value,
        });

        if (value === false && localStorage.getItem('walletConnecting') === 'true') continueWalletConnection();
    };

    const setJwtToken = (value) => {
        dispatch({
            type: SET_JWT_TOKEN,
            payload: value,
        });
    };

    const setWalletStatus = (status) => {
        dispatch({
            type: SET_WALLET_STATUS,
            payload: status,
        });
    };

    const setSalesList = (data, replicateType = '') => {
        dispatch({
            type: SET_SALES_LIST,
            payload: data,
            replicate: replicateType,
        });
    };

    const switchNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [
                    {
                        chainId: `0x${parseInt(process.env.REACT_APP_CHAIN_ID, 10).toString(16)}`,
                    },
                ],
            });
        } catch (e) {
            console.log(e);
        }
    };

    const accountChangedHandler = async (provider, walletName) => {
        const address = await provider.getSigner().getAddress();
        if (parseInt(provider._network.chainId) !== parseInt(process.env.REACT_APP_CHAIN_ID)) {
            setWrongNetwork(true);
            return;
        }

        dispatch({
            type: SET_WALLET_CONNECTION,
            payload: { provider, account: address, name: walletName },
        });
    };

    const continueWalletConnection = async () => {
        const name = localStorage.getItem('prevConnector');
        let provider = activateInjectedProvider(name);
        const account = await provider.getSigner().getAddress();

        dispatch({
            type: SET_WALLET_CONNECTION,
            payload: { provider, account, name },
        });

        localStorage.setItem('walletConnecting', false);
    };

    const activateWallet = async (name, closeModal) => {
        try {
            localStorage.setItem('prevConnector', name);
            localStorage.setItem('walletConnecting', true);
            let provider = activateInjectedProvider(name);
            provider.send('eth_requestAccounts', []).then(async () => {
                await accountChangedHandler(provider, name);
            });
        } catch (error) {
            console.log(error);
        } finally {
            if (closeModal) {
                closeModal();
            }
        }
    };

    const disconnectWallet = () => {
        dispatch({
            type: DISCONNECT_WALLET,
        });
    };

    const logout = () => {
        localStorage.setItem('walletConnecting', '');
        localStorage.setItem('prevAddress', '');
        localStorage.setItem('prevConnector', '');
        setJwtToken(false);
        setWalletStatus(false);
        setKYCStatus(KYC_STATUS.NONE);
        privateSocket.current.disconnect();

        return fetchWrapper
            .post('/api/User/Logout')
            .then(() => {
                console.log('AuthToken deleted');
            })
            .catch((msg) => {
                console.log(msg);
            });
    };

    const setSaleStatus = (sales, forceChange = true) => {
        dayjs.extend(utc);
        const currentTime = dayjs().utc().add(timeOffset);
        let curStatus = '';
        let result = sales.map((item) => {
            if (forceChange) {
                if (item.whitelistStartsAt) item.whitelistStartsAt = new Date(item.whitelistStartsAt * 1000);
                if (item.whitelistEndsAt) item.whitelistEndsAt = new Date(item.whitelistEndsAt * 1000);
                if (item.rounds?.length > 0) {
                    item.rounds = item.rounds.sort((first, second) => {
                        if (first.startsAt < second.startsAt) return -1;
                        if (first.startsAt > second.startsAt) return 1;

                        return 0;
                    });

                    item.rounds = item.rounds.map((round) => {
                        return {
                            startsAt: round.startsAt ? new Date(round.startsAt * 1000) : null,
                            endsAt: round.endsAt ? new Date(round.endsAt * 1000) : null,
                        };
                    });
                }
                if (item.claimingSchedule?.length > 0) {
                    item.claimingSchedule = item.claimingSchedule.map((cliff) => new Date(cliff * 1000));
                }
            }

            if (item.type === SALE_TYPE.Private) {
                if (
                    item?.rounds?.length > 0 &&
                    item?.claimingSchedule?.length > 0 &&
                    currentTime >= new Date(item.claimingSchedule[item.claimingSchedule.length - 1])
                )
                    curStatus = SALE_GOING_STATUS.Completed;
                else if (item?.rounds?.length > 0 && currentTime >= new Date(item.rounds[0].startsAt))
                    curStatus = SALE_GOING_STATUS.Ongoing;
                else curStatus = SALE_GOING_STATUS.Upcoming;
            } else {
                if (
                    item?.rounds?.length > 0 &&
                    item?.claimingSchedule?.length > 0 &&
                    currentTime >= new Date(item.claimingSchedule[item.claimingSchedule.length - 1])
                )
                    curStatus = SALE_GOING_STATUS.Completed;
                else if (item?.whitelistStartsAt && currentTime >= new Date(item.whitelistStartsAt))
                    curStatus = SALE_GOING_STATUS.Ongoing;
                else curStatus = SALE_GOING_STATUS.Upcoming;
            }

            return { ...item, status: curStatus };
        });

        return result;
    };

    const getSaleStatus = (currentTime, saleId = '') => {
        if (!currentTime || salesList.length === 0 || saleId === '') return;
        let saleInfo = salesList.filter((itm) => itm.id === saleId);
        if (saleInfo.length < 1) return;

        saleInfo = saleInfo[0];
        dayjs.extend(utc);

        if (saleInfo.type !== SALE_TYPE.Private) {
            if (!saleInfo.whitelistStartsAt || dayjs(saleInfo.whitelistStartsAt).diff(currentTime) > 0)
                return SALE_STATUS.New;
            if (
                dayjs(saleInfo.whitelistStartsAt).diff(currentTime) <= 0 &&
                dayjs(saleInfo.whitelistEndsAt).diff(currentTime) > 0
            )
                return SALE_STATUS.Open;

            if (
                dayjs(saleInfo.whitelistEndsAt).diff(currentTime) <= 0 &&
                (saleInfo.rounds.length < 1 || dayjs(saleInfo.rounds[0].startsAt).diff(currentTime) > 0)
            )
                return SALE_STATUS.Closed;
        }

        for (let index = 0; index < saleInfo.rounds.length; index++) {
            if (index === 0) {
                if (dayjs(saleInfo.rounds[index].startsAt).diff(currentTime) > 0) return SALE_STATUS.Closed;
                else if (dayjs(saleInfo.rounds[index].endsAt).diff(currentTime) > 0) return SALE_STATUS.Round1;
            } else {
                if (
                    dayjs(saleInfo.rounds[index].startsAt).diff(currentTime) <= 0 &&
                    dayjs(saleInfo.rounds[index].endsAt).diff(currentTime) > 0
                )
                    return saleInfo.rounds.length === 3 && index === 2 ? SALE_STATUS.Round3 : SALE_STATUS.Round2;
            }
        }

        if (
            !saleInfo.claimingSchedule ||
            saleInfo.claimingSchedule.length < 1 ||
            dayjs(saleInfo.claimingSchedule[0]).diff(currentTime) > 0
        ) {
            switch (saleInfo.rounds.length) {
                case 1:
                    return SALE_STATUS.Round1End;
                case 2:
                    return SALE_STATUS.Round2End;
                default:
                    return SALE_STATUS.Round3End;
            }
        }

        if (
            dayjs(saleInfo.claimingSchedule[0]).diff(currentTime) <= 0 &&
            dayjs(saleInfo.claimingSchedule[saleInfo.claimingSchedule.length - 1]).diff(currentTime) > 0
        )
            return SALE_STATUS.Claiming;
        if (dayjs(saleInfo.claimingSchedule[saleInfo.claimingSchedule.length - 1]).diff(currentTime) <= 0)
            return SALE_STATUS.ClaimingEnds;
    };

    const getStageInfo = (saleInfo, type, round = 0) => {
        if (type === SALE_STEP.WhiteList)
            return { startsAt: saleInfo.whitelistStartsAt, endsAt: saleInfo.whitelistEndsAt };
        if (type === SALE_STEP.Claiming) {
            if (!saleInfo.claimingSchedule?.length)
                return {
                    startsAt: null,
                    endsAt: null,
                    claimingSchedule: [],
                };
            return {
                startsAt: saleInfo.claimingSchedule[0],
                endsAt:
                    saleInfo.claimingSchedule.length > 1
                        ? saleInfo.claimingSchedule[saleInfo.claimingSchedule.length - 1]
                        : null,
                claimingSchedule:
                    saleInfo.claimingSchedule.length > 2
                        ? saleInfo.claimingSchedule.slice(1, saleInfo.claimingSchedule.length - 1)
                        : [],
            };
        }

        if (saleInfo.rounds.length >= round) return saleInfo.rounds[round - 1];
        return { startsAt: null, endsAt: null };
    };

    const getSaleEndTime = (currentTime, saleId) => {
        if (salesList.length === 0 || saleId === '') return;
        let saleInfo = salesList.filter((itm) => itm.id === saleId);
        if (saleInfo.length < 1) return;

        saleInfo = saleInfo[0];
        dayjs.extend(utc);
        switch (getSaleStatus(currentTime, saleId)) {
            case SALE_STATUS.New:
                return getStageInfo(saleInfo, SALE_STEP.WhiteList).startsAt;
            case SALE_STATUS.Open:
                return getStageInfo(saleInfo, SALE_STEP.WhiteList).endsAt;
            case SALE_STATUS.Closed:
                return getStageInfo(saleInfo, SALE_STEP.Sale, 1).startsAt;
            case SALE_STATUS.Round1:
                return getStageInfo(saleInfo, SALE_STEP.Sale, 1).endsAt;
            case SALE_STATUS.Round2:
                return getStageInfo(saleInfo, SALE_STEP.Sale, 2).endsAt;
            case SALE_STATUS.Round3:
                return getStageInfo(saleInfo, SALE_STEP.Sale, 3).endsAt;
            case SALE_STATUS.Round1End:
            case SALE_STATUS.Round2End:
            case SALE_STATUS.Round3End:
                return getStageInfo(saleInfo, SALE_STEP.Claiming).startsAt;
            case SALE_STATUS.Claiming:
                const claimStage = getStageInfo(saleInfo, SALE_STEP.Claiming);
                if (claimStage?.claimingSchedule?.length > 0) {
                    for (const schedule of claimStage.claimingSchedule) {
                        if (dayjs(schedule).diff(currentTime) > 0) return schedule;
                    }
                }
                return getStageInfo(saleInfo, SALE_STEP.Claiming).endsAt;
            case SALE_STATUS.ClaimingEnds:
                return getStageInfo(saleInfo, SALE_STEP.Claiming).endsAt;
            default:
                break;
        }
    };

    const setKYCStatus = (val) => {
        dispatch({
            type: SET_KYC_STATUS,
            payload: val,
        });
    };

    const setKYCInfo = (data) => {
        dispatch({
            type: SET_KYC_INFO,
            payload: data,
        });
    };

    const setCurrentMembershipStatus = (val) => {
        dispatch({
            type: SET_MEMBERSHIP_STATUS,
            payload: val,
        });
    };

    const activateInjectedProvider = (providerName) => {
        const { ethereum } = window;

        if (!ethereum?.providers) {
            return new ethers.providers.Web3Provider(window.ethereum);
        }

        let provider;
        switch (providerName) {
            case 'Coinbase Wallet':
                provider = ethereum.providers.find(({ isCoinbaseWallet }) => isCoinbaseWallet);
                break;
            case 'MetaMask':
                provider = ethereum.providers.find(({ isMetaMask }) => isMetaMask);
                break;
            default:
                return;
        }

        if (provider) ethereum.setSelectedProvider(provider);

        return new ethers.providers.Web3Provider(provider);
    };

    const getReCaptchaToken = async () => {
        if (!reCaptchaRef.current) return null;

        reCaptchaRef.current.reset();

        const reCaptchaToken = await reCaptchaRef.current
            .executeAsync()
            .then((val) => {
                return val;
            })
            .catch((err) => {
                console.log('Error from recaptcha', err);
                return null;
            });

        return !reCaptchaToken ? null : reCaptchaToken;
    };

    return (
        <GlobalContext.Provider
            value={{
                account,
                setAccount,
                currentWallet,
                activeProvider,
                activateWallet,
                activateInjectedProvider,
                disconnectWallet,
                switchNetwork,
                logout,
                kycInfo,
                setKYCInfo,
                kycStatus,
                setKYCStatus,
                isValidWallet,
                setWalletStatus,
                jwtToken,
                personalInfo,
                setPersonalInfo,
                setJwtToken,
                getSaleStatus,
                salesList,
                setSalesList,
                setSaleStatus,
                wrongNetwork,
                setWrongNetwork,
                getSaleEndTime,
                reCaptchaRef,
                getReCaptchaToken,
                otaBalance,
                setOTABalance,
                updateOTABalance,
                publicInfo,
                setPublicInfo,
                farmings,
                setFarmings,
                stakings,
                setStakings,
                isKYCSubmitting,
                setKYCSubmitting,
                pendingEmail,
                setPendingEmail,
                setKYCEmail,
                tiersInfo,
                updateTiersInfo,
                setTiersInfo,
                privateSocket,
                publicSocket,
                setCurrentMembershipStatus,
                timeOffset,
                setGlobalTimeOffset,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalProvider;
