import { BigNumber } from 'ethers';

export const calculateMargin = (value) =>
    value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000));

export const formatUSD = (value, decimals = 2) => value.toLocaleString('en-US', { maximumFractionDigits: decimals });

export const getNumberSuffix = (value, decimals = 2) => {
    if (typeof value !== 'number') {
        throw new Error('Value must be a number');
    }

    if (isNaN(value)) {
        return '0';
    }

    switch (true) {
        case value === Infinity:
            return value;
        case value > 1000000:
            return `${(value / 1000000).toFixed(2)}M `;
        case value > 10000:
            return `${(value / 1000).toFixed(decimals)}k `;

        default:
            return value.toFixed(decimals);
    }
};
