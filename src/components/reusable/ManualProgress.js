import React from 'react';

const ManualProgress = ({ title, progress, endTime }) => {
    const Parentdiv = {
        width: '100%',
        background: '#1A2238',
        borderRadius: '20px',
        boxShadow: '0px 0px 0px 1.6px #1A2238, -4px -4px 8px rgba(255, 255, 255, 0.1), 4px 8px 8px rgba(1, 7, 19, 0.2)',
    };

    const Childdiv = {
        height: '100%',
        width: `${progress}%`,
        background: 'linear-gradient(180deg, #22B9B5 0%, #37D6B2 100%)',
        borderRadius: '20px',
    };

    return (
        <div className="progress-bar-wrapper">
            <div className="title-bar">
                <span>{title}</span>
                <span>{progress}%</span>
            </div>
            <div style={Parentdiv} className="rootDiv">
                <div style={Childdiv}></div>
            </div>
            <div className="token-status-bar">
                <span>End Time: </span>
                <span>{endTime}</span>
            </div>
        </div>
    );
};

export default ManualProgress;
