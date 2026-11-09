'use client';

import { useT } from '../i18n';

export default function ServiceNotice() {
  const t = useT();

  return (
    <main className="page-shell page-inner">
      <section className="section">
        <div className="container narrow">
          <h1>CreatorPilot</h1>
          <p className="form-error" role="alert">
            {t('api_generic_error')}
          </p>
          <p>{t('api_network_error')}</p>
        </div>
      </section>
    </main>
  );
}
