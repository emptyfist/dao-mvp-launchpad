import toast from 'react-hot-toast';
import React, { useEffect, useRef, useState } from 'react';
import { SimpleButton, SimpleInput } from '../reusable';
import { useWidth } from '../../hooks';
import { Twitter, Discord, Telegram, Checked, KYCStatus } from '../../assets/icons';
import { KYC_VERIFY_STEP, MOBILE_WIDTH } from '../../config/constants';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useSaleContext } from '../../context/sale/SaleState';

const socialInfo = [
    {
        icon: <Telegram />,
        action: 'Join',
        text: 'our Telegram group',
        button: 'Join Group',
    },
    {
        icon: <Discord />,
        action: 'Join',
        text: 'our Discord group',
        button: 'Join Group',
    },
    {
        icon: <Twitter />,
        action: 'Follow',
        text: 'Otaris on Twitter',
        button: 'Follow',
    },
    {
        icon: <Twitter />,
        action: 'Retweet',
        text: 'Linked Tweet',
        button: 'Retweet',
    },
];

const SocialForm = ({ nextHandler }) => {
    const windowWidth = useWidth();
    const { account, kycStatus, kycInfo, setKYCInfo } = useGlobalContext();
    const { salePublic } = useSaleContext();
    const [disabled, setDisabled] = useState(true);

    const handleClick = (index) => {
        let status = kycInfo?.communityStatus;
        if (!status) status = new Array(4);
        status[index] = !status[index];
        setKYCInfo({ communityStatus: status });
    };

    const telegramRef = useRef();
    const twitterRef = useRef();

    useEffect(() => {
        telegramRef.current.value = kycInfo.telegramUsername ?? '';
        twitterRef.current.value = kycInfo.twitterUsername ?? '';

        handleChange();
        // eslint-disable-next-line
    }, []);

    const navigate2Next = () => {
        if (!telegramRef.current.value || !twitterRef.current.value) {
            toast.error('Missing fields');
            return;
        }

        nextHandler(KYC_VERIFY_STEP.SUBMIT_QUIZ);
    };

    const checkIsDisabled = () => {
        if (!telegramRef.current.value || !twitterRef.current.value) return true;

        return false;
    };

    const handleChange = () => {
        setDisabled(checkIsDisabled());
        setKYCInfo({
            telegramUsername: telegramRef.current.value,
            twitterUsername: twitterRef.current.value,
        });
    };

    const getLinkURLs = (index) => {
        switch (index) {
            case 0:
                return salePublic?.telegramGroupLink ?? '';
            case 1:
                return salePublic?.discordGroupLink ?? '';
            case 2:
                return salePublic?.twitterLink ?? '';
            case 3:
                return salePublic?.linkToTweet ?? '';
            default:
                return '';
        }
    };

    return (
        <div className="social-form">
            <p className="label">Wallet address</p>
            <p className="value wallet-address">
                {windowWidth < MOBILE_WIDTH ? `${account.slice(0, 8)}...${account.slice(-8)}` : account}
            </p>
            <p className="label">KYC status</p>
            <div className="kyc-status">
                <KYCStatus />
                <span>{kycStatus}</span>
            </div>
            <p className="label">Email</p>
            <p className="value">{kycInfo.email}</p>
            <div className="divider" />
            <div className="input-wrapper">
                <div className="input-item">
                    <p className="label">Telegram username</p>
                    <SimpleInput prefix={'@'} inputRef={telegramRef} onChange={handleChange} />
                </div>
                <div className="input-item">
                    <p className="label">Twitter username</p>
                    <SimpleInput prefix={'@'} inputRef={twitterRef} onChange={handleChange} />
                </div>
            </div>
            <div className="social-item-container">
                {socialInfo.map((item, index) => (
                    <div key={item.text} className="social-item">
                        {item.icon}
                        <div className="prompt">
                            <span>{item.action}&nbsp;</span>
                            <span>{item.text}</span>
                        </div>
                        <SimpleButton isDisabled={getLinkURLs(index) === ''}>
                            {getLinkURLs(index) === '' ? (
                                item.button
                            ) : (
                                <a href={`${getLinkURLs(index)}`} target="_blank" rel="noreferrer">
                                    {item.button}
                                </a>
                            )}
                        </SimpleButton>
                        <SimpleButton
                            isDisabled={getLinkURLs(index) === ''}
                            className="outlined"
                            clickHandler={() => handleClick(index)}
                        >
                            {kycInfo?.communityStatus?.length >= index && kycInfo.communityStatus[index] ? (
                                <Checked />
                            ) : (
                                'I did it'
                            )}
                        </SimpleButton>
                    </div>
                ))}
            </div>
            <div className="step-container">
                <SimpleButton clickHandler={() => navigate2Next()} isDisabled={disabled}>
                    Next
                </SimpleButton>
                <span>1/2</span>
            </div>
            <div className="sp-step-container">
                <SimpleButton clickHandler={() => navigate2Next()} isDisabled={disabled}>
                    <div className="btn-content">
                        <div />
                        <span>Next</span>
                        <span className="step">1/2</span>
                    </div>
                </SimpleButton>
            </div>
        </div>
    );
};

export default SocialForm;
