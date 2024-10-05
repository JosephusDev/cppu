import { BrowserRouter } from 'react-router-dom';
import { AppThemeProvider, DrawerProvider, Auth } from './shared/contexts';
import { MenuLateral } from './shared/components';
import { AppRoutes } from './routes';
import Login from './shared/components/login/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const App = () => {
  return (    
    <BrowserRouter>
      <Auth>
        <AppThemeProvider>
          <Login>
              <DrawerProvider>
                    <MenuLateral>
                      <AppRoutes />
                    </MenuLateral>
              </DrawerProvider>
          </Login>
        </AppThemeProvider>
        <ToastContainer />
      </Auth>
    </BrowserRouter>
  );
};
