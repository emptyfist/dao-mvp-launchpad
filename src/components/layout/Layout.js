import camelcaseKeys from 'camelcase-keys';
import { Outlet, useLocation } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { Header, Footer, Contents, TopContents } from '../layout';
import { fetchWrapper } from '../../helpers/fetch-wrapper';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useTimerContext } from '../../context/timer/TimerState';
import { getPoolsData } from '../../config/mock';
import { MemberShipInfo } from '../../config/membershipinfo';
import { ProcLiquidity, ProcSwap, Stake } from '../modals';
import { getCookie } from '../../helpers/functions';
// import { getPublicList } from '../../config/mock';

const Layout = () => {
    const {
        account,
        setAccount,
        isValidWallet,
        setFarmings,
        setStakings,
        updateTiersInfo,
        setTiersInfo,
        setSalesList,
        setSaleStatus,
        setPublicInfo,
        logout,
        disconnectWallet,
        setWrongNetwork,
        setGlobalTimeOffset,
        publicSocket,
    } = useGlobalContext();
    const { timeOffset } = useTimerContext();
    const isMounted = useRef(true);
    const healthRef = useRef(null);
    const [isBgWorking, setBgWorking] = useState(true);

    useEffect(() => {
        if (!timeOffset) return;
        setGlobalTimeOffset(timeOffset);
        // eslint-disable-next-line
    }, [timeOffset]);

    let location = useLocation();
    useEffect(() => {
        const getBackendHealth = async () => {
            await fetchWrapper
                .get('/api/Health')
                .then((res) => {
                    if (!res?.healthStatus) setBgWorking(false);
                    else setBgWorking(true);
                })
                .catch((e) => {
                    console.log("There's problem on BE side", e.message);
                    setBgWorking(false);
                });
        };

        if (location.pathname !== '/warning') {
            if (healthRef.current) clearInterval(healthRef.current);
            healthRef.current = setInterval(async () => {
                await getBackendHealth();
            }, 1000 * 30);

            getBackendHealth();
        }
        // eslint-disable-next-line
    }, [location]);

    const manipulateTiers = (data) => {
        const result = [];
        result.push(MemberShipInfo[0]); // insert visitor

        for (let tierIdx = 1; tierIdx < MemberShipInfo.length; tierIdx++) {
            const tier = data.find((itm) => itm.name.toLowerCase() === MemberShipInfo[tierIdx].name.toLowerCase());
            if (tier) result.push({ ...tier, logo: MemberShipInfo[tierIdx].logo, isExists: true });
            else result.push({ ...MemberShipInfo[tierIdx] });
        }

        setTiersInfo(result);
    };

    const getTiersInfo = async () => {
        let tiers = await fetchWrapper
            .get('/api/Membership/Tiers')
            .then((res) => res)
            .catch((e) => {
                console.log('/api/Membership/Tiers', e.message);
                return [];
            });

        manipulateTiers(tiers);
    };

    const getSaleList = async (type) => {
        await fetchWrapper
            .get(`/api/Sale/List/${type}`)
            .then((res) => {
                setSalesList(setSaleStatus(res));
            })
            .catch((e) => {
                console.log(`Error from /api/Sale/List/${type}`, e);
            });
    };

    useEffect(() => {
        if (!account || !isValidWallet) return;

        isMounted.current && getSaleList('Private');
        // eslint-disable-next-line
    }, [account, isValidWallet]);

    useEffect(() => {
        window.ethereum?.on('chainChanged', function (networkId) {
            if (parseInt(networkId) !== parseInt(process.env.REACT_APP_CHAIN_ID)) {
                logout();
                disconnectWallet();
                // setWrongNetwork(true);
            } else {
                setWrongNetwork(false);
            }
        });

        window.ethereum?.on('accountsChanged', function (accounts) {
            if (accounts.length < 1 || !window.ethereum.isConnected()) return;

            setAccount(accounts[0]);
        });

        window.ethereum?.on('disconnect', function (err) {
            logout();
            disconnectWallet();
        });

        const getPublicPools = () => {
            let poolsData = getPoolsData();
            let farmings = [],
                stakings = [];
            for (const poolData of poolsData) {
                if (poolData.type === 'Farming') farmings.push(poolData);
                else stakings.push(poolData);
            }

            setFarmings(farmings);
            setStakings(stakings);
        };

        const getTierFactoryAddress = async () => {
            const tierFactoryAddress = await fetchWrapper
                .get('/api/Misc/TierFactoryAddress')
                .then((res) => res)
                .catch((e) => {
                    console.log('/api/Misc/TierFactoryAddress', e.message);
                    return null;
                });
            if (tierFactoryAddress) setPublicInfo({ tierFactoryAddress });
        };

        publicSocket.current.on('connect', () => {
            console.log('Public Socket connected');
            // isMounted.current && setReconnecting(false);
        });

        publicSocket.current.on('disconnect', (reason) => {
            console.log('Public Socket disconnected: reason = ', reason);

            if (reason === 'io server disconnect') publicSocket.current.connect();
            // if (reason !== 'is client disconnect') isMounted.current && setReconnecting(true);
        });

        publicSocket.current.on('reconnect', () => {
            console.log('Public Socket reconnecting');
        });

        publicSocket.current.on('List', (data) => {
            console.log('Public socket List', data);
            data = camelcaseKeys(data, { deep: true });
            setSalesList(setSaleStatus(data), 'Public');
        });

        publicSocket.current.on('Tiers', (data) => {
            console.log('Tiers', data);
            data = camelcaseKeys(data, { deep: true });
            updateTiersInfo(data);
        });

        const hasCookie = getCookie('HasAuthCookie') === 'True';
        if (!hasCookie || !localStorage.getItem('prevAddress')) {
            isMounted.current && getSaleList('Public');
        }

        isMounted.current && getPublicPools();
        isMounted.current && getTierFactoryAddress();
        isMounted.current && getTiersInfo();

        isMounted.current && publicSocket.current.connect();

        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line
    }, []);

    return (
        <div id="layout-wrapper">
            <div className="top-mask" />
            <Header />
            {!isBgWorking ? (
                <div className="authenticate-prompt">
                    <span>Oops, something went wrong and service is not available. Please try again later!</span>
                </div>
            ) : (
                <>
                    <TopContents />
                    <Contents>
                        <Outlet />
                    </Contents>
                    <Footer />
                    <Stake />
                    <ProcSwap />
                    <ProcLiquidity />
                </>
            )}
        </div>
    );
};

export default Layout;
