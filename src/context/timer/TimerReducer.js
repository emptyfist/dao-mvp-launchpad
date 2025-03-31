import { SET_GLOBAL_TIME, SET_TIME_OFFSET, SET_CURRENT_TIME } from '../types';

const reducer = (state, action) => {
    switch (action.type) {
        case SET_CURRENT_TIME:
            return {
                ...state,
                currentTime: action.payload,
            };
        case SET_TIME_OFFSET:
            return {
                ...state,
                timeOffset: action.payload,
            };
        case SET_GLOBAL_TIME:
            return {
                ...state,
                globalTime: action.payload,
            };
        default:
            return {
                ...state,
            };
    }
};

export default reducer;
