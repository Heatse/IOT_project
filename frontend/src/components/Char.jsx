import Chart from "chart.js/auto";
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

const ChartControl = () => {

    const chartData = {
        labels: Data.map((data) => data.time), // Convert 'year' to string
        datasets: [
            {
                label: "Temperature",
                data: Data.map((data) => data.temperature),
                backgroundColor: [
                    "rgba(0, 255, 0, 1)"
                ],
                borderColor: 'rgba(0, 255, 0, 1)',
                borderWidth: 2,
            },
            {
                label: "Humidity",
                data: Data.map((data) => data.humidity),
                backgroundColor: [
                    "rgba(0, 255, 255, 1)"
                ],
                borderColor: "rgba(0, 255, 255, 1)",
                borderWidth: 2,
            },
            {
                label: "Brighness",
                data: Data.map((data) => data.brightness),
                backgroundColor: [
                    "rgba(255, 255, 0, 1)"
                ],
                borderColor: "rgba(255, 255, 0, 1)",
                borderWidth: 2,
            },
        ],
    }



    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Values",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Time",
                },
            },
        },
    };

    return (
        <Line data={chartData} options={options} />
    );
};

export default ChartControl;