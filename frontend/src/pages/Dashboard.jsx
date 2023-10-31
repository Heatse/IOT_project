import React, { useState, useEffect } from 'react';
import { Sun, Thermometer, Droplets } from 'lucide-react';
import { TbTemperatureCelsius } from 'react-icons/tb';
import Control from '../components/control';
import Chart from "chart.js/auto";
import Dust from '../components/Dust';
import {
    CategoryScale, LinearScale,
    PointElement,
    LineElement,
    Title,
    Legend,
    Tooltip
} from "chart.js";
import { Line } from 'react-chartjs-2';

Chart.register(
    CategoryScale,
    Tooltip,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Legend,
);

function Dashboard() {
    const [brightness, setBrightness] = useState(100);
    const [temperature, setTemperature] = useState(25);
    const [humidity, setHumidity] = useState(40);


    const fetchData = () => {
        fetch('http://localhost:3000/api/datalog/lastest')
            .then((response) => response.json())
            .then((data) => {
                setTemperature(data.temperature);
                setHumidity(data.humidity);
                setBrightness(data.brightness);

                updateChartData(data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy dữ liệu từ cơ sở dữ liệu: ', error);
            });
    };

    useEffect(() => {
        // Lấy dữ liệu ban đầu
        fetchData();

        // // Tạo một interval để cập nhật dữ liệu mỗi 5 giây
        const interval = setInterval(() => {
            fetchData();
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    // State to store historical data for the chart
    const [chartData, setChartData] = useState({
        labels: [new Date().toLocaleTimeString()], // Bắt đầu với một thời điểm ban đầu
        datasets: [
            {
                label: 'Temperature',
                data: [], // Bắt đầu với một điểm dữ liệu ban đầu
                backgroundColor: ['rgba(0, 255, 0, 1)'],
                borderColor: 'rgba(0, 255, 0, 1)',
                borderWidth: 1,
            },
            {
                label: 'Humidity',
                data: [], // Bắt đầu với một điểm dữ liệu ban đầu
                backgroundColor: ['rgba(0, 255, 255, 1)'],
                borderColor: 'rgba(0, 255, 255, 1)',
                borderWidth: 1,
            },
            {
                label: 'Brightness',
                data: [], // Bắt đầu với một điểm dữ liệu ban đầu
                backgroundColor: ['rgba(255, 255, 0, 1)'],
                borderColor: 'rgba(255, 255, 0, 1)',
                borderWidth: 1,
            },
        ],
    });

    const updateChartData = (data) => {
        // Get the current time
        const currentTime = new Date().toLocaleTimeString();

        // Cập nhật biểu đồ với dữ liệu mới
        setChartData((prevData) => {
            const newLabels = [...prevData.labels, new Date().toLocaleTimeString()];
            const newTemperatureData = [...prevData.datasets[0].data, data.temperature];
            const newHumidityData = [...prevData.datasets[1].data, data.humidity];
            const newBrightnessData = [...prevData.datasets[2].data, data.brightness];

            // Only keep the last 10 data points
            if (newLabels.length > 10) {
                newLabels.shift();
                newTemperatureData.shift();
                newHumidityData.shift();
                newBrightnessData.shift();
            }

            return {
                labels: newLabels,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: newTemperatureData,
                    },
                    {
                        ...prevData.datasets[1],
                        data: newHumidityData,
                    },
                    {
                        ...prevData.datasets[2],
                        data: newBrightnessData,
                    },
                ],
            };
        });
    };


    const createTemperatureGradient = (value, lowThreshold, mediumThreshold, highThreshold) => {
        let colorStops = [];

        if (value < lowThreshold) {
            colorStops = ['lightblue', 'green'];
        } else if (value >= lowThreshold && value <= mediumThreshold) {
            colorStops = ['green', 'red'];
        } else if (value >= mediumThreshold && value <= highThreshold) {
            colorStops = ['red', 'darkred'];
        } else {
            colorStops = ['darkred', 'purple'];
        }

        return `linear-gradient(to bottom, ${colorStops[0]}, ${colorStops[1]})`;
    };

    const createHumidityGradient = (value, lowThreshold, mediumThreshold, highThreshold) => {
        let colorStops = [];

        if (value < lowThreshold) {
            colorStops = ['lightblue', 'blue'];
        } else if (value >= lowThreshold && value <= mediumThreshold) {
            colorStops = ['blue', 'green'];
        } else if (value >= mediumThreshold && value <= highThreshold) {
            colorStops = ['green', 'yellow'];
        } else {
            colorStops = ['yellow', 'red'];
        }

        return `linear-gradient(to bottom, ${colorStops[0]}, ${colorStops[1]})`;
    };

    const createBrightnessGradient = (value, lowThreshold, mediumThreshold, highThreshold) => {
        let colorStops = [];

        if (value < lowThreshold) {
            colorStops = ['darkblue', 'blue'];
        } else if (value >= lowThreshold && value <= mediumThreshold) {
            colorStops = ['blue', 'yellow'];
        } else if (value >= mediumThreshold && value <= highThreshold) {
            colorStops = ['yellow', 'orange'];
        } else {
            colorStops = ['orange', 'red'];
        }

        return `linear-gradient(to bottom, ${colorStops[0]}, ${colorStops[1]})`;
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Values',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Time',
                },
                maxTicksLimit: 1
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Temperature, Humidity, and Brightness Data',
            },
        },
    };

    return (
        <div className="flex flex-1 flex-col px-20 pt-8">
            <div className=" grid grid-cols-3 auto-fill gap-4 pb-4">
                <div className="flex flex-col items-center gap-2 px-2 py-4 cursor-pointer rounded-xl" style={{ background: createTemperatureGradient(temperature, 13, 25, 35) }}>
                    <Thermometer width={120} height={120} color="white" />
                    <p className={`text-6xl font-bold flex text-white`}>
                        {temperature} <TbTemperatureCelsius />
                    </p>
                    <p className="text-lg text-white">Nhiệt độ</p>
                </div>

                <div className="flex flex-col items-center gap-2 px-2 py-4 cursor-pointer rounded-xl" style={{ background: createHumidityGradient(humidity, 15, 40, 70) }}>
                    <Droplets width={120} height={120} color="white" />
                    <p className={`text-6xl font-bold text-white`}>
                        {humidity} %
                    </p>
                    <p className="text-lg text-white">Độ ẩm</p>
                </div>

                <div className="flex flex-col items-center gap-2 px-2 py-4 cursor-pointer rounded-xl" style={{ background: createBrightnessGradient(brightness, 200, 400, 700) }}>
                    <Sun width={120} height={120} color="white" />
                    <p className={`text-6xl font-bold text-white`}>
                        {brightness} LUX
                    </p>
                    <p className="text-lg text-white">Độ Sáng</p>
                </div>

                {/* <Dust /> */}

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                <div className="lg:col-span-2 gap-4 col-span-1">
                    <Line data={chartData} options={options} />
                </div>
                <div className="flex flex-col gap-4 pb-4 col-span-1">
                    <Control />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;