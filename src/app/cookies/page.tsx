'use client';

import { useTranslation } from 'react-i18next';

const Cookies = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{t('cookies.title')}</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('cookies.sections.what.title')}</h2>
          <p className="mb-4">{t('cookies.sections.what.content')}</p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('cookies.sections.types.title')}</h2>
          <p className="mb-4">{t('cookies.sections.types.subtitle')}</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>{t('cookies.sections.types.items.essential')}</li>
            <li>{t('cookies.sections.types.items.functional')}</li>
            <li>{t('cookies.sections.types.items.analytics')}</li>
            <li>{t('cookies.sections.types.items.marketing')}</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('cookies.sections.usage.title')}</h2>
          <p className="mb-4">{t('cookies.sections.usage.subtitle')}</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>{t('cookies.sections.usage.items.authentication')}</li>
            <li>{t('cookies.sections.usage.items.preferences')}</li>
            <li>{t('cookies.sections.usage.items.security')}</li>
            <li>{t('cookies.sections.usage.items.analytics')}</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('cookies.sections.management.title')}</h2>
          <p className="mb-4">{t('cookies.sections.management.content')}</p>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{t('cookies.sections.management.browser.title')}</h3>
            <p>{t('cookies.sections.management.browser.content')}</p>
            
            <h3 className="text-xl font-semibold">{t('cookies.sections.management.third-party.title')}</h3>
            <p>{t('cookies.sections.management.third-party.content')}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cookies;
