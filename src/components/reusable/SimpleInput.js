import React from 'react';

const SimpleInput = ({ prefix, inputRef, onChange }) => {
    return (
        <div className="simple-input-container">
            <input type="text" ref={inputRef} placeholder="" onChange={onChange} />
            <div className="prefix-container">
                <span>{prefix}</span>
            </div>
        </div>
    );
};

export default SimpleInput;
