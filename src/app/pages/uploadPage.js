import { useState } from 'react';


function generatePage() {
    const [textbooks, setTextbooks] = useState('');
    const [chapters, setChapters] = useState('');
    const [duration, setDuration] = useState('');
    const [result, setResult] = useState('');
    const [lessonName, setLessonName] = useState('');
    const [examplePlans, setExamplePlans] = useState<File | null>(null);
    const [showButton, setShowButton] = useState(false);

    const handleSubmit = async () => {
        console.log('handleSubmit called');
        console.log(examplePlans);
        const formData = new FormData();
        
        if (examplePlans) {
            formData.append('file', examplePlans);  // file
            console.log('examples added');
        }
        formData.append('textbooks', JSON.stringify(textbooks));
        formData.append('chapters', JSON.stringify(chapters));
        formData.append('duration', JSON.stringify(duration));
        formData.append('title', JSON.stringify(lessonName));
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        const res = await fetch('http://localhost:3001/generate', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        setResult(data.response.choices[0].message.content); 
        console.log("API Response:", data);
        console.log(result);

        setShowButton(true);
    }

    const savePlan = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error('not logged in');

        try {
            const docRef = await addDoc(collection(db, 'users', uid, 'lessonPlans'), {
                lessonPlanName: lessonName,
                lessonPlan: result
            });
            console.log('Lesson plan added with ID: ', docRef.id);
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    }

  return (
    <>
        <div className= 'w-screen'>
            <div id='title' className='text-center'>
                    <h1>Textbook to Lesson Plan</h1>
                    <p className='text-[var(--text-main)]'>Create a custom lesson plan using your desired textbooks</p>
            </div>
            <form className='h-190 mx-auto w-full max-w-xl space-y-8 divide-y
                                text-left shadow divide-slate-200/5 bg-slate-800 sm:overflow-hidden sm:rounded-md'>
                <div className='space-y-8 divide-y px-4 py-5 divide-slate-200/5 sm:p-6'>
                    <div>
                        <label>Select .docx file</label>
                        <input type='file' 
                            accept='.docx' 
                            className='file:border file:border-black file:rounded
                                        text-[rgba(202,200,200,0.633)] file:bg-[#4d4fba42]'
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setExamplePlans(e.target.files[0]);
                                } else {
                                    setExamplePlans(null);
                                }
                            }}
                        />
                    </div>
                    <div>
                        <label id='label'>textbooks (Links or Names)</label>
                        <textarea
                            placeholder = "Example: https://apsubjects.weebly.com/uploads/2/0/5/3/20538716/petersons_master_ap_calculus.pdf"
                            onChange={(e) => setTextbooks(e.target.value)}>
                        </textarea>
                    </div>
                    <div>
                        <label id='label'>desired chapter/section names</label>
                        <textarea 
                            placeholder = "Example: Implicit Differentiation"
                            onChange={(e) => setChapters(e.target.value)}>
                        </textarea>
                    </div>
                    <div>
                        <label id='label'>Desired duration of lesson (hours)</label>
                        <input 
                            type='number' 
                            placeholder='Example: 1'
                            onChange={(e) => setDuration(e.target.value)}>
                        </input>
                    </div>
                    <div>
                        <label id='label'>Lesson Name</label>
                        <textarea 
                            placeholder = "Example: Calc 1 class 1"
                            onChange={(e) => setLessonName(e.target.value)}>
                        </textarea>
                    </div>
                    <div className="flex items-center justify-center text-[var(--text-main)]">
                        <button type ='button' onClick={handleSubmit}>
                            Generate Lesson Plan
                        </button>
                    </div>
                </div> 
            </form>
            
            <div>
                <h2 className='mt-10 mb-3 text-center text-[var(--text-main)]
                                font-bold'>
                                Output:
                </h2>
            </div>
            <div className='mx-auto w-full max-w-xl space-y-8 divide-y divide-gray-200 bg-white 
                                text-left shadow dark:divide-slate-200/5 dark:bg-slate-800 sm:overflow-hidden sm:rounded-md'>
                <div className='m-5 text-[var(--text-main)]'>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                </div>
                
                <div className='text-center'>
                    {showButton && (
                        <button type='button' onClick={savePlan}>Save Lesson Plan</button>
                    )}
                </div>           
            </div>
        </div>
    </>
  )
}

export default generatePage;

