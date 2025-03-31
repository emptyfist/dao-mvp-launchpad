import camelcaseKeys from 'camelcase-keys';
import { utils } from 'ethers';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import { useTimerContext } from '../../context/timer/TimerState';
import { fetchWrapper } from '../../helpers/fetch-wrapper';
import { getCookie, parseMarkdown } from '../../helpers/functions';
import { Overview, Sales, Details } from '../ido';
import { ArrowLeft, Ido } from '../../assets/icons';
import { SALE_TYPE } from '../../config/constants';
import { useGlobalContext } from '../../context/global/GlobalState';
import { useSaleContext } from '../../context/sale/SaleState';

const SaleDetail = ({ saleId }) => {
    const isMounted = useRef(true);
    const { account, isValidWallet, publicSocket, privateSocket } = useGlobalContext();
    const { salePublic, setSalePublic, setTimeOffset } = useSaleContext();
    const { timeOffset } = useTimerContext();
    const [currentTab, setCurrentTab] = useState('Sales');
    let navigate = useNavigate();

    useEffect(() => {
        if (!timeOffset) return;
        setTimeOffset(timeOffset);
        // eslint-disable-next-line
    }, [timeOffset]);

    const makeSolidFields = (data, hasUserInfo = true) => {
        const paymentTokenSymbol = data?.paymentTokenSymbol ?? '';
        const paymentTokenDecimals = data?.paymentTokenDecimals ?? 0;
        const totalContribution = data?.totalContribution ?? 0;
        const maximumRaiseAmountInPaymentToken = data?.maximumRaiseAmountInPaymentToken ?? 0;
        const tokenPriceInPaymentToken = data?.tokenPriceInPaymentToken ?? 0;
        const totalSold =
            tokenPriceInPaymentToken > 0
                ? utils.formatUnits(utils.parseUnits('' + totalContribution, 0).div(tokenPriceInPaymentToken), 0)
                : 0;
        const maxContribution = maximumRaiseAmountInPaymentToken;
        const maxSold =
            tokenPriceInPaymentToken > 0
                ? utils.formatUnits(
                      utils.parseUnits('' + maximumRaiseAmountInPaymentToken, 0).div(tokenPriceInPaymentToken),
                      0
                  )
                : 0;

        if (data.whitelistStartsAt) data.whitelistStartsAt = new Date(data.whitelistStartsAt * 1000);
        if (data.whitelistEndsAt) data.whitelistEndsAt = new Date(data.whitelistEndsAt * 1000);
        if (data.rounds?.length > 0) {
            data.rounds = data.rounds.sort((first, second) => {
                if (first.startsAt < second.startsAt) return -1;
                if (first.startsAt > second.startsAt) return 1;

                return 0;
            });

            data.rounds = data.rounds.map((round) => {
                return {
                    startsAt: round.startsAt ? new Date(round.startsAt * 1000) : null,
                    endsAt: round.endsAt ? new Date(round.endsAt * 1000) : null,
                };
            });
        }

        if (data.claimingSchedule?.length > 0) {
            data.claimingSchedule = data.claimingSchedule.map((cliff) => new Date(cliff * 1000));
        }

        if (hasUserInfo) {
            return {
                ...data,
                tokenPriceInPaymentToken,
                paymentTokenDecimals,
                paymentTokenSymbol,
                totalContribution,
                maximumRaiseAmountInPaymentToken,
                minimumRaiseAmountInPaymentToken: data?.minimumRaiseAmountInPaymentToken ?? '0',
                minimumContributionLeft: data?.minimumContributionLeft ?? '0',
                totalSold,
                maxContribution,
                maxSold,
                allocation: data.user?.allocation ?? '0',
                isWhitelisted: data.user?.isWhitelisted,
                isRefunded: data.user?.isRefunded,
                claimableTokens: data.user?.claimableTokens ?? '0',
                lockedTokens: data.user?.lockedTokens ?? '0',
                contribution: data.user?.contribution ?? '0',
                isApplied: data.user?.isApplied,
                claimedTokens: data.user?.claimedTokens ?? '0',
                totalPurchasedTokens: data.user?.totalPurchasedTokens ?? '0',
                membershipTierId: data.user?.membershipTierId,
            };
        }

        return {
            ...data,
            tokenPriceInPaymentToken,
            paymentTokenDecimals,
            paymentTokenSymbol,
            totalContribution,
            maximumRaiseAmountInPaymentToken,
            minimumContributionLeft: data?.minimumContributionLeft ?? 0,
            totalSold,
            maxContribution,
            maxSold,
        };
    };

    const getSaleDetails = async (viewType) => {
        await fetchWrapper
            .get(`/api/Sale/Detail/${viewType}/${saleId}`)
            .then(async (res) => {
                const data = makeSolidFields(res);
                setSalePublic({ ...data });
            })
            .catch((msg) => {
                console.log(msg);
            });
    };

    const setUserSaleInfo = (data) => {
        isMounted.current &&
            setSalePublic({
                allocation: data.allocation ?? '0',
                isWhitelisted: data.isWhitelisted,
                isRefunded: data.isRefunded,
                claimableTokens: data.claimableTokens ?? '0',
                lockedTokens: data.lockedTokens ?? '0',
                contribution: data.contribution ?? '0',
                isApplied: data.isApplied,
                claimedTokens: data.claimedTokens ?? '0',
                totalPurchasedTokens: data.totalPurchasedTokens ?? '0',
                membershipTierId: data.membershipTierId,
            });
    };

    useEffect(() => {
        if (!account || !isValidWallet) return;

        getSaleDetails('Private');

        // eslint-disable-next-line
    }, [account, isValidWallet]);

    useEffect(() => {
        if (!salePublic.id) return;

        if (salePublic.type === SALE_TYPE.Private) {
            privateSocket.current.on(`Detail:${saleId}`, (res) => {
                console.log(`private detail:${saleId}`, res);
                let data = camelcaseKeys(res, { deep: true });
                data = makeSolidFields(data, false);
                isMounted.current && setSalePublic({ ...data });
            });
        } else {
            publicSocket.current.on(`Detail:${saleId}`, (res) => {
                console.log(`public detail:${saleId}`, res);
                let data = camelcaseKeys(res, { deep: true });
                data = makeSolidFields(data, false);
                isMounted.current && setSalePublic({ ...data });
            });
        }

        privateSocket.current.on(`Sale:${saleId}`, (res) => {
            console.log(`sale:${saleId}`, res);
            let data = camelcaseKeys(res, { deep: true });
            setUserSaleInfo(data);
        });
        // eslint-disable-next-line
    }, [salePublic.id, salePublic.type]);

    useEffect(() => {
        const hasCookie = getCookie('HasAuthCookie') === 'True';
        if (!hasCookie || !localStorage.getItem('prevAddress')) {
            isMounted.current && getSaleDetails('Public');
        }

        return () => {
            isMounted.current = false;

            // eslint-disable-next-line
            publicSocket.current.removeAllListeners(`Detail:${saleId}`);
            privateSocket.current.removeAllListeners(`Detail:${saleId}`);
            // eslint-disable-next-line
            privateSocket.current.removeAllListeners(`Sale:${saleId}`);
        };
        // eslint-disable-next-line
    }, []);

    const handleTab = (tab) => {
        if (tab === currentTab) {
            setCurrentTab(tab === 'Sales' ? 'Details' : 'Sales');
            return;
        }

        setCurrentTab(tab);
    };

    const backClicked = (e) => {
        // privateSocket.disconnect();
        navigate('/sales');
    };

    return (
        <div id="sale" className="page">
            <div className="page-title">
                <div className="page-caption">
                    <Ido />
                    <span>Sale & Project Details</span>
                </div>
                <div className="space-gap" />
                <div className="back-wrapper" onClick={backClicked}>
                    <ArrowLeft />
                    <span>Back</span>
                </div>
            </div>
            <div className="page-content">
                <Overview data={salePublic} />
                <div className="tab-container">
                    <div className="tab-header">
                        <span
                            onClick={() => handleTab('Sales')}
                            className={`right`}
                            style={{
                                fontWeight: currentTab === 'Sales' ? 'bold' : '500',
                                color: currentTab === 'Sales' ? '#FFF' : '#FFFFFF80',
                            }}
                        >
                            Sales
                        </span>
                        <span
                            onClick={() => handleTab('Details')}
                            className={`left`}
                            style={{
                                fontWeight: currentTab === 'Details' ? 'bold' : '500',
                                color: currentTab === 'Details' ? '#FFF' : '#FFFFFF80',
                            }}
                        >
                            Details
                        </span>
                        <div
                            className="animated-bg"
                            style={{
                                transform: `translate(${currentTab === 'Sales' ? 0 : 100}%)`,
                            }}
                        />
                    </div>
                    {currentTab === 'Sales' ? (
                        <Sales />
                    ) : (
                        <Details
                            contents={
                                salePublic?.project?.longProjectIntroduction
                                    ? parseMarkdown(salePublic.project.longProjectIntroduction)
                                    : []
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SaleDetail;
