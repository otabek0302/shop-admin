'use client';

import { useTranslation } from 'react-i18next';

const TermsAndConditions = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{t('terms.title')}</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('terms.sections.agreement.title')}</h2>
          <p className="mb-4">{t('terms.sections.agreement.content')}</p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('terms.sections.license.title')}</h2>
          <p className="mb-4">{t('terms.sections.license.content')}</p>
          <p className="mb-4">{t('terms.sections.license.subtitle')}</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>{t('terms.sections.license.items.modify')}</li>
            <li>{t('terms.sections.license.items.commercial')}</li>
            <li>{t('terms.sections.license.items.reverse')}</li>
            <li>{t('terms.sections.license.items.copyright')}</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('terms.sections.account.title')}</h2>
          <p className="mb-4">{t('terms.sections.account.content')}</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>{t('terms.sections.account.items.security')}</li>
            <li>{t('terms.sections.account.items.accuracy')}</li>
            <li>{t('terms.sections.account.items.notify')}</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('terms.sections.disclaimer.title')}</h2>
          <p className="mb-4">{t('terms.sections.disclaimer.content')}</p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('terms.sections.limitations.title')}</h2>
          <p className="mb-4">{t('terms.sections.limitations.content')}</p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('terms.sections.revisions.title')}</h2>
          <p className="mb-4">{t('terms.sections.revisions.content')}</p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('terms.sections.links.title')}</h2>
          <p className="mb-4">{t('terms.sections.links.content')}</p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('terms.sections.modifications.title')}</h2>
          <p className="mb-4">{t('terms.sections.modifications.content')}</p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('terms.sections.law.title')}</h2>
          <p className="mb-4">{t('terms.sections.law.content')}</p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
