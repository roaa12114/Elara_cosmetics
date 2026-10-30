import { BrowserRouter } from 'react-router-dom';
import { Providers } from './app/providers';
import { AppRouter } from './app/router';
import { ScrollToTop } from './app/ScrollToTop';

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <ScrollToTop />
        <AppRouter />
      </BrowserRouter>
    </Providers>
  );
}