import React, { useState, useEffect } from 'react';
import Switch from "react-switch";
import { LuFan } from 'react-icons/lu'
import { FaLightbulb } from 'react-icons/fa'
import axios from 'axios';
import '../styles/fan.css';

function Control() {
    const [isFanSwitchOn, setIsFanSwitchOn] = useState(
        JSON.parse(localStorage.getItem('isFanSwitchOn')) || false
    );
    const [isLedSwitchOn, setIsLedSwitchOn] = useState(
        JSON.parse(localStorage.getItem('isLedSwitchOn')) || false
    );

    const [toggleCountData, setToggleCountData] = useState({
        fan: { on: 0, off: 0 },
        led: { on: 0, off: 0 },
    });

    useEffect(() => {
        // Lưu trạng thái vào localStorage khi trạng thái thay đổi
        localStorage.setItem('isFanSwitchOn', JSON.stringify(isFanSwitchOn));
        localStorage.setItem('isLedSwitchOn', JSON.stringify(isLedSwitchOn));
    }, [isFanSwitchOn, isLedSwitchOn]);


    const handleLedSwitchChange = (checked) => {
        setIsLedSwitchOn(checked);
        sendDeviceAction('led', checked ? 'on' : 'off');
        PubSwitchState({ fan: isFanSwitchOn, led: checked });
        updateToggleCount('led', checked);
    };

    const handleFanSwitchChange = (checked) => {
        setIsFanSwitchOn(checked);
        sendDeviceAction('fan', checked ? 'on' : 'off');
        PubSwitchState({ fan: checked, led: isLedSwitchOn });
        updateToggleCount('fan', checked);
    };


    const sendDeviceAction = async (deviceName, action) => {
        try {
            // Gửi yêu cầu POST đến API
            await axios.post('http://localhost:3000/api/device_actions', {
                device_name: deviceName,
                action: action,
            })
                .then(response => {
                    console.log(response.data);
                });
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu API: ', error);
        }
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

    useEffect(() => {
        // Lấy số lần bật/tắt từ server khi component mount
        fetchToggleCount();
    }, []);

    const fetchToggleCount = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/device_actions/toggleCount');
            setToggleCountData(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy số lần bật/tắt từ server:', error);
        }
    };

    const updateToggleCount = (deviceName, isSwitchOn) => {
        const actionType = isSwitchOn ? 'on' : 'off';
        setToggleCountData((prevData) => ({
            ...prevData,
            [deviceName]: {
                ...prevData[deviceName],
                [actionType]: prevData[deviceName][actionType] + 1,
            },
        }));
    };

    return (
        <>
            <div className="flex flex-col items-center px-2 py-4 cursor-pointer bg-red-300 gap-4 ">
                <div className='flex items-center'>
                    <div>
                        <p>Lần bật đèn: {toggleCountData.led.on}</p>
                        <p>Lần tắt đèn: {toggleCountData.led.off}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <FaLightbulb
                            className='h-32 w-32'
                            style={{ color: isLedSwitchOn ? 'yellow' : 'white' }}
                        />
                        <Switch onChange={handleLedSwitchChange} checked={isLedSwitchOn} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center px-2 py-4 cursor-pointer bg-red-300 gap-4 ">
                <div className='flex items-center'>
                    <div>
                        <p>Lần bật quạt: {toggleCountData.fan.on}</p>
                        <p>Lần tắt quạt: {toggleCountData.fan.off}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <LuFan
                            className={`h-32 w-32 ${isFanSwitchOn ? 'rotate-fan' : ''}`}
                            style={{ transition: 'transform 1s', color: 'white' }}
                        />
                        <Switch onChange={handleFanSwitchChange} checked={isFanSwitchOn} />

                    </div>
                </div>
            </div>
        </>
    );
}

export default Control;