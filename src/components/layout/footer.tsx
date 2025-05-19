"use client"

import { Github, Instagram, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="px-4">
      <div className="py-6 w-full flex items-center justify-between border-t border-border">
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#" className="text-gray-400 text-sm transition hover:opacity-75">
            {t("components.footer.links.terms-and-conditions")}
          </a>
          <a href="#" className="text-gray-400 text-sm transition hover:opacity-75">
            {t("components.footer.links.privacy-policy")}
          </a>
          <a href="#" className="text-gray-400 text-sm transition hover:opacity-75">
            {t("components.footer.links.cookies")}
          </a>
        </div>

        <div className="flex justify-center gap-6">
          <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:opacity-75">
            <span className="sr-only">Mail</span>
            <Mail className="size-5 text-gray-400" />
          </a>

          <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:opacity-75">
            <span className="sr-only">Instagram</span>
            <Instagram className="size-5 text-gray-400" />
          </a>

          <a href="#" rel="noreferrer" target="_blank" className="text-gray-700 transition hover:opacity-75">
            <span className="sr-only">GitHub</span>
            <Github className="size-5 text-gray-400" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
