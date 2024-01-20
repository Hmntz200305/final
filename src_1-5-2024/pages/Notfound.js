import React from 'react'
import { Alert } from "@material-tailwind/react";

const Lwi = () => {

    const Icon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
        </svg>
    )

    return (
        <>
            <div className='p-2'>
                <div className='bg-gray-800 mb-5 rounded-2xl p-4 shadow'>
                    <h2 className='text-white'>Page not found :(</h2>
                </div>
            </div>

            <div>
                <Alert icon={Icon} variant='outlined'>
                    <div className='flex items-baseline space-x-2'>
                        <p className='text-lg'>*FYI</p>
                        <p className='text-sm'>Aplikasi ini didevelop oleh anak PKL jurusan SIJA 47 dari SMKN 1 Cimahi xixixi</p>
                    </div>
                </Alert>
            </div>
        </>
    )
}
export default Lwi