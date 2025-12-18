import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import Home from './pages/Home';
import Services from './pages/Services';
import Products from './pages/Products';
import Blogs from './pages/Blogs';
import Contact from './pages/Contact';
import OurStory from './pages/OurStory';
import MyAccount from './pages/MyAccount';
import { AuthProvider } from './contexts/AuthContext';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-brand-dark text-brand-text overflow-x-hidden selection:bg-brand-primary/30 selection:text-white flex flex-col">
        <ParticleBackground />
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