import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import Providers from '@app/providers';
import AppBootstrapGate from '@app/providers/AppBootstrapGate';
import { router } from '@app/router';

/**
 * App — the root bootstrap component.
 * 
 * Architecture:
 *   <Providers>           ← Theme + Auth + Session contexts
 *     <AppBootstrapGate>  ← BLOCKS router until auth resolves (except /auth/callback)
 *       <RouterProvider>  ← Only mounts after auth is terminal
 *     </AppBootstrapGate>
 *   </Providers>
 * 
 * This ensures authenticated users NEVER see /login or /signup pages,
 * because the router doesn't even mount until we know their auth state.
 * 
 * EXCEPTION: /auth/callback always renders immediately to process OAuth.
 */
function App() {
  useEffect(() => {
    // Handle OAuth redirects in multiple formats
    
    // Case 1: Hash fragment (traditional) - Supabase might use this
    // Format: /#access_token=...
    if (window.location.hash && window.location.hash.includes('access_token=')) {
      if (!window.location.pathname.includes('/auth/callback')) {
        window.location.replace(`/auth/callback${window.location.hash}`);
      }
      return;
    }

    // Case 2: Query string (newer Supabase) - Handle this
    // Format: /?access_token=...
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('access_token')) {
      // Convert query params to hash format that Supabase getSession() expects
      const hash = `#${window.location.search.substring(1)}`;
      if (!window.location.pathname.includes('/auth/callback')) {
        window.location.replace(`/auth/callback${hash}`);
      } else {
        // Already on /auth/callback, but need to convert query to hash
        // so that supabase.auth.getSession() can extract the token
        if (!window.location.hash.includes('access_token')) {
          window.location.replace(`/auth/callback${hash}`);
        }
      }
      return;
    }
  }, []);

  return (
    <Providers>
      <AppBootstrapGate>
        <RouterProvider router={router} />
      </AppBootstrapGate>
    </Providers>
  );
}

export default App;
