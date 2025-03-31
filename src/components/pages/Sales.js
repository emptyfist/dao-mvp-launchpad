import React, { useEffect, useRef, useState } from 'react';
import { useWidth } from '../../hooks';
import { ContentHeader, LiveCard } from '../sales';
import { Overview } from '../ido';
import { CustomSelect, FilterButton, SearchInput, TabSlider } from '../reusable';
import { Check, Play, StopWatch } from '../../assets/icons';
import { LAPTOP_WIDTH, SALE_GOING_STATUS, SALE_TYPE } from '../../config/constants';
import { useGlobalContext } from '../../context/global/GlobalState';
// import { getPublicList } from '../../config/mock';

const sortOptions = [
    { value: 'asc', label: 'ABC ascending' },
    { value: 'desc', label: 'ABC descending' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
];

const SalesFilter = ({ className, ongoingChanged, orderChanged, keywordChanged }) => {
    return (
        <div className={`filter-wrapper ${className ?? ''}`}>
            <TabSlider
                tabs={['All', SALE_GOING_STATUS.Ongoing, SALE_GOING_STATUS.Upcoming, SALE_GOING_STATUS.Completed]}
                tabChanged={ongoingChanged}
            />
            <div className="second-wrapper">
                <CustomSelect
                    options={sortOptions}
                    placeHolder="Sort By"
                    isBlack={true}
                    isSearchable={false}
                    changeHandler={orderChanged}
                />

                <SearchInput placeHolder="Search" setChanged={keywordChanged} />
            </div>
        </div>
    );
};

const Sales = () => {
    const [isFilterOpen, setFilterOpen] = useState(false);

    const [goingTab, setGoingTab] = useState('All');
    const [sortOrder, setSortOrder] = useState(null);
    const [keyword, setKeyword] = useState(null);

    const filterPosition = useRef(0);
    const isAlreadyUpdated = useRef(false);
    const isMounted = useRef(true);
    const { account, isValidWallet, salesList, setSalesList, setSaleStatus, timeOffset } = useGlobalContext();

    useEffect(() => {
        if (!timeOffset || salesList.length < 1 || isAlreadyUpdated.current) return;

        setSalesList(setSaleStatus(salesList, false));
        isAlreadyUpdated.current = true;
        // eslint-disable-next-line
    }, [timeOffset, salesList]);

    const resetScreen = () => {
        if (isFilterOpen) {
            window.scroll(0, 0);
            setFilterOpen(false);
        }
    };

    const onGoingChanged = (val) => {
        setGoingTab(val);
        resetScreen();
    };

    const onOrderChanged = (val) => {
        setSortOrder(val.value);
        resetScreen();
    };

    const onKeywordChanged = (val) => {
        setKeyword(val);
        resetScreen();
    };

    const filterSales = () => {
        let result = [];
        if (!account || !isValidWallet) {
            result = salesList.filter((sale) => sale.type !== SALE_TYPE.Private);
        } else {
            result = salesList;
        }

        if (goingTab !== 'All') result = result.filter((sale) => sale.status === goingTab);
        if (sortOrder) {
            if (sortOrder === 'asc') {
                result = result.sort((first, second) => {
                    if (first.name < second.name) return -1;
                    if (first.name > second.name) return 1;

                    return 0;
                });
            } else if (sortOrder === 'desc') {
                result = result.sort((first, second) => {
                    if (first.name < second.name) return 1;
                    if (first.name > second.name) return -1;

                    return 0;
                });
            } else if (sortOrder === 'newest') {
                result = result.sort((first, second) => {
                    if (
                        first.rounds.length > 1 &&
                        second.rounds.length > 1 &&
                        first.rounds[0].startsAt < second.rounds[0].startsAt
                    )
                        return 1;
                    if (
                        first.rounds.length > 1 &&
                        second.rounds.length > 1 &&
                        first.rounds[0].startsAt > second.rounds[0].startsAt
                    )
                        return -1;

                    if (first.rounds.length < 1) return 1;
                    return 0;
                });
            } else if (sortOrder === 'oldest') {
                result = result.sort((first, second) => {
                    if (
                        first.rounds.length > 1 &&
                        second.rounds.length > 1 &&
                        first.rounds[0].startsAt < second.rounds[0].startsAt
                    )
                        return -11;
                    if (
                        first.rounds.length > 1 &&
                        second.rounds.length > 1 &&
                        first.rounds[0].startsAt > second.rounds[0].startsAt
                    )
                        return 1;

                    if (first.rounds.length < 1) return -1;
                    return 0;
                });
            }
        }
        if (keyword) result = result.filter((sale) => sale.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1);

        return result;
    };

    const changeFilterPosition = (status, pos) => {
        setFilterOpen(status);
        filterPosition.current = pos;
    };

    const windowWidth = useWidth();
    useEffect(() => {
        if (windowWidth > LAPTOP_WIDTH && isFilterOpen && isMounted.current) setFilterOpen(false);
    }, [windowWidth, isFilterOpen]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        <div id="sales" className="page">
            <div
                className="page-title"
                style={{
                    top: isFilterOpen
                        ? `calc(${filterPosition.current}px + 36px)`
                        : windowWidth > LAPTOP_WIDTH
                        ? 'unset'
                        : '-500px',
                }}
            >
                <SalesFilter
                    ongoingChanged={onGoingChanged}
                    orderChanged={onOrderChanged}
                    keywordChanged={onKeywordChanged}
                />
            </div>
            <div className="page-content">
                {(goingTab === 'All' || goingTab === SALE_GOING_STATUS.Ongoing) && (
                    <>
                        <div className="content-header-wrapper">
                            <ContentHeader icon={Play} title="Live">
                                <div className="filter-btn-wrapper">
                                    <FilterButton isOpen={isFilterOpen} statusChanged={changeFilterPosition} />
                                </div>
                            </ContentHeader>
                        </div>
                        <div className="content-body">
                            {filterSales()
                                .filter((sale) => sale.status === SALE_GOING_STATUS.Ongoing)
                                .map((item) => (
                                    <Overview isPreview={true} key={item.id} data={item} />
                                ))}
                        </div>
                    </>
                )}
                {(goingTab === 'All' || goingTab === SALE_GOING_STATUS.Upcoming) && (
                    <>
                        <div className="content-header-wrapper">
                            <ContentHeader icon={StopWatch} title="Upcoming">
                                <div className="filter-btn-wrapper">
                                    <FilterButton isOpen={isFilterOpen} statusChanged={changeFilterPosition} />
                                </div>
                            </ContentHeader>
                        </div>
                        <div className="content-body with-children">
                            {filterSales()
                                .filter((sale) => sale.status === SALE_GOING_STATUS.Upcoming)
                                .map((item) => (
                                    <LiveCard data={item} key={item.id} />
                                ))}
                        </div>
                    </>
                )}
                {(goingTab === 'All' || goingTab === SALE_GOING_STATUS.Completed) && (
                    <>
                        <div className="content-header-wrapper">
                            <ContentHeader icon={Check} title="Completed">
                                <div className="filter-btn-wrapper">
                                    <FilterButton isOpen={isFilterOpen} statusChanged={changeFilterPosition} />
                                </div>
                            </ContentHeader>
                        </div>
                        <div className="content-body with-children">
                            {filterSales()
                                .filter((sale) => sale.status === SALE_GOING_STATUS.Completed)
                                .map((item) => (
                                    <LiveCard data={item} key={item.id} />
                                ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sales;
