import React, { useState } from 'react';
import { Staking as StakingIcon } from '../../assets/icons';
import { ContentHeader, CustomSelect, FilterButton, SearchInput, TabSlider } from '../reusable';
import { PoolCard } from '../pools';
import { useGlobalContext } from '../../context/global/GlobalState';

const sortOptions = [
    { value: 'ocean', label: 'Ocean' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'red', label: 'Red' },
    { value: 'orange', label: 'Orange' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'green', label: 'Green' },
    { value: 'forest', label: 'Forest' },
    { value: 'slate', label: 'Slate' },
    { value: 'silver', label: 'Silver' },
];

const StakingFilter = ({ className, stakedChanged, liveChanged, orderChanged, keywordChanged }) => {
    console.log(className);
    return (
        <div className={`filter-wrapper ${className}`}>
            <TabSlider tabs={['All', 'Staked Only']} tabChanged={stakedChanged} />
            <div className="second-wrapper">
                <TabSlider tabs={['Live', 'Finished']} tabChanged={liveChanged} />
                <CustomSelect
                    options={sortOptions}
                    placeHolder="Sort By"
                    isBlack={true}
                    isSearchable={false}
                    changeHandler={orderChanged}
                />
            </div>
            <SearchInput placeHolder="Search" setChanged={keywordChanged} />
        </div>
    );
};

const Staking = () => {
    const [liveStatus, setLiveStatus] = useState('All');
    const [stakeStatus, setStakeStatus] = useState('All');
    const [sortOrder, setSortOrder] = useState(null);
    const [searchKeyword, setKeyword] = useState('');
    const [isFilterOpen, setFilterOpen] = useState(false);

    const changeFilterPosition = (status, pos) => {
        setFilterOpen(status);
    };

    const { stakings } = useGlobalContext();

    console.log(liveStatus);
    console.log(stakeStatus);
    console.log(searchKeyword);
    console.log(sortOrder?.value ?? '');

    return (
        <div id="staking" className="page">
            <div className="page-title">
                <StakingFilter
                    stakedChanged={setStakeStatus}
                    liveChanged={setLiveStatus}
                    orderChanged={setSortOrder}
                    keywordChanged={setKeyword}
                />
            </div>
            <div className="page-content">
                <div className="content-header-wrapper">
                    <ContentHeader icon={StakingIcon} title="(Work in progress) Staking">
                        <div className="filter-btn-wrapper">
                            <FilterButton isOpen={isFilterOpen} statusChanged={changeFilterPosition} />
                        </div>
                    </ContentHeader>
                    <div className="content-filter-wrapper">
                        <StakingFilter
                            className={isFilterOpen ? 'open' : ''}
                            stakedChanged={setStakeStatus}
                            liveChanged={setLiveStatus}
                            orderChanged={setSortOrder}
                            keywordChanged={setKeyword}
                        />
                    </div>
                </div>
                <div className="pools-container">
                    {stakings.map((item) => (
                        <PoolCard key={item.id} data={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Staking;
