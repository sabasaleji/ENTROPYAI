import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Products from './pages/Products';
import Blogs from './pages/Blogs';
import Contact from './pages/Contact';
import OurStory from './pages/OurStory';
import Newsletter from './pages/Newsletter';
import MyAccount from './pages/MyAccount';
import { AuthProvider } from './contexts/AuthContext';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-entropy-500/20 selection:text-entropy-900 flex flex-col">
        <HashRouter>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/products" element={<Products />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/account" element={<MyAccount />} />
            </Routes>
          </main>
          <Footer />
        </HashRouter>
      </div>
    </AuthProvider>
  );
};

export default App;