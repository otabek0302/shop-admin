"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";

export const Switcher = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button variant="outline" size="icon" className="shadow-none cursor-pointer" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {theme === "dark" ? <Sun className="text-primary" /> : <Moon className="text-primary" />}
    </Button>
  );
};
