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

      <main className="flex-1 max-w-375 mx-auto w-full mb-10 mt-5 md:mt-19">
        <Outlet />
      </main>
      <footer>
        <Footer/>
      </footer>
    </div>
  );
};


export default MainLayout;