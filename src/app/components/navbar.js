'use client'
import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";

export default function navigationBar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`bg-white min-h-screen transition-all duration-500
                        ${isOpen? 'w-60' : 'w-20'}`}>
            <div className='divide-y divide-black space-y-5'>
                <div className='p-4 flex justify-center items-end'>
                    <Image src='/user.svg'
                            width={20}
                            height={20}
                            alt='User'>
                    </Image>
                </div>
                
                <div className={`flex p-4 ${isOpen? 'justify-end' : 'justify-center'}`}>
                    <Image src='/menu-burger.svg'
                            alt='Expand/close navigation bar'
                            width={20}
                            height={20}
                            onClick={() => {isOpen? setIsOpen(false) : setIsOpen(true)}}>
                    </Image>
                </div>

                <div className='flex justify-center text-black'>
                    <Link href='/pages/upload'>Upload Notes/Questions</Link>
                </div>
                <div className='flex justify-center text-black'>
                    <Link href='/pages/generate'>Generate questions</Link>
                </div>
                <div className='flex justify-center text-black'>
                    <Link href='/'>home</Link>
                </div>
            </div>
            
        </div>
    )
}