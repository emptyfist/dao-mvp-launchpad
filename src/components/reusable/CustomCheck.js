import clsx from 'clsx';
import React, { useState } from 'react';
import CheckMark from '../../assets/png/check_mark.webp';

const CustomCheck = ({ checkType = 'normal', caption, checkChanged, className = '', status, finished, isDisabled }) => {
    const [checkStatus, setCheckStatus] = useState(false);

    const clickHandler = (e) => {
        if (isDisabled) return;
        if (checkChanged) checkChanged(!checkStatus);

        setCheckStatus((prev) => !prev);
    };

    return (
        <div
            className={clsx(
                'custom-check-wrapper',
                className,
                checkType,
                finished ? 'finished' : '',
                status ?? checkStatus ? 'checked' : 'unchecked'
            )}
            onClick={clickHandler}
        >
            <div className={clsx('check-wrapper')}>
                {checkType === 'normal' && (
                    <img src={CheckMark} alt="Check-mark" style={{ width: '100%', height: '100%' }} />
                )}
            </div>
            <span>{caption}</span>
        </div>
    );
};

export default CustomCheck;
