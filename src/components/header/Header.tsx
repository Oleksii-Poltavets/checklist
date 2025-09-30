import NavMenu from './Nav';
import Image from 'next/image';
import { Piedra } from "next/font/google";
import Link from 'next/link';

const piedra = Piedra({
    subsets: ["latin"],
    weight: "400",
});

export default function Header() {
    return (
        <>
            <header className="w-full h-16 bg-gray-100 dark:bg-gray-900 shadow">
                <div className="container mx-auto h-full flex items-center px-6">
                    <Link href='/' className="px-3 py-1 bg-[#0088FF] rounded-lg">
                        <h1 className={`${piedra.className} text-2xl text-[#FFFF00]`}>
                            Checklist
                        </h1>
                    </Link>
                    <NavMenu />
                </div>
            </header>
        </>
    )
}
