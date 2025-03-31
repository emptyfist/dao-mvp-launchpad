import clsx from 'clsx';
import React from 'react';
import { QuestionMark, RoundRightArrow } from '../../assets/icons';

const SimpleButton = ({
    isDisabled = false,
    hasShadow = false,
    isNext = false,
    isQA = false,
    children,
    className,
    clickHandler,
}) => (
    <button
        className={clsx(
            className,
            'btn-wrapper',
            'simple-btn-wrapper',
            `${hasShadow ? 'btn-box-shadow' : ''}`,
            `${isNext ? 'has-next-arrow' : ''}`
        )}
        disabled={isDisabled}
        onClick={clickHandler}
    >
        {children}
        {isNext && <RoundRightArrow width={30} height={30} />}
        {isQA && <QuestionMark />}
    </button>
);

export default SimpleButton;
