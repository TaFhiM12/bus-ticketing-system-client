import React from 'react';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router';
import Footer from './components/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <Navbar />
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};


export default MainLayout;