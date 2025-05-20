'use client';

import { Github, Instagram, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="px-4">
      <div className="border-border flex w-full flex-col items-center justify-between border-t py-6 md:flex-row gap-6">
        <div className="flex flex-col md:flex-row items-center justify-start md:justify-center gap-4">
          <a href="/terms-and-condition" className="text-xs md:text-sm text-gray-400 transition hover:text-primary">
            {t('components.footer.links.terms-and-conditions')}
          </a>
          <a href="/privacy-policy" className="text-xs md:text-sm text-gray-400 transition hover:text-primary">
            {t('components.footer.links.privacy-policy')}
          </a>
          <a href="/cookies" className="text-xs md:text-sm text-gray-400 transition hover:text-primary">
            {t('components.footer.links.cookies')}
          </a>
        </div>

        <div className="flex justify-center gap-4 md:gap-6">
          <a href="mailto:otabekjon0302@gmail.com" rel="noreferrer" target="_blank" className="group w-8 h-8 flex items-center justify-center border border-primary rounded-lg hover:bg-primary">
            <span className="sr-only">Mail</span>
            <Mail className="size-4 text-primary group-hover:text-white" />
          </a>

          <a href="https://www.instagram.com/otabek_03.02" rel="noreferrer" target="_blank" className="group w-8 h-8 flex items-center justify-center border border-primary rounded-lg hover:bg-primary">
            <span className="sr-only">Instagram</span>
            <Instagram className="size-4 text-primary group-hover:text-white" />
          </a>

          <a href="https://github.com/otabek0302" rel="noreferrer" target="_blank" className="group w-8 h-8 flex items-center justify-center border border-primary rounded-lg hover:bg-primary">
            <span className="sr-only">GitHub</span>
            <Github className="size-4 text-primary group-hover:text-white" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
