import React from 'react'
import Temperature from './temperature'
import Humidity from './humidity'
import Brightness from './brightness'
import Ledcontrol from '../components/ledcontrol'
import Fancontrol from '../components/fancontrol'
import Chart from '../components/Char'


function Dashboard() {
    return (
        <div className="flex flex-1 flex-col px-20 pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                <Temperature />
                <Humidity />
                <Brightness />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                <div className="lg:col-span-2 gap-4 col-span-1">
                    <Chart />
                </div>
                <div className="flex flex-col gap-4 pb-4 col-span-1">
                    <Ledcontrol />
                    <Fancontrol />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
