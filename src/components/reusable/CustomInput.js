import React, {useState} from 'react';
import { EllipseButton } from '../reusable';
const CustomInput = (props) => {
    const [inputValue, setInputValue] = useState(0);

    const onMaxBtnClick = () => {
        setInputValue(1000);
    }

    const getInputValue= (e) => {
        // if (e.target.value.length > 5) {
        //     setInputValue(0);
        // }
        // else if (e.target.value > 1000) {
        //     setInputValue(1000);
        // }
        // else {
        //     setInputValue(e.target.value);
        // }
        setInputValue(e.target.value);
    }

    return (
        <div className='custom-input-container'>
            <input type='number' value={inputValue} onChange={getInputValue} placeholder='' />
            <EllipseButton clickHandler={onMaxBtnClick}>MAX</EllipseButton>
        </div>
    );
};

export default CustomInput;
