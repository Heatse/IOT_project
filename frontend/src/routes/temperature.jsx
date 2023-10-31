import React, { useState, useEffect } from 'react';
import { Thermometer } from 'lucide-react';
import { TbTemperatureCelsius } from 'react-icons/tb';
import { BsThermometerSnow } from 'react-icons/bs'; // Import a snowflake icon
import { BsThermometerHigh } from 'react-icons/bs'; // Import a sun icon


function Temperature() {
    const [temperature, setTemperature] = useState(25);

    useEffect(() => {
        const interval = setInterval(() => {
            // random temperature  between 20 and 30 degrees
            const randomTemperature = Math.floor(Math.random() * 21) + 20;
            setTemperature(randomTemperature);
        }, 3000);

        return () => clearInterval(interval);
    }, []);


    const getBackgroundColor = () => {
        if (temperature < 25) {
            return 'rgba(39, 230, 245, 0.52)';
        } else if (temperature >= 25 && temperature < 30) {
            return 'rgba(0, 255, 0, 1)';
        } else {
            return 'rgba(255, 0, 0, 1)';
        }
    };

    const getTemperatureIcon = (temperature) => {
        if (temperature < 25) {
            return <BsThermometerSnow size={120} color="white" />;
        } else if (temperature >= 25 && temperature < 30) {
            return <Thermometer size={120} color="white" />;
        } else {
            return <BsThermometerHigh size={120} color="white" />;
        }
    };

    return (
        <div className="flex flex-col items-center gap-2 px-2 py-4 cursor-pointer rounded-xl" style={{ backgroundColor: getBackgroundColor() }}>

            {getTemperatureIcon(temperature)}
            <p className={`text-6xl font-bold flex text-white`}>
                {temperature} <TbTemperatureCelsius />
            </p>
            <p className="text-lg text-white">Nhiệt độ</p>
        </div>
    );
}

export default Temperature;