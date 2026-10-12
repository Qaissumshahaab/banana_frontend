import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Premium from './pages/Premium';
import TopPictures from './pages/TopPictures';
import AccountsSearch from './pages/AccountsSearch';
import CreateAccount from './pages/CreateAccount';
import AccountGallery from './pages/AccountGallery';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-banana-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/top" element={<TopPictures />} />
            <Route path="/accounts" element={<AccountsSearch />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/g/:slug" element={<AccountGallery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
