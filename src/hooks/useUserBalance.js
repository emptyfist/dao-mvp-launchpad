import { Contract, utils } from 'ethers';
import { useEffect, useState } from 'react';
import config from '../config/config';

const useUserBalance = (tokenAddress, account, library) => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (!tokenAddress || !account || !library) return;

        (async () => {
            try {
                const erc20Contract = new Contract(tokenAddress, config.abis.erc20, library.getSigner());

                const userBalance = await erc20Contract.balanceOf(account);

                setBalance(userBalance);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [tokenAddress, account, library]);

    return utils.formatUnits(balance);
};

export default useUserBalance;
