import React, { useEffect, useState } from 'react';

const Reconnect = ({ isShow = false }) => {
    const [delay, setDelay] = useState(0);

    useEffect(() => {
        const intervalFunc = setInterval(() => {
            setDelay((prev) => (prev + 1) % 5);
        }, [500]);

        return () => clearInterval(intervalFunc);
    });

    return (
        <div className={`socket-reconnect-wrapper ${isShow ? 'show-wrapper' : ''}`}>
            <span>{`Connection lost. \r\nTrying to reconnect${Array(delay).fill('.').join('')}`}</span>
        </div>
    );
};

export default Reconnect;
