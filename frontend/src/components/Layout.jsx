import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Toast from './Toast';

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <main className="flex-grow max-w-[1500px] w-full mx-auto">
        <Outlet />
      </main>
      <Footer />
      <Toast />
    </div>
  );
};

export default Layout;
