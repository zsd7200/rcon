'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney, faBars, faXmark, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { AnimatePresence } from 'motion/react';
import * as motion from 'motion/react-client';

export default function Header() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const changeTheme = () => {
    if (resolvedTheme === 'light') {
      return setTheme('dark');
    }

    return setTheme('light');
  }

  const hamburgerHandler = () => {
    setShowMenu(!showMenu);
  }

  return (
    <>
      <header className="flex w-full justify-between px-[30px] my-[13px]">
        <div className="flex items-center gap-[30px]">
          <div title="Menu" className="flex justify-center h-[25px] w-[25px]">
            <button onClick={hamburgerHandler} className="hover:cursor-pointer">
              <FontAwesomeIcon icon={(showMenu) ? faXmark : faBars} className="h-[25px] hover:text-[#98C767] active:text-[#7FA656] transition"/>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-600 dark:text-gray-100 select-none">RCON Web GUI</h1>
        </div>
        <nav className="flex">
          <ul className="flex gap-[15px] justify-end items-center text-gray-600 dark:text-gray-100">
            <li title="Home" className="flex justify-center h-[25px] w-[25px]">
              <Link href="/">
                <FontAwesomeIcon icon={faHouseChimney} className="h-[25px] hover:text-[#98C767] active:text-[#7FA656] transition"/>
              </Link>
            </li>
            <li title="Change Theme" className="flex justify-center h-[25px] w-[25px]">
              <button onClick={changeTheme} className="hover:cursor-pointer">
                <FontAwesomeIcon icon={(resolvedTheme === 'light') ? faMoon : faSun} className="h-[25px] hover:text-[#98C767] active:text-[#7FA656] transition"/>
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700" />
      <AnimatePresence>
        {showMenu && 
          <div className="absolute -mt-8">
            <motion.div
              initial={{ left: '-100%' }}
              animate={{ left: 0 }}
              exit={{ left: '-100%' }}
              style={{ position: 'relative' }}
              key="sidebar"
            >
              <Sidebar />
            </motion.div>
          </div>
        }
      </AnimatePresence>
    </>
  );
}