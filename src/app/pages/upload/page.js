'use client'
import { React, useState } from 'react';
import '../../styles/upload.css'
import '../../styles/globals.css'

export default function UploadPage() {
    const [file, setFile] = useState(null);

    return (
        <div className='min-h-screen w-screen bg-slate-900'>
            <div className='text-center p-10'>
                <h2 className='text-3xl text-white'>Upload your notes or example questions</h2>
            </div>

            <div className='mx-auto w-full max-w-xl text-left shadow-lg space-y-8 divide-y
                            divide-slate-200/5 bg-slate-800 sm:overflow-hidden sm:rounded-md'>
                <div className=' px-4 py-5 divide-slate-200/5 sm:p-6'>
                    <div>
                        <label className='block text-white mb-2'>Select file</label>
                        <input 
                            type='file' 
                            accept='.docx,.pdf'
                            onChange={(e) => {if (e.target.files && e.target.files.length > 0) {
                                setFile(e.target.files[0]);
                            }}}
                            className='block w-full text-white file:mr-4 file:py-2 file:px-4
                                     file:border file:border-slate-600 file:rounded
                                     file:bg-slate-700 file:text-white hover:file:bg-slate-600'
                        />
                    </div>
                    <div>
                        <label className='block text-white mb-2'>Upload</label>
                        <button>Upload</button>
                    </div>
                </div>
            </div>
        </div>
    )
}