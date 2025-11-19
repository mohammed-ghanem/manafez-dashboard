"use client"

import Link from 'next/link'
import { Home, Settings } from "lucide-react"
import LangUseParams from '@/translate/LangUseParams';
import { useRouter } from 'next/navigation';
import TranslateHook from '@/translate/TranslateHook';

const SideBar = () => {
    const lang = LangUseParams();
    const translate = TranslateHook();
    const router = useRouter();
    return (
        <div>
            <aside className="w-60 text-white flex flex-col">
                <div className="p-4 font-bold text-lg mainColor">My Dashboard</div>
                <nav className="flex-1">
                    <ul className="space-y-2 p-2">
                        <li>
                            <Link href={`/${lang}`}
                                className="flex items-center font-semibold
                                gap-2 p-2 rounded bkMainColor hover-mainColor">
                                <Home size={18} /> 
                                { translate?.sidebar.dashboard || "Dashboard"}
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${lang}/roles`}
                                className="flex items-center
                                 gap-2 p-2 rounded font-semibold scoundColor hover-mainColor">
                                <Settings size={18} /> 
                                { translate?.sidebar.roles || "Roles"}
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/settings"
                                className="flex items-center
                                 gap-2 p-2 rounded font-semibold scoundColor hover-mainColor">
                                <Settings size={18} /> Settings
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/settings"
                                className="flex items-center
                                 gap-2 p-2 rounded font-semibold scoundColor hover-mainColor">
                                <Settings size={18} /> Settings
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/settings"
                                className="flex items-center
                                 gap-2 p-2 rounded font-semibold scoundColor hover-mainColor">
                                <Settings size={18} /> Settings
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    )
}

export default SideBar