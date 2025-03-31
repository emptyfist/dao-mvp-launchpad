import clsx from 'clsx';
import camelcaseKeys from 'camelcase-keys';
import { Contract } from 'ethers';
import ReCaptchaV2 from 'react-google-recaptcha';
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchWrapper } from '../../helpers/fetch-wrapper';
import { convertRes2KYCStatus, formatterFloat, getCookie } from '../../helpers/functions';
import { useUserBalance } from '../../hooks';
import config from '../../config/config';
import { KYC_STATUS, MEMBERSHIP_STATUS } from '../../config/constants';
import Bookmark from '../../assets/svg/bookmark.svg';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useModalContext } from '../../context/modal/ModalState';

const WalletStatusButton = () => {
    const { openModal } = useModalContext();
    const {
        account,
        currentWallet,
        activeProvider,
        activateWallet,
        jwtToken,
        setJwtToken,
        setKYCEmail,
        setKYCStatus,
        setKYCInfo,
        isValidWallet,
        setWalletStatus,
        logout,
        disconnectWallet,
        reCaptchaRef,
        getReCaptchaToken,
        publicInfo,
        setPublicInfo,
        otaBalance,
        setOTABalance,
        tiersInfo,
        personalInfo,
        setCurrentMembershipStatus,
        privateSocket,
        setSalesList,
        setSaleStatus,
        activateInjectedProvider,
    } = useGlobalContext();

    const navigate = useNavigate();
    let location = useLocation();
    const isMounted = useRef(true);

    const handleDisconnect = () => {
        if (account) {
            logout();
            disconnectWallet();
            if (location.pathname.startsWith('/sales/') === true) navigate('/sales');
        }
    };

    let _userBalance = useUserBalance(publicInfo.tokenAddress, account, activeProvider);
    useEffect(() => {
        if (!_userBalance) return;
        setOTABalance(_userBalance);
        // eslint-disable-next-line
    }, [_userBalance]);

    const authenticateSocket = async (socketId) => {
        await fetchWrapper
            .post(`/api/User/AuthenticateSocket/${socketId}`, {})
            .then(async (res) => {
                console.log('User authenticated for the private socket.');
            })
            .catch((res) => {
                console.log('Socket authentication failed.');
                toast.error('Websocket authorization failed.');
                handleDisconnect();
            });
    };

    useEffect(() => {
        const onWalletConnect = async () => {
            if (!account) return;

            if (jwtToken) {
                handleDisconnect();
                return;
            }

            let hasCookie = getCookie('HasAuthCookie') === 'True';
            if (hasCookie) {
                const prevAddress = localStorage.getItem('prevAddress');
                hasCookie = !prevAddress ? false : prevAddress.toLowerCase() === account.toLowerCase();
            }

            let provider = activeProvider;

            if (!hasCookie) {
                try {
                    let reCaptchaToken = await getReCaptchaToken();
                    if (!reCaptchaToken) {
                        toast.error('Get value reCaptcha failed.');
                        handleDisconnect();
                        return;
                    }

                    const nonce = await fetchWrapper
                        .postWithReCaptcha('/api/User/Nonce/' + account.toLowerCase(), {}, reCaptchaToken)
                        .catch((e) => {
                            console.log('Error from /api/user/Nonce', e);
                            return null;
                        });
                    if (!nonce) {
                        handleDisconnect();
                        return;
                    }

                    provider = activateInjectedProvider(currentWallet);

                    const signature = await window.ethereum.request({
                        method: 'personal_sign',
                        params: [nonce, account, 'Example password'],
                    });

                    reCaptchaToken = await getReCaptchaToken();
                    if (!reCaptchaToken) {
                        toast.error('Get value reCaptcha failed.');
                        handleDisconnect();
                        return;
                    }

                    await fetchWrapper
                        .postWithReCaptcha(
                            '/api/User/Authenticate',
                            {
                                walletAddress: account.toLowerCase(),
                                signedMessage: signature,
                            },
                            reCaptchaToken
                        )
                        .then((ret) => {
                            hasCookie = getCookie('HasAuthCookie') === 'True';
                            localStorage.setItem('prevAddress', ret);
                        })
                        .catch((e) => {
                            hasCookie = false;
                        });
                } catch (e) {
                    toast.error('Signature request denied, please try to connect your wallet again.');
                    handleDisconnect();
                    hasCookie = false;
                }
            }

            if (hasCookie) {
                getOTATokenAddress(provider);
                getKYCStatus();
                isMounted.current && setJwtToken(true);
                isMounted.current && setWalletStatus(true);
                privateSocket.current.connect();
            }
        };

        onWalletConnect();
        // eslint-disable-next-line
    }, [account]);

    const getOTATokenAddress = async (provider) => {
        const tokenAddress = await fetchWrapper
            .get('/api/Misc/OtaTokenAddress')
            .then((res) => {
                return res;
            })
            .catch((e) => {
                console.log('Error from /api/Misc/OtaTokenAddress', e);
                return null;
            });

        if (!tokenAddress) return;

        try {
            const erc20Contract = new Contract(tokenAddress, config.abis.erc20, provider.getSigner());
            const tickerSymbol = await erc20Contract.symbol();
            setPublicInfo({ tokenAddress, tickerSymbol });
        } catch (error) {
            toast.error('OTA token address is not correct!');
        }
    };

    const getKYCStatus = async () => {
        let kycRes = await fetchWrapper
            .get('/api/User/KYC/Status')
            .then((res) => res)
            .catch((res) => {
                console.log('KYC/Status', res.error);
            });
        if (!kycRes) return false;

        kycRes = convertRes2KYCStatus(kycRes);

        // kycRes = KYC_STATUS.VERIFYING; // _test_code
        setKYCStatus(kycRes);

        let result = {};
        const userInfo = await fetchWrapper.get('/api/User/Info').catch((res) => {
            console.log('Error from /api/User/Info', res.error);
        });
        if (userInfo) {
            result.email = userInfo.email ?? '';
            result.telegramUsername = userInfo.telegramUsername ?? '';
            result.twitterUsername = userInfo.twitterUsername ?? '';

            setCurrentMembershipStatus(userInfo.membershipTierId);
            // setCurrentMembershipStatus('551ebd47-d889-4286-9d24-6d94f06a317f');
            // setPersonalInfo({ membershipStatus: getBlockchainTierId(tiersInfo, userInfo.membershipTierId) + 1 });
        }

        if (kycRes === KYC_STATUS.VERIFIED) return;

        if (kycRes === KYC_STATUS.UNVERIFIED) {
            setKYCInfo(result);
            return;
        }

        // get kyc data for failed or verifying status
        const kycData = await fetchWrapper.get('/api/User/KYC/Data').catch((res) => {
            console.log('Error from /api/user/KYC/Data', res.error);
        });
        if (kycData) {
            result = { ...result, ...kycData };
        }

        setKYCInfo(result);

        return true;
    };

    useEffect(() => {
        if (!isMounted.current) return;

        privateSocket.current.on('connect', () => {
            console.log('Private Socket connected');

            privateSocket.current.emit('GetInfo');
        });

        privateSocket.current.on('disconnect', (reason) => {
            console.log('Private Socket disconnected: reason = ', reason);

            if (reason === 'io server disconnect') privateSocket.current.connect();
        });

        privateSocket.current.on('reconnect', () => {
            console.log('Private Socket reconnecting');
        });

        privateSocket.current.on('SocketInfo', (data) => {
            console.log('SocketInfo', data);
            data = camelcaseKeys(data, { deep: true });
            if (data?.status === 'Authorized') return;

            authenticateSocket(data.id);
        });

        privateSocket.current.on('Info', (data) => {
            console.log('Info', data);
            data = camelcaseKeys(data, { deep: true });
            if (data?.isEmailVerified) {
                setKYCEmail();
            }

            if (data?.kycState) setKYCStatus(convertRes2KYCStatus(data.kycState));
            setCurrentMembershipStatus(data.membershipTierId);
            // setPersonalInfo({ membershipStatus: getBlockchainTierId(tiersInfo, data.MembershipTierId) + 1 });
        });

        privateSocket.current.on('List', (data) => {
            console.log('Private socket List', data);
            data = camelcaseKeys(data, { deep: true });
            setSalesList(setSaleStatus(data), 'Private');
        });

        const hasCookie = getCookie('HasAuthCookie') === 'True';
        if (hasCookie && localStorage.getItem('prevAddress')) {
            let prevConnector = localStorage.getItem('prevConnector');
            if (!prevConnector) prevConnector = 'MetaMask';

            activateWallet(prevConnector);
            // } else {
            //     navigate('/');
        }

        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <div className={`wallet-status-wrapper ${isValidWallet && account ? '' : 'not-'}connected`}>
                <button
                    className={clsx('btn-wrapper', 'simple-btn-wrapper')}
                    onClick={() => {
                        if (!isValidWallet || !account) openModal('connectWallet');
                        else handleDisconnect();
                    }}
                >
                    {!account || !isValidWallet || personalInfo.membershipStatus === MEMBERSHIP_STATUS.Visitor ? (
                        <img src={Bookmark} alt="Bookmark" />
                    ) : (
                        <img
                            src={tiersInfo[personalInfo.membershipStatus].logo}
                            alt={tiersInfo[personalInfo.membershipStatus].name}
                        />
                    )}

                    {!isValidWallet || !account ? 'Connect Wallet' : `${account.slice(0, 8)}...${account.slice(-4)}`}
                </button>
                {account && isValidWallet && publicInfo.tokenAddress && (
                    <span className="wallet-info">
                        {formatterFloat.format(otaBalance)} {publicInfo.tickerSymbol}
                    </span>
                )}
            </div>
            <ReCaptchaV2 sitekey={process.env.REACT_APP_SITE_KEY} size="invisible" theme="dark" ref={reCaptchaRef} />
        </>
    );
};

export default WalletStatusButton;
