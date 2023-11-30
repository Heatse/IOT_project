import React, { createContext, useContext, useState, useEffect } from 'react';

const SwitchContext = createContext();

export const SwitchProvider = ({ children }) => {
    const [isFanSwitchOn, setIsFanSwitchOn] = useState(false);
    const [isLedSwitchOn, setIsLedSwitchOn] = useState(false);

    const toggleFanSwitch = () => {
        setIsFanSwitchOn((prevState) => !prevState);
    };

    const toggleLedSwitch = () => {
        setIsLedSwitchOn((prevState) => !prevState);
    };

    useEffect(() => {
        // Save state to local storage when it changes
        localStorage.setItem('isFanSwitchOn', JSON.stringify(isFanSwitchOn));
        localStorage.setItem('isLedSwitchOn', JSON.stringify(isLedSwitchOn));
    }, [isFanSwitchOn, isLedSwitchOn]);

    const contextValue = {
        isFanSwitchOn,
        isLedSwitchOn,
        toggleFanSwitch,
        toggleLedSwitch,
    };

    return (
        <SwitchContext.Provider value={contextValue}>
            {children}
        </SwitchContext.Provider>
    );
};

export const useSwitch = () => {
    const context = useContext(SwitchContext);
    if (!context) {
        throw new Error('useSwitch must be used within a SwitchProvider');
    }
    return context;
};