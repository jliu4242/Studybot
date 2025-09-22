'use client'
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";

export default function navigationBar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`bg-rgba(255,255,255,0.05) min-h-screen transition-all duration-500
                        ${isOpen? 'w-40' : 'w-20'}`}>
            <div className='divide-y divide-white space-y-5'>
                <div className='p-4 flex justify-center items-end'>
                    <Image src='/user.svg'
                            width={20}
                            height={20}
                            className='nav-icon'
                            alt='User'>
                    </Image>
                </div>
                
                
                <div className='flex items-center w-full pb-4 justify-center'>
                    <div className={`flex`}>
                        <Image src='/menu-burger.svg'
                                alt='Expand/close navigation bar'
                                className='nav-icon'
                                width={20}
                                height={20}
                                onClick={() => {isOpen? setIsOpen(false) : setIsOpen(true)}}>
                        </Image>
                    </div>
                </div>

                <div className='flex justify-center text-white pb-5'>
                    <Link href='/pages/upload'>
                        {isOpen ? 
                            <figure className='flex justify-center'>
                                <Image src='/upload.svg'
                                        alt='upload files'
                                        width={20}
                                        height={20}
                                        className='nav-icon'/>
                                <figcaption className='caption'>
                                    Upload
                                </figcaption>
                            </figure>
                            : 
                            <Image src='/upload.svg'
                                        alt='upload files'
                                        width={20}
                                        height={20}
                                        className='nav-icon'/>
                            }
                    </Link>
                </div>
                <div className='flex justify-center text-white pb-5'>
                    <Link href='/pages/generate'>
                        {isOpen ? 
                            <figure className='flex justify-center'>
                                <Image src='/generate.svg'
                                        alt='generate questions'
                                        width={20}
                                        height={20}
                                        className='nav-icon'/>
                                <figcaption className='caption'>
                                    Generate
                                </figcaption>
                            </figure>
                            : 
                            <Image src='/generate.svg'
                                    alt='generate questions'
                                    width={20}
                                    height={20}
                                    className='nav-icon'/>}
                    </Link>
                </div>
                <div className='flex justify-center text-white pb-5'>
                    <Link href='/pages/exams'>
                        {isOpen ? 
                            <figure className='flex justify-center'>
                                <Image src='/exam.svg'
                                        alt='upload and generate exams'
                                        width={20}
                                        height={20}
                                        className='nav-icon'/>
                                <figcaption className='caption'>
                                    Exam
                                </figcaption>
                            </figure>
                            : 
                            <Image src='/exam.svg'
                                    alt='upload and generate exams'
                                    width={20}
                                    height={20}
                                    className='nav-icon'/>}
                    </Link>
                </div>
                <div className='flex justify-center text-white'>
                    <Link href='/'>
                        {isOpen ? 
                            <figure className='flex justify-center'>
                                <Image src='/home.svg'
                                        alt='home'
                                        width={20}
                                        height={20}
                                        className='nav-icon'/>
                                <figcaption className='caption'>
                                    Home
                                </figcaption>
                            </figure> 
                            : 
                            <Image src='/home.svg'
                                    alt='home page'
                                    width={20}
                                    height={20}
                                    className='nav-icon'>
                            </Image>}
                    </Link>
                </div>
            </div>
            
        </div>
    )
}