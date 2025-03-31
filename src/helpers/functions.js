import { KYC_STATUS, SALE_TYPE } from '../config/constants';
import PrivateSaleABI from '../config/abi/PrivateSale.json';
import UnlimitedSaleABI from '../config/abi/UnlimitedSale.json';
import TierBasedSaleABI from '../config/abi/TierBasedSale.json';

export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

export function getCookie(cname) {
    let name = cname + '=';
    let ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return '';
}

export function getRandom(arr, n) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len) throw new RangeError('getRandom: more elements taken than available');
    while (n--) {
        let x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

export const getNumberSuffix = (value, decimals = 2) => {
    if (typeof value !== 'number') throw new Error('Value must be a number');

    if (isNaN(value)) return '0';

    switch (true) {
        case value === Infinity:
            return value;
        case value >= 1000000000000:
            return `${formatterSmallFloat.format(value / 1000000000000)}T `;
        case value >= 1000000000:
            return `${formatterSmallFloat.format(value / 1000000000)}B `;
        case value >= 1000000:
            return `${formatterSmallFloat.format(value / 1000000)}M `;
        case value >= 1000:
            return `${formatterSmallFloat.format(value / 1000)}K `;
        default:
            return formatterSmallFloat.format(value);
    }
};

export const hasError = (errors, field) => {
    if (!errors || errors.length < 1) return false;

    let err = null;
    for (const key in errors) {
        if (errors[key].errorType !== field) continue;

        err = errors[key];
        break;
    }

    if (!err) return false;

    return err.errorMessage;
};

export const parseMarkdown = (value) => {
    const result = [];
    const contents = value.split('\n');
    for (const sentence of contents) {
        if (!sentence.trim()) continue;

        if (sentence.startsWith('## ')) {
            result.push({
                type: 'subtitle',
                value: sentence.substring(2).trim().toLowerCase().replaceAll(' ', '-'),
                label: sentence.substring(2).trim(),
            });
        } else if (sentence.startsWith('# ')) {
            result.push({
                type: 'title',
                value: sentence.substring(1).trim().toLowerCase().replaceAll(' ', '-'),
                label: sentence.substring(1).trim(),
            });
        }
    }

    return result;
};

export const convertRes2KYCStatus = (res) => {
    if (res === 'NotStarted') return KYC_STATUS.UNVERIFIED;
    if (res === 'Processing') return KYC_STATUS.VERIFYING;
    if (res === 'Error' || res === 'Failed') return KYC_STATUS.FAILED;
    if (res === 'Completed') return KYC_STATUS.VERIFIED;
    return KYC_STATUS.NONE;
};

export const getBlockchainTierId = (tiers, membershipId) => {
    const tier = tiers.filter((item) => item.id === membershipId);
    if (tier.length < 1) return -1;

    return +tier[0].blockchainTierId;
};

export const currentAvailableInfo = (id, data) => {
    const result = data.filter((tier) => tier.membershipTierId === id);
    if (result.length === 0)
        return { blockchainTierId: 0, spots: '0', applied: '0', contribution: null, allocation: null };
    else return result[0];
};

export const parseMetamaskError = (msg) => {
    let startPos = msg.indexOf(`"originalError":`);
    if (startPos === -1) return msg;
    startPos += `"originalError":`.length;

    let endPos = msg.indexOf(`"}`, startPos);
    if (endPos === -1) return msg;
    endPos += `"}`.length;

    let originError = msg.substring(startPos, endPos);
    originError = JSON.parse(originError);

    return originError.message ?? msg;
};

export const getProperABI = (type) => {
    if (type === SALE_TYPE.Private) return PrivateSaleABI;
    if (type === SALE_TYPE.Unlimited) return UnlimitedSaleABI;
    return TierBasedSaleABI;
};

export const convertGuidToBytes16 = (guidStr) => {
    if (guidStr === '0') return '0x00000000000000000000000000000000';
    // convert guid string to 16 byte array
    var bytes = [];
    guidStr.split('-').map((number, index) => {
        var bytesInChar = index < 3 ? number.match(/.{1,2}/g).reverse() : number.match(/.{1,2}/g);
        bytesInChar.map((byte) => {
            bytes.push(parseInt(byte, 16));
            return '';
        });

        return '';
    });

    const hexString = Array.from(bytes, function (byte) {
        return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');

    return `0x${hexString}`;
};

export const formatterInt = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
});

export const formatterSmallFloat = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
});

export const formatterFloat = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 3,
});
