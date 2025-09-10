'use client'
import { React, useState } from 'react';
import '../../styles/upload.css'
import '../../styles/globals.css'

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [uploadType, setUploadType] = useState('');

    async function uploadNotes() {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://127.0.0.1:8000/upload-notes", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log(data);
    }

    return (
        <div className='min-h-screen container'>
            <div className='text-center p-10 title'>
                <h2 className='text-3xl text-white'>Upload your notes or example questions</h2>
            </div>

            <div className='mx-auto w-full max-w-xl text-left
                            sm:overflow-hidden sm:rounded-md'>
                <div className=' px-4 py-5 divide-slate-200/5 sm:p-6 main-card'>
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
                                     file:bg-[#1a1a1a] file:text-white hover:file:bg-slate-600'
                        />
                    </div>
                    <div>
                        <label>Upload Type:</label>
                        <select id='Upload Type' name='Upload Type' className='text-white select-bg-black border border-white rounded'>
                            <option value="Notes">Notes</option>
                            <option value="Example Questions">Example Questions</option>
                        </select>
                    </div>
                    <div>
                        <button onClick={uploadNotes}>Upload</button>
                    </div>
                </div>
            </div>
        </div>
    )
}