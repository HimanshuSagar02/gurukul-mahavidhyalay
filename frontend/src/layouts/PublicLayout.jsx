import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { LoadingScreen } from '../components/LoadingScreen';
import { PublicFooter } from '../components/public/PublicFooter';
import { PublicHeader } from '../components/public/PublicHeader';

export const PublicLayout = () => {
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSite = async () => {
      try {
        const data = await api.get('/public/site');
        setSite(data.site);
      } finally {
        setLoading(false);
      }
    };

    loadSite();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="public-shell">
      <PublicHeader site={site} />
      <main>
        <Outlet context={{ site }} />
      </main>
      <PublicFooter site={site} />
    </div>
  );
};
