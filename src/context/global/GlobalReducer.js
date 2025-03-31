import {
    SET_ACCOUNT,
    SET_WALLET_CONNECTION,
    DISCONNECT_WALLET,
    SET_WALLET_STATUS,
    SET_JWT_TOKEN,
    SET_KYC_INFO,
    SET_KYC_STATUS,
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
import { getBlockchainTierId } from '../../helpers/functions';

import { MEMBERSHIP_STATUS, SALE_TYPE } from '../../config/constants';

const reducer = (state, action) => {
    switch (action.type) {
        case SET_ACCOUNT:
            return {
                ...state,
                account: action.payload,
            };
        case SET_GLOBAL_TIME_OFFSET:
            return {
                ...state,
                timeOffset: action.payload,
            };
        case SET_MEMBERSHIP_STATUS:
            return {
                ...state,
                personalInfo: {
                    ...state.personalInfo,
                    membershipStatus: getBlockchainTierId(state.tiersInfo, action.payload) + 1,
                },
            };
        case SET_TIERS_UPDATE:
            const result = [];
            result.push(state.tiersInfo[0]);
            for (let idx = 1; idx < state.tiersInfo.length; idx++) {
                const tier = action.payload.filter(
                    (itm) => itm.blockchainTierId === state.tiersInfo[idx].blockchainTierId
                );
                if (tier.length > 0) result.push({ ...state.tiersInfo[idx], mintedAmount: tier[0].mintedAmount });
            }

            return {
                ...state,
                tiersInfo: [...result],
            };
        case SET_TIERS_INFO:
            return {
                ...state,
                tiersInfo: [...action.payload],
            };
        case SET_PUBLIC_INFO:
            return {
                ...state,
                publicInfo: { ...state.publicInfo, ...action.payload },
            };
        case SET_OTA_BALANCE:
            return {
                ...state,
                otaBalance: action.payload,
            };
        case SET_KYC_EMAIL:
            if (state.pendingEmail !== '') {
                return {
                    ...state,
                    kycInfo: { ...state.kycInfo, email: state.pendingEmail },
                    pendingEmail: '',
                };
            } else {
                return state;
            }
        case SET_KYC_SUBMITTING:
            return {
                ...state,
                isKYCSubmitting: action.payload,
            };
        case SET_KYC_STATUS:
            return {
                ...state,
                kycStatus: action.payload,
            };
        case SET_KYC_INFO:
            return {
                ...state,
                kycInfo: { ...state.kycInfo, ...action.payload },
            };
        case SET_STAKING_POOLS:
            return {
                ...state,
                stakings: [...action.payload],
            };
        case SET_FARMING_POOLS:
            return {
                ...state,
                farmings: [...action.payload],
            };
        case SET_PERSONAL_INFO:
            return {
                ...state,
                personalInfo: { ...state.personalInfo, ...action.payload },
            };
        case SET_WRONG_NETWORK:
            return {
                ...state,
                wrongNetwork: action.payload,
            };
        case SET_WALLET_CONNECTION:
            return {
                ...state,
                currentWallet: action.payload.name,
                activeProvider: action.payload.provider,
                account: action.payload.account,
            };
        case DISCONNECT_WALLET:
            return {
                ...state,
                currentWallet: '',
                activeProvider: null,
                account: null,
                personalInfo: { ...state.personalInfo, membershipStatus: MEMBERSHIP_STATUS.Visitor },
            };
        case SET_WALLET_STATUS:
            return {
                ...state,
                isValidWallet: action.payload,
            };
        case SET_JWT_TOKEN:
            return {
                ...state,
                jwtToken: action.payload,
            };
        case SET_SALES_LIST:
            // console.log('set sales list', action.payload);
            if (action.replicate === '') {
                return {
                    ...state,
                    salesList: action.payload,
                };
            } else if (action.replicate === 'Private') {
                return {
                    ...state,
                    salesList: [
                        ...state.salesList.filter((sale) => sale.type !== SALE_TYPE.Private),
                        ...action.payload,
                    ],
                };
            } else {
                return {
                    ...state,
                    salesList: [
                        ...state.salesList.filter((sale) => sale.type === SALE_TYPE.Private),
                        ...action.payload,
                    ],
                };
            }
        case SET_PENDING_EMAIL:
            return {
                ...state,
                pendingEmail: action.payload,
            };
        default:
            return {
                ...state,
            };
    }
};

export default reducer;
