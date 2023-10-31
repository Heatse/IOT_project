import React, { useState } from 'react';
import Switch from "react-switch";
import { LuFan } from 'react-icons/lu'
import { FaLightbulb } from 'react-icons/fa'
import axios from 'axios';
import '../styles/fan.css';

function Control() {
    const [isFanSwitchOn, setIsFanSwitchOn] = useState(false);
    const [isLedSwitchOn, setIsLedSwitchOn] = useState(false);

    const handleLedSwitchChange = (checked) => {
        setIsLedSwitchOn(checked);
        updateSwitchState({ fan: isFanSwitchOn, led: checked });
    };

    const handleFanSwitchChange = (checked) => {
        setIsFanSwitchOn(checked);
        updateSwitchState({ fan: checked, led: isLedSwitchOn });

    };

    const updateSwitchState = (switchState) => {
        const newState = {
            led: switchState.led ? 'on' : 'off',
            fan: switchState.fan ? 'on' : 'off'
        };

        // Gửi yêu cầu POST để cập nhật trạng thái vào cột tương ứng của bảng historyac
        axios.post('http://localhost:3000/api/historyac', newState)
            .then(response => {
                console.log(response.data);
                PubSwitchState({ fan: switchState.fan, led: switchState.led });
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật trạng thái công tắc: ' + error.message);
            });
    };

    const PubSwitchState = (switchState) => {
        const newState = {
            led: switchState.led ? 'on' : 'off',
            fan: switchState.fan ? 'on' : 'off'
        };
        // Gửi trạng thái qua API
        axios.post('http://localhost:3000/api/publish', newState)
            .then(response => {
                console.log('Trạng thái đã được gửi thành công:', response.data);
            })
            .catch(error => {
                console.error('Lỗi khi gửi trạng thái qua API:', error);
            });
    };

    return (
        <>
            <div className="flex flex-col items-center px-2 py-4 cursor-pointer bg-red-300 gap-4 ">

                <div className="flex flex-col items-center gap-2">
                    <FaLightbulb
                        className='h-32 w-32'
                        style={{ color: isLedSwitchOn ? 'yellow' : 'white' }}
                    />
                    <Switch onChange={handleLedSwitchChange} checked={isLedSwitchOn} />
                </div>
            </div>

            <div className="flex flex-col items-center px-2 py-4 cursor-pointer bg-red-300 gap-4 ">
                <div className="flex flex-col items-center gap-2">
                    <LuFan
                        className={`h-32 w-32 ${isFanSwitchOn ? 'rotate-fan' : ''}`}
                        style={{ transition: 'transform 1s', color: 'white' }}
                    />
                    <Switch onChange={handleFanSwitchChange} checked={isFanSwitchOn} />
                </div>
            </div>
        </>
    );
}

export default Control;