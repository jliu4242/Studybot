'use client'
import '../../styles/globals.css'
import '../../styles/upload.css'

export default function examsPage() {

    return (
        <div className='min-h-screen w-screen bg-black'>
            <div className='text-center p-10 title'>
                <h2 className='text-3xl text-white'>Upload an exam and generate a new one</h2>
            </div>

            <div className='mx-auto w-full max-w-xl text-left main-card
                            sm:overflow-hidden sm:rounded-md p-10'>
                <div>
                    <label className='block text-white mb-2'>Select .pdf file</label>
                    <input 
                        type='file' 
                        accept='.pdf'
                        onChange={(e) => {if (e.target.files && e.target.files.length > 0) {
                            setFile(e.target.files[0]);
                        }}}
                        className='block w-full text-white file:mr-4 file:py-2 file:px-4
                                    file:border file:border-slate-600 file:rounded
                                    file:bg-[#1a1a1a] file:text-white hover:file:bg-slate-600'
                    />
                </div>

                <div>
                    <button onClick=''>Generate</button>
                </div>
            </div>
        </div>
    )
}