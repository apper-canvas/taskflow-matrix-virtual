import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import { getIcon } from '../utils/iconUtils';

const Home = ({ darkMode, setDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Get icons as components
  const MenuIcon = getIcon('Menu');
  const XIcon = getIcon('X');
  const SunIcon = getIcon('Sun');
  const MoonIcon = getIcon('Moon');
  const CheckSquareIcon = getIcon('CheckSquare');
  const ListTodoIcon = getIcon('ListTodo');
  const CalendarIcon = getIcon('Calendar');
  const TagIcon = getIcon('Tag');
  const FolderIcon = getIcon('Folder');
  const ChartIcon = getIcon('BarChart');
  const SettingsIcon = getIcon('Settings');
  
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.info(`${!darkMode ? 'Dark' : 'Light'} mode activated`, {
      icon: !darkMode ? "🌙" : "☀️"
    });
  };
  
  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900 md:hidden">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        
        <div className="flex items-center gap-2">
          <CheckSquareIcon className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">TaskFlow</span>
        </div>
        
        <button
          onClick={handleToggleDarkMode}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>
      </header>
      
      {/* Sidebar for mobile (overlay) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-900 shadow-lg"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <CheckSquareIcon className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">TaskFlow</span>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-3">
                <a href="#" className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 dark:bg-gray-800 dark:text-white">
                  <ListTodoIcon className="h-5 w-5" />
                  <span>Tasks</span>
                </a>
                <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  <CalendarIcon className="h-5 w-5" />
                  <span>Calendar</span>
                </a>
                <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  <TagIcon className="h-5 w-5" />
                  <span>Tags</span>
                </a>
                <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  <FolderIcon className="h-5 w-5" />
                  <span>Projects</span>
                </a>
                <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  <ChartIcon className="h-5 w-5" />
                  <span>Analytics</span>
                </a>
                <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  <SettingsIcon className="h-5 w-5" />
                  <span>Settings</span>
                </a>
              </nav>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Desktop sidebar */}
      <div className="hidden border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-800">
          <CheckSquareIcon className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">TaskFlow</span>
        </div>
        
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-3 py-4">
            <a href="#" className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 dark:bg-gray-800 dark:text-white">
              <ListTodoIcon className="h-5 w-5" />
              <span>Tasks</span>
            </a>
            <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              <CalendarIcon className="h-5 w-5" />
              <span>Calendar</span>
            </a>
            <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              <TagIcon className="h-5 w-5" />
              <span>Tags</span>
            </a>
            <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              <FolderIcon className="h-5 w-5" />
              <span>Projects</span>
            </a>
            <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              <ChartIcon className="h-5 w-5" />
              <span>Analytics</span>
            </a>
            <a href="#" className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              <SettingsIcon className="h-5 w-5" />
              <span>Settings</span>
            </a>
          </nav>
          
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <button
              onClick={handleToggleDarkMode}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {darkMode ? (
                <>
                  <SunIcon className="h-5 w-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <MoonIcon className="h-5 w-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="md:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 hidden md:flex md:items-center md:justify-between">
            <h1 className="text-2xl font-bold md:text-3xl">My Tasks</h1>
            <button
              onClick={handleToggleDarkMode}
              className="md:inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <>
                  <SunIcon className="h-4 w-4" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <MoonIcon className="h-4 w-4" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
          
          <div className="mb-4 block md:hidden">
            <h1 className="text-2xl font-bold">My Tasks</h1>
          </div>
          
          <MainFeature />
        </div>
      </main>
    </div>
  );
};

export default Home;