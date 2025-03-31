import OtarisIcon from '../assets/icons/tokens/otaris.svg';
import EtherIcon from '../assets/icons/tokens/ether.svg';
import WmaticIcon from '../assets/icons/tokens/wmatic.svg';
import USDCIcon from '../assets/icons/tokens/usdc.svg';
import EwtIcon from '../assets/icons/tokens/ewt.svg';
import SatIcon from '../assets/icons/tokens/default.svg';
import UdoIcon from '../assets/icons/tokens/udo.webp';
import BmiIcon from '../assets/icons/tokens/bmi.webp';

export function getMyPools() {
    const saleData = Array.from({ length: 7 }, (_, i) => ({
        type: 'Sales',
        name: `Project Name${i + 1}`,
        desc: 'Something',
        status: 'Block',
        part: '2021-12-01',
        token: '1500',
        usd: '8000',
    }));

    const stakeData = Array.from({ length: 9 }, (_, i) => ({
        type: i % 2 === 0 ? 'Farming' : 'Staking',
        bal: Math.ceil(Math.random() * 10000),
        reward: Math.ceil(Math.random() * 15000),
        token1: 'OTA',
        token2: 'ETH',
        desc: 'Something',
    }));

    return { sales: saleData, stakings: stakeData };
}

export function getPoolsData() {
    const mockTokens = [
        { symbol: 'OTA', icon: OtarisIcon },
        { symbol: 'SAT', icon: SatIcon },
        { symbol: 'EWT', icon: EwtIcon },
        { symbol: 'UDO', icon: UdoIcon },
        { symbol: 'ETH', icon: EtherIcon },
        { symbol: 'WMATIC', icon: WmaticIcon },
        { symbol: 'USDC', icon: USDCIcon },
        { symbol: 'BMI', icon: BmiIcon },
    ];

    const poolsData = Array.from({ length: 18 }, (_, i) => {
        const type = i % 2 === 0 ? 'Farming' : 'Staking';
        const firstToken = Math.floor(Math.random() * 8);
        const secondToken = Math.floor(Math.random() * 8);
        const baseToken = Math.floor(Math.random() * 8);
        const balance = Math.random() * 1000000;

        const result = {
            id: `${i + 1}pools`,
            type,
            stakedBalance: balance,
            exchangeRate: Math.random() * 100,
            fee: Math.random() * 10,
            totalDistributed: Math.random() * 100,
            totalLiquidity: balance + Math.random() * 10000000,
            endsAt: 'dd/mm/yyyy hh:mm UTC',
        };
        if (type === 'Staking') {
            result.baseToken = {
                logo: mockTokens[baseToken].icon,
                ticker: mockTokens[baseToken].symbol,
            };
        } else {
            result.baseToken = {
                ticker: `${mockTokens[firstToken].symbol}-${mockTokens[secondToken].symbol} LP`,
            };
            result.firstToken = {
                logo: mockTokens[firstToken].icon,
                ticker: mockTokens[firstToken].symbol,
            };
            result.secondToken = {
                logo: mockTokens[secondToken].icon,
                ticker: mockTokens[secondToken].symbol,
            };
        }

        const rewardsCount = Math.ceil(Math.random() * 3);

        result.rewards = Array.from({ length: rewardsCount }, (_, rIdx) => {
            const rewardToken = Math.floor(Math.random() * 8);

            return {
                logo: mockTokens[rewardToken].icon,
                ticker: mockTokens[rewardToken].symbol,
                reward: Math.random() * 100000000,
                exchangeRate: Math.random() * 100,
                apy: Math.random() * 10,
                weekly: Math.random() * 1000,
                monthly: Math.random() * 10000,
            };
        });

        return result;
    });

    return poolsData;
}

export function getDetail() {
    let result = {
        tiers: [
            {
                membershipTierId: '83ebcdc9-b8a0-4ae6-9589-7f7647fe2c65',
                spots: '100',
                applied: '30',
                contribution: '30000000000',
                allocation: '100000000000',
            },
            {
                membershipTierId: 'd7fc8121-aa8a-44a2-82fe-8e21dbf6cd65',
                spots: '100',
                applied: '30',
                contribution: '30000000000',
                allocation: '200000000000',
            },
            {
                membershipTierId: '551ebd47-d889-4286-9d24-6d94f06a317f',
                spots: '50',
                applied: '10',
                contribution: '30000000000',
                allocation: '300000000000',
            },
            {
                membershipTierId: 'aa2d98ec-4737-408f-8e13-d5f6d55d1ab6',
                spots: '20',
                applied: '5',
                contribution: '430000000000',
                allocation: '500000000000',
            },
        ],
        claimingStartsAt: '2022-11-22T17:00:00+00:00',
        claimingEndsAt: '2022-11-22T20:00:00+00:00',
        claimingSchedule: ['2022-11-22T17:10:00+00:00', '2022-11-2T17:13:00+00:00', '2022-11-22T18:16:00+00:00'],
        correctAnswer1: null,
        correctAnswer2: null,
        correctAnswer3: null,
        discordGroupLink: null,
        firstIncorrectAnswer1: null,
        firstIncorrectAnswer2: null,
        firstIncorrectAnswer3: null,
        id: 'e4363773-6457-40aa-bffe-8135ad9fa2c9',
        linkToTweet: null,
        maximumRaiseAmountInPaymentToken: '400000000000',
        minimumContributionLeft: null,
        name: 'Otaris IDO',
        overview: null,
        paymentTokenAddress: '0x66ba7fa5bbda651b4e4b64da14f4cff52354c4cd',
        paymentTokenDecimals: '6',
        paymentTokenSymbol: 'PMT',
        project: {
            initialTokenCirculation: '100000000',
            logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxNiAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04LjYzNiAzLjcyNjMyQzguNjM2IDMuNTkzNzEgOC41ODMzMiAzLjQ2NjUzIDguNDg5NTUgMy4zNzI3N0M4LjM5NTc5IDMuMjc5IDguMjY4NjEgMy4yMjYzMiA4LjEzNiAzLjIyNjMySDEuNUMxLjEwMjE4IDMuMjI2MzIgMC43MjA2NDQgMy4zODQzNSAwLjQzOTM0IDMuNjY1NjZDMC4xNTgwMzUgMy45NDY5NiAwIDQuMzI4NDkgMCA0LjcyNjMyTDAgMTQuNzI2M0MwIDE1LjEyNDEgMC4xNTgwMzUgMTUuNTA1NyAwLjQzOTM0IDE1Ljc4N0MwLjcyMDY0NCAxNi4wNjgzIDEuMTAyMTggMTYuMjI2MyAxLjUgMTYuMjI2M0gxMS41QzExLjg5NzggMTYuMjI2MyAxMi4yNzk0IDE2LjA2ODMgMTIuNTYwNyAxNS43ODdDMTIuODQyIDE1LjUwNTcgMTMgMTUuMTI0MSAxMyAxNC43MjYzVjguMDkwMzJDMTMgNy45NTc3MSAxMi45NDczIDcuODMwNTMgMTIuODUzNiA3LjczNjc2QzEyLjc1OTggNy42NDMgMTIuNjMyNiA3LjU5MDMyIDEyLjUgNy41OTAzMkMxMi4zNjc0IDcuNTkwMzIgMTIuMjQwMiA3LjY0MyAxMi4xNDY0IDcuNzM2NzZDMTIuMDUyNyA3LjgzMDUzIDEyIDcuOTU3NzEgMTIgOC4wOTAzMlYxNC43MjYzQzEyIDE0Ljg1ODkgMTEuOTQ3MyAxNC45ODYxIDExLjg1MzYgMTUuMDc5OUMxMS43NTk4IDE1LjE3MzYgMTEuNjMyNiAxNS4yMjYzIDExLjUgMTUuMjI2M0gxLjVDMS4zNjczOSAxNS4yMjYzIDEuMjQwMjEgMTUuMTczNiAxLjE0NjQ1IDE1LjA3OTlDMS4wNTI2OCAxNC45ODYxIDEgMTQuODU4OSAxIDE0LjcyNjNWNC43MjYzMkMxIDQuNTkzNzEgMS4wNTI2OCA0LjQ2NjUzIDEuMTQ2NDUgNC4zNzI3N0MxLjI0MDIxIDQuMjc5IDEuMzY3MzkgNC4yMjYzMiAxLjUgNC4yMjYzMkg4LjEzNkM4LjI2ODYxIDQuMjI2MzIgOC4zOTU3OSA0LjE3MzY0IDguNDg5NTUgNC4wNzk4N0M4LjU4MzMyIDMuOTg2MSA4LjYzNiAzLjg1ODkzIDguNjM2IDMuNzI2MzJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE1Ljk5OTcgMC43MjYzMThDMTUuOTk5NyAwLjU5MzcxIDE1Ljk0NyAwLjQ2NjUzMyAxNS44NTMyIDAuMzcyNzY1QzE1Ljc1OTQgMC4yNzg5OTcgMTUuNjMyMyAwLjIyNjMxOCAxNS40OTk3IDAuMjI2MzE4SDEwLjQ5OTdDMTAuMzY3IDAuMjI2MzE4IDEwLjIzOTkgMC4yNzg5OTcgMTAuMTQ2MSAwLjM3Mjc2NUMxMC4wNTIzIDAuNDY2NTMzIDkuOTk5NjYgMC41OTM3MSA5Ljk5OTY2IDAuNzI2MzE4QzkuOTk5NjYgMC44NTg5MjcgMTAuMDUyMyAwLjk4NjEwNCAxMC4xNDYxIDEuMDc5ODdDMTAuMjM5OSAxLjE3MzY0IDEwLjM2NyAxLjIyNjMyIDEwLjQ5OTcgMS4yMjYzMkgxNC4yOTI3TDYuMTQ1NjYgOS4zNzIzMkM2LjA5OTE3IDkuNDE4ODEgNi4wNjIyOSA5LjQ3NCA2LjAzNzEzIDkuNTM0NzNDNi4wMTE5NyA5LjU5NTQ3IDUuOTk5MDIgOS42NjA1NyA1Ljk5OTAyIDkuNzI2MzJDNS45OTkwMiA5Ljc5MjA2IDYuMDExOTcgOS44NTcxNiA2LjAzNzEzIDkuOTE3OUM2LjA2MjI5IDkuOTc4NjQgNi4wOTkxNyAxMC4wMzM4IDYuMTQ1NjYgMTAuMDgwM0M2LjE5MjE0IDEwLjEyNjggNi4yNDczMyAxMC4xNjM3IDYuMzA4MDcgMTAuMTg4OEM2LjM2ODgxIDEwLjIxNCA2LjQzMzkxIDEwLjIyNjkgNi40OTk2NiAxMC4yMjY5QzYuNTY1NCAxMC4yMjY5IDYuNjMwNSAxMC4yMTQgNi42OTEyNCAxMC4xODg4QzYuNzUxOTggMTAuMTYzNyA2LjgwNzE3IDEwLjEyNjggNi44NTM2NiAxMC4wODAzTDE0Ljk5OTcgMS45MzMzMlY1LjcyNjMyQzE0Ljk5OTcgNS44NTg5MyAxNS4wNTIzIDUuOTg2MSAxNS4xNDYxIDYuMDc5ODdDMTUuMjM5OSA2LjE3MzY0IDE1LjM2NyA2LjIyNjMyIDE1LjQ5OTcgNi4yMjYzMkMxNS42MzIzIDYuMjI2MzIgMTUuNzU5NCA2LjE3MzY0IDE1Ljg1MzIgNi4wNzk4N0MxNS45NDcgNS45ODYxIDE1Ljk5OTcgNS44NTg5MyAxNS45OTk3IDUuNzI2MzJWMC43MjYzMThaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
            longProjectIntroduction: '',
            medium: null,
            overview:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Ut enim ad minim veniam.',
            publicSalePrice: '5',
            tokenAddress: '0xAC209fBB6D3490BDfc35C9198374502973021b98',
            tokenDecimals: '18',
            telegram: null,
            tickerSymbol: 'OTA',
            totalSupply: '10000000000',
            twitter: null,
            website: 'https://otaris.io/',
        },
        question1: null,
        question2: null,
        question3: null,
        restrictedCountries: [],
        rounds: [
            { startsAt: '2022-11-18T18:20:01+00:00', endsAt: '2022-11-21T14:00:00+00:00' },
            { startsAt: '2022-11-21T14:00:01+00:00', endsAt: '2022-11-21T14:50:00+00:00' },
            { startsAt: '2022-11-21T14:50:01+00:00', endsAt: '2022-11-21T18:00:00+00:00' },
        ],
        saleAddress: '0xCd4B3f6ad5399aB4E087cdE7b4968256f14eDE63',
        secondIncorrectAnswer1: null,
        secondIncorrectAnswer2: null,
        secondIncorrectAnswer3: null,
        telegramGroupLink: null,
        tokenPriceInPaymentToken: '2000000',
        totalApplied: 0,
        totalContribution: '210000000000',
        twitterLink: null,
        type: 'TierBased',
        unlimitedAvailableSpots: 500,
        user: {
            allocation: '1000000000',
            canParticipate: true,
            isApplied: true,
            claimableTokens: '5000000000000000000000',
            lockedTokens: '0',
            contribution: '25000000000',
            claimedTokens: '20000000000000000000000',
            totalPurchasedTokens: '25000000000000000000000',
        },
        vestingBlockchainId: '96ef37de-c8c8-4cc0-8976-deec9e3c1e09',
        whitelistStartsAt: '2022-11-18T17:00:00+00:00',
        whitelistEndsAt: '2022-11-18T17:30:00+00:00',
    };

    return result;
}

export function getPublicList() {
    let result = [
        {
            //claimingSchedule: ['2022-11-16T07:10:00+00:00', '2022-11-16T07:13:00+00:00', '2022-11-16T07:16:00+00:00'],
            claimingSchedule: [],
            id: 'e4363773-6457-40aa-bffe-8135ad9fa2c9',
            maximumRaiseAmountInPaymentToken: null,
            name: 'Otaris IDO',
            paymentTokenDecimals: '6',
            paymentTokenSymbol: 'PMT',
            project: {
                binanceMarket: 'https://www.binance.com/test',
                bitfinexMarket: null,
                bithumbMarket: null,
                bitmartMarket: null,
                bittrexMarket: null,
                bybitMarket: null,
                coinbaseMarket: null,
                cryptocomMarket: null,
                ftxMarket: 'https://www.ftx.com/market',
                gateMarket: null,
                initialTokenCirculation: '10000000',
                krakenMarket: null,
                kucoinMarket: null,
                liquidMarket: null,
                logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxNiAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04LjYzNiAzLjcyNjMyQzguNjM2IDMuNTkzNzEgOC41ODMzMiAzLjQ2NjUzIDguNDg5NTUgMy4zNzI3N0M4LjM5NTc5IDMuMjc5IDguMjY4NjEgMy4yMjYzMiA4LjEzNiAzLjIyNjMySDEuNUMxLjEwMjE4IDMuMjI2MzIgMC43MjA2NDQgMy4zODQzNSAwLjQzOTM0IDMuNjY1NjZDMC4xNTgwMzUgMy45NDY5NiAwIDQuMzI4NDkgMCA0LjcyNjMyTDAgMTQuNzI2M0MwIDE1LjEyNDEgMC4xNTgwMzUgMTUuNTA1NyAwLjQzOTM0IDE1Ljc4N0MwLjcyMDY0NCAxNi4wNjgzIDEuMTAyMTggMTYuMjI2MyAxLjUgMTYuMjI2M0gxMS41QzExLjg5NzggMTYuMjI2MyAxMi4yNzk0IDE2LjA2ODMgMTIuNTYwNyAxNS43ODdDMTIuODQyIDE1LjUwNTcgMTMgMTUuMTI0MSAxMyAxNC43MjYzVjguMDkwMzJDMTMgNy45NTc3MSAxMi45NDczIDcuODMwNTMgMTIuODUzNiA3LjczNjc2QzEyLjc1OTggNy42NDMgMTIuNjMyNiA3LjU5MDMyIDEyLjUgNy41OTAzMkMxMi4zNjc0IDcuNTkwMzIgMTIuMjQwMiA3LjY0MyAxMi4xNDY0IDcuNzM2NzZDMTIuMDUyNyA3LjgzMDUzIDEyIDcuOTU3NzEgMTIgOC4wOTAzMlYxNC43MjYzQzEyIDE0Ljg1ODkgMTEuOTQ3MyAxNC45ODYxIDExLjg1MzYgMTUuMDc5OUMxMS43NTk4IDE1LjE3MzYgMTEuNjMyNiAxNS4yMjYzIDExLjUgMTUuMjI2M0gxLjVDMS4zNjczOSAxNS4yMjYzIDEuMjQwMjEgMTUuMTczNiAxLjE0NjQ1IDE1LjA3OTlDMS4wNTI2OCAxNC45ODYxIDEgMTQuODU4OSAxIDE0LjcyNjNWNC43MjYzMkMxIDQuNTkzNzEgMS4wNTI2OCA0LjQ2NjUzIDEuMTQ2NDUgNC4zNzI3N0MxLjI0MDIxIDQuMjc5IDEuMzY3MzkgNC4yMjYzMiAxLjUgNC4yMjYzMkg4LjEzNkM4LjI2ODYxIDQuMjI2MzIgOC4zOTU3OSA0LjE3MzY0IDguNDg5NTUgNC4wNzk4N0M4LjU4MzMyIDMuOTg2MSA4LjYzNiAzLjg1ODkzIDguNjM2IDMuNzI2MzJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE1Ljk5OTcgMC43MjYzMThDMTUuOTk5NyAwLjU5MzcxIDE1Ljk0NyAwLjQ2NjUzMyAxNS44NTMyIDAuMzcyNzY1QzE1Ljc1OTQgMC4yNzg5OTcgMTUuNjMyMyAwLjIyNjMxOCAxNS40OTk3IDAuMjI2MzE4SDEwLjQ5OTdDMTAuMzY3IDAuMjI2MzE4IDEwLjIzOTkgMC4yNzg5OTcgMTAuMTQ2MSAwLjM3Mjc2NUMxMC4wNTIzIDAuNDY2NTMzIDkuOTk5NjYgMC41OTM3MSA5Ljk5OTY2IDAuNzI2MzE4QzkuOTk5NjYgMC44NTg5MjcgMTAuMDUyMyAwLjk4NjEwNCAxMC4xNDYxIDEuMDc5ODdDMTAuMjM5OSAxLjE3MzY0IDEwLjM2NyAxLjIyNjMyIDEwLjQ5OTcgMS4yMjYzMkgxNC4yOTI3TDYuMTQ1NjYgOS4zNzIzMkM2LjA5OTE3IDkuNDE4ODEgNi4wNjIyOSA5LjQ3NCA2LjAzNzEzIDkuNTM0NzNDNi4wMTE5NyA5LjU5NTQ3IDUuOTk5MDIgOS42NjA1NyA1Ljk5OTAyIDkuNzI2MzJDNS45OTkwMiA5Ljc5MjA2IDYuMDExOTcgOS44NTcxNiA2LjAzNzEzIDkuOTE3OUM2LjA2MjI5IDkuOTc4NjQgNi4wOTkxNyAxMC4wMzM4IDYuMTQ1NjYgMTAuMDgwM0M2LjE5MjE0IDEwLjEyNjggNi4yNDczMyAxMC4xNjM3IDYuMzA4MDcgMTAuMTg4OEM2LjM2ODgxIDEwLjIxNCA2LjQzMzkxIDEwLjIyNjkgNi40OTk2NiAxMC4yMjY5QzYuNTY1NCAxMC4yMjY5IDYuNjMwNSAxMC4yMTQgNi42OTEyNCAxMC4xODg4QzYuNzUxOTggMTAuMTYzNyA2LjgwNzE3IDEwLjEyNjggNi44NTM2NiAxMC4wODAzTDE0Ljk5OTcgMS45MzMzMlY1LjcyNjMyQzE0Ljk5OTcgNS44NTg5MyAxNS4wNTIzIDUuOTg2MSAxNS4xNDYxIDYuMDc5ODdDMTUuMjM5OSA2LjE3MzY0IDE1LjM2NyA2LjIyNjMyIDE1LjQ5OTcgNi4yMjYzMkMxNS42MzIzIDYuMjI2MzIgMTUuNzU5NCA2LjE3MzY0IDE1Ljg1MzIgNi4wNzk4N0MxNS45NDcgNS45ODYxIDE1Ljk5OTcgNS44NTg5MyAxNS45OTk3IDUuNzI2MzJWMC43MjYzMThaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
                medium: null,
                mexcMarket: null,
                okexMarket: null,
                overview:
                    "This project is created by Shinagawa.\nIt's fairly easy to use.\nI hope you enjoy well.\nThank you",
                pancakeSwapMarket: 'https://pancakeswap.finance/test01',
                publicSalePrice: '10',
                telegram: null,
                tickerSymbol: 'SAT',
                totalSupply: '1000000000',
                twitter: null,
                uniswapMarket: 'https://app.uniswap.org/market',
                upbitMarket: null,
                website: 'https://otaris-test-shin.io',
            },
            // rounds: [
            //     { startsAt: '2022-11-16T06:20:01+00:00', endsAt: '2022-11-16T06:40:00+00:00' },
            //     { startsAt: '2022-11-16T06:00:00+00:00', endsAt: '2022-11-16T06:20:00+00:00' },
            // ],
            rounds: [],
            tokenPriceInPaymentToken: '1000000',
            type: 'Unlimited',
            whitelistEndsAt: '1669226857',
            whitelistStartsAt: '1669224300',
        },
    ];
    return result;
}
