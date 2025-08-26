import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CookieConsent from '../ui/CookieConsent';
import JoinUsModal from '../ui/JoinUsModal';
import { useState } from 'react';
import { FoodFusionSidebar } from './FoodFusionSidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function Layout() {
  const [showJoinUsModal, setShowJoinUsModal] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        {/* Mobile Header - only visible on mobile */}
        <div className="md:hidden">
          <Header onJoinUsClick={() => setShowJoinUsModal(true)} />
        </div>
        
        {/* Desktop Layout with Sidebar */}
        <div className="hidden md:flex flex-1">
          <FoodFusionSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-white">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage>FoodFusion</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex-1 flex flex-col">
              <main className="flex-1 p-6">
                <Outlet />
              </main>
            </div>
          </SidebarInset>
        </div>
        
        {/* Mobile Layout without Sidebar */}
        <div className="md:hidden">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
        
        <Footer />
        
        <CookieConsent />
        <JoinUsModal 
          isOpen={showJoinUsModal} 
          onClose={() => setShowJoinUsModal(false)} 
        />
      </div>
    </SidebarProvider>
  );
}
