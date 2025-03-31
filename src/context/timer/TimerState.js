import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { fetchWrapper } from '../../helpers/fetch-wrapper';
import React, { useContext, useEffect, useReducer, useRef } from 'react';
import TimerContext from './TimerContext';
import TimerReducer from './TimerReducer';
import { SET_GLOBAL_TIME, SET_TIME_OFFSET, SET_CURRENT_TIME } from '../types';

const TimerProvider = ({ children }) => {
    const isMounted = useRef(true);
    const initialState = {
        globalTime: null,
        timeOffset: null,
        currentTime: null,
    };

    const [state, dispatch] = useReducer(TimerReducer, initialState);

    const { globalTime, timeOffset, currentTime } = state;

    const setGlobalTime = (value) => {
        dispatch({
            type: SET_GLOBAL_TIME,
            payload: value,
        });
    };

    const setTimeOffset = (value) => {
        dispatch({
            type: SET_TIME_OFFSET,
            payload: value,
        });
    };

    const updateGlobalTime = () => {
        fetchWrapper
            .getRaw('https://worldtimeapi.org/api/timezone/Etc/gmt')
            .then((res) => {
                dayjs.extend(utc);
                const _globalTime = dayjs(res.utc_datetime);
                const _currentTime = dayjs().utc();
                setTimeOffset(_globalTime.diff(_currentTime));
                setGlobalTime(_globalTime);
            })
            .catch((msg) => {
                console.log(msg);
            });
    };

    useEffect(() => {
        if (!timeOffset) return;

        setInterval(() => {
            const _currentTime = dayjs().utc().add(timeOffset);
            // console.log(_currentTime);
            dispatch({
                type: SET_CURRENT_TIME,
                payload: _currentTime,
            });
        }, 1000);
    }, [timeOffset]);

    useEffect(() => {
        isMounted.current && updateGlobalTime();

        return () => {
            isMounted.current = false;
        };

        // eslint-disable-next-line
    }, []);

    return (
        <TimerContext.Provider
            value={{
                globalTime,
                timeOffset,
                currentTime,
                updateGlobalTime,
            }}
        >
            {children}
        </TimerContext.Provider>
    );
};

export const useTimerContext = () => useContext(TimerContext);

export default TimerProvider;
