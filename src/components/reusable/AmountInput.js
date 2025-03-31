import React from 'react';
import { EllipseButton } from '../reusable';

const AmountInput = ({ amount, maxAmount, setAmount, hasMax = true }) => {
    const onMaxBtnClick = () => {
        setAmount(maxAmount);
    };

    const getInputValue = (e) => {
        setAmount(e.target.value);
    };

    // const onWheelScrolled = (e) => {
    //     // setAmount(amount);
    //     // e.preventDefault();
    //     e.stopPropagation();
    // };

    return (
        <div className="custom-input-container">
            <input
                readOnly={!hasMax}
                type="number"
                value={amount}
                onChange={getInputValue}
                placeholder="Input amount"
                onWheel={(e) => e.target.blur()}
            />
            {hasMax && <EllipseButton clickHandler={onMaxBtnClick}>MAX</EllipseButton>}
        </div>
    );
};

export default AmountInput;
