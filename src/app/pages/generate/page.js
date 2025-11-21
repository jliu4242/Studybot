'use client'
import { useState } from 'react';
import '../../styles/generate.css'
import '../../styles/globals.css'
import ReactMarkdown from "react-markdown";


export default function uploadPage() {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [answerVisiblity, setAnswerVisiblity] = useState(false);

    async function generateQuestions() {
        const res = await fetch("http://127.0.0.1:8000/generate-questions", {
            method: "POST",
            body: prompt,
        });

        const data = await res.json();
        console.log(data.res);
        setResult(data.res); 
        setAnswerVisiblity(true);
    }

    async function handleSave() {
        // do something
    }

    return (
        <div className='min-h-screen w-screen bg-black'>
            <div className='text-center p-10 title'>
                <h2 className='text-3xl text-white'>Generate practice questions</h2>
            </div>

            <div className='mx-auto w-full max-w-xl text-left main-card
                            sm:overflow-hidden sm:rounded-md p-10'>
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

            {answerVisiblity &&
                <div className='mx-auto w-full max-w-xl text-left sm-rounded-md p-10 main-card m-10 items-center'>
                    <div className='whitespace-pre-wrap leading-relaxed'>
                        {result}
                    </div>
                    <button className='flex w-20' onClick={handleSave}>
                        Save
                    </button>
                </div>
            }
        </div>
    )
}