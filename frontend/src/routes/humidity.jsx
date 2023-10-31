import React, { useState, useEffect } from 'react';
import { Droplets } from 'lucide-react';

function Humidity() {
    const [humidity, setHumidity] = useState(40);


    useEffect(() => {
        const interval = setInterval(() => {
            // random humidity  30% and 50%
            const randomHumidity = Math.floor(Math.random() * 91) + 10;
            setHumidity(randomHumidity);

        }, 3000);

        return () => clearInterval(interval);
    }, []);


    const getBackgroundColor = () => {
        if (humidity < 15) {
            return 'brown';
        } else if (humidity >= 15 && humidity <= 40) {
            return 'orange';
        } else if (humidity >= 40 && humidity <= 70) {
            return 'blue';
        } else {
            return 'red';
        }
    };

    return (
        <div className="flex flex-col items-center gap-2 px-2 py-4 cursor-pointer" style={{ backgroundColor: getBackgroundColor() }}>
            <Droplets width={120} height={120} color="white" />
            <p className={`text-6xl font-bold text-white`}>
                {humidity} %
            </p>
            <p className="text-lg text-white">Độ ẩm</p>
        </div>
    );
}

export default Humidity;