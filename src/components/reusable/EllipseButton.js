import clsx from 'clsx';
import React from 'react';

const EllipseButton = ({ hasShadow = true, children, className, clickHandler }) => (
    <button
        className={clsx(
            className,
            'btn-wrapper',
            'round-btn-wrapper',
            'btn-box-shadow',
            'secondary-btn',
            `${hasShadow ? 'btn-box-shadow' : ''}`
        )}
        onClick={clickHandler}
        aria-label="ellipse button"
    >
        {children}
    </button>
);

export default EllipseButton;
