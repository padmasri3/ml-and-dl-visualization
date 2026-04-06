import { useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { AppProvider, useApp } from "@/context/AppContext";
import SidebarTree from "@/components/SidebarTree";
import AlgorithmPage from "@/components/AlgorithmPage";

function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useApp();
  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      aria-label="Toggle theme"
    >
      {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function MobileSidebarToggle() {
  const { sidebarOpen, setSidebarOpen } = useApp();
  return (
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground md:hidden"
      aria-label="Toggle sidebar"
    >
      {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
    </button>
  );
}

function Layout() {
  const { sidebarOpen } = useApp();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 fixed md:static inset-y-0 left-0 z-30
          w-72 bg-sidebar border-r border-sidebar-border
          transition-transform duration-200 ease-in-out
          flex flex-col
        `}
      >
        <SidebarTree />
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={() => {}}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 flex items-center justify-between px-4 border-b border-border shrink-0">
          <MobileSidebarToggle />
          <div className="flex-1" />
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <AlgorithmPage />
        </main>
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}
