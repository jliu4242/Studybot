'use client'
import { useState } from 'react';
import Image from "next/image";

export default function navigationBar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`bg-gray-500 min-h-screen transition-all duration-500
                        ${isOpen? 'w-20' : 'w-60'}`}>
            <div className={`flex p-4 ${isOpen? 'justify-center' : 'justify-end'}`}>
                <Image src='/menu-burger.svg'
                        alt='Expand/close navigation bar'
                        width={20}
                        height={20}
                        onClick={() => {isOpen? setIsOpen(false) : setIsOpen(true)}}>
                    
                </Image>
            </div>
            
        </div>
    )
}