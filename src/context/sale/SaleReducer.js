import {
    SET_SALE_PUBLIC,
    SET_CONTROL_BUTTON_STATUS,
    SET_USER_BALANCE,
    SET_TIME_OFFSET,
} from '../types';

const reducer = (state, action) => {
    switch (action.type) {
        case SET_USER_BALANCE:
            return {
                ...state,
                userBalance: action.payload,
            };
        case SET_CONTROL_BUTTON_STATUS:
            return {
                ...state,
                controlButtonStatus: action.payload,
            };
        case SET_SALE_PUBLIC:
            return {
                ...state,
                salePublic: {
                    ...state.salePublic,
                    ...action.payload,
                },
            };
        case SET_TIME_OFFSET:
            return {
                ...state,
                timeOffset: action.payload,
            };
        default:
            return {
                ...state,
            };
    }
};

export default reducer;
