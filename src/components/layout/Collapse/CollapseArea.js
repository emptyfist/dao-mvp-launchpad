import React, { useCallback, useState } from 'react';
import { useGlobalContext } from '../../../context/global/GlobalState';
import { TabSlider } from '../../reusable';
import Pagination from './Pagination';
import TableHeader from './TableHeader';
import SaleTableRow from './SaleTableRow';
import StakeTableRow from './StakeTableRow';

const SalesHeader = [
    { key: 'name', text: 'Project', sortable: true, order: 'desc' },
    { key: 'status', text: 'Vesting', sortable: true, order: 'desc' },
    { key: 'part', text: 'Participated', sortable: true, order: 'desc' },
    { key: 'tokens', text: 'Tokens', sortable: true, order: 'desc' },
    { key: 'action', text: 'Actions', sortable: false },
];

const StakeHeader = [
    { key: 'name', text: 'Pool', sortable: true, order: 'desc' },
    { key: 'type', text: 'Type', sortable: true, order: 'desc' },
    { key: 'bal', text: 'My Staked Balance', sortable: true, order: 'desc' },
    { key: 'reward', text: 'Unclaimed Rewards', sortable: true, order: 'desc' },
    { key: 'action', text: 'Actions', sortable: false },
];

const SALE_TAB = 'My Sales';
const STAKE_TAB = 'My LM Pools';
const PAGE_PER_ROWS = 5;

const CollapseArea = () => {
    const { personalInfo } = useGlobalContext();

    const [curTab, setCurrentTab] = useState(SALE_TAB);
    const [salesHeader, setSalesHeader] = useState(SalesHeader);
    const [stakeHeader, setStakeHeader] = useState(StakeHeader);
    const [pageInfo, setPageInfo] = useState({ salePage: 1, stakePage: 1 });

    const getHeaderColumns = useCallback(() => {
        if (curTab === SALE_TAB) return salesHeader;
        return stakeHeader;
    }, [curTab, salesHeader, stakeHeader]);

    const changeOrder = (key, order) => {
        if (curTab === SALE_TAB) {
            const temp = salesHeader.map((itm) => {
                if (itm.key === key) return { ...itm, order };
                return { ...itm, order: 'desc' };
            });
            setSalesHeader(temp);
        } else
            setStakeHeader(
                StakeHeader.map((itm) => {
                    if (itm.key === key) return { ...itm, order };
                    return itm;
                })
            );
    };

    const pageChanged = (page) => {
        if (curTab === SALE_TAB) {
            setPageInfo({ ...pageInfo, salePage: page });
            return;
        }
        setPageInfo({ ...pageInfo, stakePage: page });
    };

    return (
        <div className="top-content-collapse">
            <div className="divider" />
            <TabSlider tabs={[SALE_TAB, STAKE_TAB]} tabChanged={setCurrentTab} />
            <Pagination
                totals={curTab === SALE_TAB ? personalInfo.sales.length : personalInfo.stakings.length}
                curPage={curTab === SALE_TAB ? pageInfo.salePage : pageInfo.stakePage}
                perPage={PAGE_PER_ROWS}
                setPage={pageChanged}
            >
                <TableHeader
                    getColumns={getHeaderColumns}
                    setOrder={changeOrder}
                    className={curTab === SALE_TAB ? 'sale' : 'stake'}
                />
                {curTab === SALE_TAB
                    ? personalInfo.sales
                          .slice((pageInfo.salePage - 1) * PAGE_PER_ROWS, pageInfo.salePage * PAGE_PER_ROWS)
                          .map((pool, index) => <SaleTableRow key={index} row={pool} />)
                    : personalInfo.stakings
                          .slice((pageInfo.stakePage - 1) * PAGE_PER_ROWS, pageInfo.stakePage * PAGE_PER_ROWS)
                          .map((pool, index) => <StakeTableRow key={index} row={pool} />)}
            </Pagination>
            <div className="divider bottom" />
        </div>
    );
};

export default CollapseArea;
