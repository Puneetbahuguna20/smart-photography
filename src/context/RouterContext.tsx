import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextType {
  path: string;
  categorySlug: string | null;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  categorySlug: null,
  navigate: () => {},
});

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (window.location.pathname !== to) {
      window.history.pushState({}, '', to);
      setPath(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Parse category slug if URL is /gallery/:slug
  let categorySlug: string | null = null;
  if (path.startsWith('/gallery/')) {
    categorySlug = path.replace(/^\/gallery\/?/, '').split('/')[0] || 'all';
  } else if (path === '/gallery') {
    categorySlug = 'all';
  }

  return (
    <RouterContext.Provider value={{ path, categorySlug, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  return useContext(RouterContext);
}
