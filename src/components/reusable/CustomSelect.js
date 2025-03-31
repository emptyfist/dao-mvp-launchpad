import Select from 'react-select';
import React, { useEffect, useState } from 'react';

// const colorOptions = [
//     { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
//     { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
//     { value: 'purple', label: 'Purple', color: '#5243AA' },
//     { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
//     { value: 'orange', label: 'Orange', color: '#FF8B00' },
//     { value: 'yellow', label: 'Yellow', color: '#FFC400' },
//     { value: 'green', label: 'Green', color: '#36B37E' },
//     { value: 'forest', label: 'Forest', color: '#00875A' },
//     { value: 'slate', label: 'Slate', color: '#253858' },
//     { value: 'silver', label: 'Silver', color: '#666666' },
//   ];

const customStyles = {
    option: (provided, state) => ({
        ...provided,
        //   color: 'white', //state.isSelected ? 'red' : 'blue',
        padding: '10px 20px',
        backgroundColor: state.isSelected ? '#1A2238' : state.isFocused ? '#3F5266' : '#242F4E',
    }),
    control: (provided, state) => ({
        ...provided,
        backgroundColor: state.selectProps.isAlert ? '#FD7575' : state.selectProps.isBlack ? '#181f35' : '#242f4e',
        color: 'rgba(255, 255, 255, 0)',
        border: 'none',
        height: state.selectProps.isDetail ? '38px' : '44px',
        borderRadius: state.selectProps.isDetail ? '30px' : state.selectProps.isBlack ? '20px' : '10px',
        padding: state.selectProps.isDetail ? '.2rem 0 .2rem 1rem' : '0',
        textAlign: state.selectProps.isDetail ? 'center' : '',
        fontFamily: 'Source Sans Pro, sans-serif',
        fontSize: '14px',
        fontWeight: '400',
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';
        const color = '#fff';

        return { ...provided, color, opacity, transition };
    },
    menu: (provided, state) => ({
        ...provided,
        backgroundColor: '#242F4E',
        textAlign: state.selectProps.isDetail ? 'center' : '',
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.5)',
        zIndex: 10,
    }),
    placeholder: (provided, state) => ({
        ...provided,
        color: state.selectProps.isDetail ? '#687C92' : 'rgba(255, 255, 255, 0.5)',
    }),
    input: (provided) => ({
        ...provided,
        color: '#fff',
    }),
    dropdownIndicator: (provided, state) => ({
        ...provided,
        color: state.selectProps.isDetail ? '#fff' : '#687C92',
        background: state.selectProps.isDetail ? 'linear-gradient(110.05deg, #3BDCB1 13.06%, #11A3B7 84.95%)' : '',
        borderRadius: state.selectProps.isDetail ? '30px' : '',
        '&:hover': {
            color: '#687C92',
            opacity: '.8',
        },
        padding: state.selectProps.isDetail ? '6px' : '4px',
    }),
    clearIndicator: (provided) => ({
        ...provided,
        color: '#687C92',
        '&:hover': {
            color: '#687C92',
            opacity: '.8',
        },
    }),
    indicatorsContainer: (provided, state) => ({
        ...provided,
        paddingRight: state.selectProps.isDetail ? '4px' : '',
    }),
    indicatorSeparator: (provided, state) => ({
        ...provided,
        display: 'none',
    }),
};

const CustomSelect = ({
    options,
    placeHolder,
    changeHandler,
    isAlert,
    defaultValue = '',
    isDetail = false,
    isBlack = false,
    isDisabled = false,
    isClearable = false,
    isSearchable = true,
}) => {
    const [selValue, setSelectedValue] = useState(defaultValue);

    const selectionChanged = (selected) => {
        setSelectedValue(selected);
        changeHandler(selected);
    };

    useEffect(() => {
        setSelectedValue(defaultValue);
    }, [defaultValue]);

    return (
        <Select
            value={selValue}
            onChange={(selected) => selectionChanged(selected)}
            className="basic-single"
            classNamePrefix="select"
            isDisabled={isDisabled}
            isLoading={false}
            isClearable={isClearable}
            isRtl={false}
            isSearchable={isSearchable}
            name="color"
            options={options}
            styles={customStyles}
            placeholder={placeHolder}
            isAlert={isAlert}
            isDetail={isDetail}
            isBlack={isBlack}
        />
    );
};

export default CustomSelect;
