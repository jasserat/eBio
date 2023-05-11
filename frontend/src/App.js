// routes
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import { ChartStyle } from './components/chart';
import ScrollToTop from './components/ScrollToTop';
import { ProgressBarStyle } from './components/ProgressBar';
import NotistackProvider from './components/NotistackProvider';
import ThemeColorPresets from './components/ThemeColorPresets';
import ThemeLocalization from './components/ThemeLocalization';
import MotionLazyContainer from './components/animate/MotionLazyContainer';
import { UserApi } from './actions/userAction';
import { addUser } from './redux/slices/userSlice';

// ----------------------------------------------------------------------

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      console.log('refresh Token');
      UserApi.getUserById(localStorage.getItem('token').replace(/^"|"$/g, ''))
        .then((r) => {
          dispatch(addUser(r));
        })
        .catch(() => {
          localStorage.removeItem('token');
          // eslint-disable-next-line no-restricted-globals
          // location.reload();
        });
    }
  }, []);
  return (
    <ThemeProvider>
      <ThemeColorPresets>
        <ThemeLocalization>
          <RtlLayout>
            <NotistackProvider>
              <MotionLazyContainer>
                <ProgressBarStyle />
                <ChartStyle />
                <Settings />
                <ScrollToTop />
                <Router />
              </MotionLazyContainer>
            </NotistackProvider>
          </RtlLayout>
        </ThemeLocalization>
      </ThemeColorPresets>
    </ThemeProvider>
  );
}
