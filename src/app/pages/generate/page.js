'use client'
import { useState } from 'react';
import '../../styles/generate.css'


export default function uploadPage() {
    const [textbooks, setTextbooks] = useState('');

    return (
        <div className='min-h-screen w-screen bg-black'>
            <div className='text-center p-10'>
                <h2 className='text-3xl text-white'>Generate practice questions</h2>
            </div>

            <div className='mx-auto w-full max-w-xl text-left shadow-lg space-y-8 divide-y
                            divide-slate-200/5 bg-slate-900 sm:overflow-hidden sm:rounded-md'>
                    <div>
                        <label id='label'>desired questions topic</label>
                        <textarea 
                            placeholder = "Example: Implicit Differentiation"
                            onChange={(e) => setChapters(e.target.value)}>
                        </textarea>
                    </div>
                    <div>
                        <label className='block text-white mb-2'>Upload</label>
                        <button>Generate</button>
                    </div>
            </div>
        </div>
    )
}