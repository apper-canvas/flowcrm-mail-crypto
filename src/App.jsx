import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import ContactsPage from "@/components/pages/ContactsPage";
import DealsPage from "@/components/pages/DealsPage";
import CompaniesPage from "@/components/pages/CompaniesPage";
import AnalyticsPage from "@/components/pages/AnalyticsPage";

function App() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMobileSidebarOpen(true);
  };

  const handleCloseMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar 
          isOpen={isMobileSidebarOpen} 
          onClose={handleCloseMobileSidebar} 
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1">
            <Routes>
              <Route 
                path="/" 
                element={<ContactsPage onMenuClick={handleMenuClick} />} 
              />
              <Route 
                path="/deals" 
                element={<DealsPage onMenuClick={handleMenuClick} />} 
              />
              <Route 
                path="/companies" 
                element={<CompaniesPage onMenuClick={handleMenuClick} />} 
              />
              <Route 
                path="/analytics" 
                element={<AnalyticsPage onMenuClick={handleMenuClick} />} 
              />
            </Routes>
          </main>
        </div>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;