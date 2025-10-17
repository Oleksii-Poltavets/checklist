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
            <header className="w-full h-16 bg-slate-800 border-b border-slate-700 shadow-lg">
                <div className="container mx-auto h-full flex items-center justify-between px-3 sm:px-6">
                    <Link href='/' className="px-2 sm:px-3 py-1 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 flex-shrink-0">
                        <h1 className={`${piedra.className} text-lg sm:text-xl md:text-2xl text-white whitespace-nowrap`}>
                            Checklist
                        </h1>
                    </Link>
                    <NavMenu />
                </div>
            </header>
        </>
    )
}
