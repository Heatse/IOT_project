import React, { useState, useEffect } from 'react';
import { GiDustCloud } from 'react-icons/gi';
import { Thermometer } from 'lucide-react';

function Dust() {
    const [dust, setDust] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            // Random dust value between 10 and 100
            const randomDust = Math.floor(Math.random() * 91) + 10;
            setDust(randomDust);

            // Send the data to your API
            fetch('http://localhost:3000/api/dust', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dust: randomDust }),
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []); useEffect(() => {
        const interval = setInterval(() => {
            // Random dust value between 10 and 100
            const randomDust = Math.floor(Math.random() * 91) + 10;
            setDust(randomDust);

            // Send the data to your API
            fetch('http://localhost:3000/api/dust', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dust: randomDust }),
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);


    const createBrightnessGradient = (value, lowThreshold, mediumThreshold, highThreshold) => {
        let colorStops = [];

        if (value < lowThreshold) {
            colorStops = ['blue', 'green'];
        } else if (value >= lowThreshold && value <= mediumThreshold) {
            colorStops = ['green', 'yellow'];
        } else if (value >= mediumThreshold && value <= highThreshold) {
            colorStops = ['yellow', 'orange'];
        } else {
            colorStops = ['orange', 'red'];
        }

        return `linear-gradient(to bottom, ${colorStops[0]}, ${colorStops[1]})`;
    };

    return (
        <div className="flex flex-col items-center gap-2 px-2 py-4 cursor-pointer rounded-xl" style={{ background: createBrightnessGradient(dust, 15, 40, 70) }}>
            {/* <GiDustCloud width={120} height={120} color="white" /> */}
            <p className={`text-9xl flex font-bold text-white`}>
                <GiDustCloud />
            </p>
            <p className={`text-6xl font-bold text-white`}>
                {dust} %
            </p>
            <p className="text-lg text-white">Độ Bụi</p>
        </div>
    );
}

export default Dust
