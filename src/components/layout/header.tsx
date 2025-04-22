import { SidebarTrigger } from "@/components/ui/sidebar";
import { LanguagesDropdown } from "../custom-ui/languages-dropdown";
import { Switcher } from "../custom-ui/switcher";

const Header = () => {
  return (
    <header className="w-full flex items-center justify-between border-b">
      <div className="w-full flex items-center justify-between gap-2 py-4 px-4">
        <div>
          <SidebarTrigger className="h-9 w-9 border hover:bg-accent hover:text-primary text-primary cursor-pointer" size="icon" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Switcher />
            <LanguagesDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
