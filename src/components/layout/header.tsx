'use client';

import Image from 'next/image';

import { LanguagesDropdown } from '@/components/ui/languages-dropdown';
import { Switcher } from '@/components/ui/switcher';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { logo } from '@/assets';
import { usePathname } from 'next/navigation';
import { HeaderActions } from '../ui/header-actions';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="z-50 px-4">
      <div className="border-border flex items-center justify-between gap-2 border-b py-2.5">
        <div className="flex items-center justify-center">
          {!pathname.includes('/admin') ? (
            <div className="relative h-12 w-12 rounded-full">
              <Image src={logo} alt="logo" fill className="object-cover object-center" />
            </div>
          ) : (
            <SidebarTrigger className="hover:bg-accent hover:text-primary text-primary z-50 h-9 w-9 cursor-pointer border" size="icon" />
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <Switcher />
          <LanguagesDropdown />
          <HeaderActions />
        </div>
      </div>
    </header>
  );
};

export default Header;
