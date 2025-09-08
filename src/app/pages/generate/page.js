'use client'
import { useState } from 'react';
import '../../styles/generate.css'
import '../../styles/globals.css'


export default function uploadPage() {
    const [prompt, setPrompt] = useState('');

    async function generateQuestions() {
        const res = await fetch("http://127.0.0.1:8000/generate-questions", {
            method: "POST",
            body: prompt,
        });

        const data = await res.json();
        console.log(data);
    }

    return (
        <div className='min-h-screen w-screen bg-black'>
            <div className='text-center p-10'>
                <h2 className='text-3xl text-white'>Generate practice questions</h2>
            </div>

            <div className='mx-auto w-full max-w-xl text-left shadow-lg space-y-8 divide-y
                            divide-slate-200/5 bg-slate-900 sm:overflow-hidden sm:rounded-md p-10'>
                    <div>
                        <label id='label'>desired questions topic</label>
                        <textarea 
                            placeholder = "Example: Implicit Differentiation"
                            onChange={(e) => setPrompt(e.target.value)}>
                        </textarea>
                    </div>
                    <div>
                        <button onClick={generateQuestions}>Generate</button>
                    </div>
            </div>
        </div>
    )
}