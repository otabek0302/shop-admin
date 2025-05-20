'use client';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{t('privacy-policy.title')}</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('privacy-policy.sections.introduction.title')}</h2>
          <p className="mb-4">{t('privacy-policy.sections.introduction.content')}</p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('privacy-policy.sections.information.title')}</h2>
          <p className="mb-4">{t('privacy-policy.sections.information.subtitle')}</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>{t('privacy-policy.sections.information.items.name')}</li>
            <li>{t('privacy-policy.sections.information.items.credentials')}</li>
            <li>{t('privacy-policy.sections.information.items.payment')}</li>
            <li>{t('privacy-policy.sections.information.items.preferences')}</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('privacy-policy.sections.usage.title')}</h2>
          <p className="mb-4">{t('privacy-policy.sections.usage.subtitle')}</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>{t('privacy-policy.sections.usage.items.services')}</li>
            <li>{t('privacy-policy.sections.usage.items.transactions')}</li>
            <li>{t('privacy-policy.sections.usage.items.notices')}</li>
            <li>{t('privacy-policy.sections.usage.items.communication')}</li>
            <li>{t('privacy-policy.sections.usage.items.improvement')}</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('privacy-policy.sections.security.title')}</h2>
          <p className="mb-4">{t('privacy-policy.sections.security.content')}</p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">{t('privacy-policy.sections.rights.title')}</h2>
          <p className="mb-4">{t('privacy-policy.sections.rights.subtitle')}</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>{t('privacy-policy.sections.rights.items.access')}</li>
            <li>{t('privacy-policy.sections.rights.items.correct')}</li>
            <li>{t('privacy-policy.sections.rights.items.delete')}</li>
            <li>{t('privacy-policy.sections.rights.items.object')}</li>
            <li>{t('privacy-policy.sections.rights.items.portability')}</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
