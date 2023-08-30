import { lazy } from 'react';

// project imports
import Loadable from '@/ui-component/Loadable';

// login option 1 routing
const AuthLogin = Loadable(lazy(() => import('../views/authentication')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
   children: [
      {
         path: '/login',
         element: <AuthLogin />
      },
      {
         path: '/login/:hashUser',
         element: <AuthLogin />
      }
   ]
};

export default AuthenticationRoutes;
