'use client'
import { useState } from 'react';


export default function uploadPage() {
    const [textbooks, setTextbooks] = useState('');

    return (
        <div className='w-screen'>
            <div className='text-center p-10'>
                <h2 className=''>Generate</h2>
            </div>
        </div>
    )
}