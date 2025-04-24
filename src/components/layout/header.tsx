"use client";

import Image from "next/image";

import { LanguagesDropdown } from "@/components/ui/languages-dropdown";
import { Switcher } from "@/components/ui/switcher";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { logo } from "@/assets";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="px-4">
      <div className="flex items-center justify-between gap-2 py-2.5 border-b border-border">
        <div className="flex items-center justify-center">
          {!pathname.includes("/admin") ? (
            <div className="relative w-12 h-12 rounded-full">
              <Image src={logo} alt="logo" fill className="object-cover object-center" />
            </div>
          ) : (
            <SidebarTrigger className="h-9 w-9 border hover:bg-accent hover:text-primary text-primary cursor-pointer" size="icon" />
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <Switcher />
          <LanguagesDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
