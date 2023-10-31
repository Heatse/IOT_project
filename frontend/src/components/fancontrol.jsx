import React, { useState } from 'react';
import Switch from 'react-switch';
import { LuFan } from 'react-icons/lu';
import '../styles/fan.css'

function Fancontrol() {
    const [isSwitchOn, setIsSwitchOn] = useState(false);

    // Function to toggle the switch state
    const handleSwitchChange = (checked) => {
        setIsSwitchOn(checked);
    };

    return (
        <div className="flex flex-col items-center gap-2 px-2 py-4 cursor-pointer bg-red-300">
            <div className="flex flex-col items-center gap-2">
                <LuFan
                    className={`h-32 w-32 ${isSwitchOn ? 'rotate-fan' : ''}`}
                    style={{ transition: 'transform 1s', color: 'white' }}
                />
                <Switch onChange={handleSwitchChange} checked={isSwitchOn} />
            </div>
        </div>
    );
}

export default Fancontrol;