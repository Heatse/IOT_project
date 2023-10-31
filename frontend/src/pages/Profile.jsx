import React from 'react'
import { AiOutlineUser } from 'react-icons/ai'

function Profile() {
    return (

        <div className='flex flex-1 px-4'>
            <div className=' flex-1 flex items-center justify-center p-4 py-40 border-gray-300 '>
                <img src='/assets/icon.jpg' alt='' className='w-72 h-72 mx-auto bg-gray-300 rounded-full flex items-center justify-center' />
            </div>
            <div className='flex-1 flex-col items-center py-40'>
                <div>
                    <p className="text-4xl font-bold text-blue-800 mt-1 text-center">Mã SV: </p>
                    <p className="text-6xl font-semibold text-red-500 text-center">B20DCCN583</p>
                </div>
                <div className="py-20 px-8">
                    <p>
                        <span className="text-4xl font-bold">Họ và tên: </span>
                        <span className="text-4xl text-blue-800 font-bold">Trần Hoàng Sơn</span>
                    </p>
                    <p>
                        <span className="text-4xl font-bold">Sinh ngày: </span>
                        <span className="text-4xl text-blue-800 font-bold ">13/12/2002</span>
                    </p>
                    <p>
                        <span className="text-4xl font-bold">Quê quán: </span>
                        <span className="text-4xl text-blue-800 font-bold">Hải Dương</span>
                    </p>
                    <p>
                        <span className="text-4xl font-bold">Ngành: </span>
                        <span className="text-4xl text-blue-800 font-bold">Công nghệ thông tin</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Profile
