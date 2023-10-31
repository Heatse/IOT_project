import React, { useState, useEffect } from 'react';
import { Sun } from 'lucide-react';

function Brightness() {
    const [brightness, setBrightness] = useState(100);


    useEffect(() => {
        const interval = setInterval(() => {
            // random brightness from 100 to 1000 Lux
            const randomBrightness = Math.floor(Math.random() * 901) + 100;
            setBrightness(randomBrightness);
        }, 3000);

        return () => clearInterval(interval);
    }, []);


    const getBackgroundColor = () => {
        if (brightness < 200) {
            return 'brown';
        } else if (brightness >= 200 && brightness <= 400) {
            return 'orange';
        } else if (brightness >= 400 && brightness <= 700) {
            return 'rgba(39, 245, 234, 0.8)';
        } else if (brightness >= 700 && brightness <= 1000) {
            return 'rgba(69, 84, 218, 0.8)';
        } else {
            return 'red';
        }
    };

    return (
        <div className="flex flex-col items-center gap-2 px-2 py-4 cursor-pointer " style={{ background: getBackgroundColor() }}>
            <Sun width={120} height={120} color="white" />
            <p className={`text-6xl font-bold text-white`}>
                {brightness} LUX
            </p>
            <p className="text-lg text-white">Độ Sáng</p>
        </div>
    );
}

export default Brightness;