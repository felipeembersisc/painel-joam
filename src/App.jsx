// routing
import Routes from '@/routes';

// project imports
import Locales from '@/ui-component/Locales';
import NavigationScroll from '@/layout/NavigationScroll';
import RTLLayout from '@/ui-component/RTLLayout';
import Snackbar from '@/ui-component/extended/Snackbar';
import { ToastContainer } from 'react-toastify';

import ThemeCustomization from '@/themes';
import 'react-toastify/dist/ReactToastify.css';

// auth provider
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadProvider } from './hooks/useLoad';

// ==============================|| APP ||============================== //

const App = () => {
    return (
        <ThemeCustomization>
            <RTLLayout>
                <Locales>
                    <NavigationScroll>
                     <LoadProvider>
                        <AuthProvider>
                           <>
                              <Routes />
                              <Snackbar />
                              <ToastContainer />
                           </>
                        </AuthProvider>
                     </LoadProvider>
                    </NavigationScroll>
                </Locales>
            </RTLLayout>
        </ThemeCustomization>
    );
};

export default App;
