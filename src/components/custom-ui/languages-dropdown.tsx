import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { US, UZ, RU } from "country-flag-icons/react/3x2";

export const LanguagesDropdown = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="cursor-pointer">
          <Globe className="text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-1 mt-1 flex flex-col gap-2 border-none shadow-none">
        <Button variant="outline" size="icon" iconSize="md" className="cursor-pointer">
          <US />
        </Button>
        <Button variant="outline" size="icon" iconSize="md" className="cursor-pointer">
          <UZ />
        </Button>
        <Button variant="outline" size="icon" iconSize="md" className="cursor-pointer">
          <RU />
        </Button>
      </PopoverContent>
    </Popover>
  );
};