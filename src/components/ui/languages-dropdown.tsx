"use client";

import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { US, UZ, RU } from "country-flag-icons/react/3x2";

export const LanguagesDropdown = () => {
  const { i18n } = useTranslation();

  const handleChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem("i18nextLng", language);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="cursor-pointer">
          <Globe className="text-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-1 mt-1 flex flex-col gap-2 border-none shadow-none">
        <Button variant="outline" size="icon" className="cursor-pointer" onClick={() => handleChange("en")}>
          <US />
        </Button>
        <Button variant="outline" size="icon" className="cursor-pointer" onClick={() => handleChange("uz")}>
          <UZ />
        </Button>
        <Button variant="outline" size="icon" className="cursor-pointer" onClick={() => handleChange("ru")}>
          <RU />
        </Button>
      </PopoverContent>
    </Popover>
  );
};