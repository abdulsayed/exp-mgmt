import React, { useState, useEffect, useRef } from 'react';
import { expenseSchema } from './data/schemaData';
import { Sidebar } from './components/Sidebar';
import { TableCard } from './components/TableCard';
import { SqlModal } from './components/SqlModal';
import { Login } from './components/Login';
import { BlineInterface } from './components/BlineInterface';
import { generateSQL } from './utils/sqlGenerator';
import { Code2, Info, LogOut } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'schema' | 'allocations'>('schema');
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  const handleTableSelect = (tableName: string) => {
    if (currentView !== 'schema') {
      setCurrentView('schema');
      // Need a small delay to allow DOM to render the schema view before scrolling
      setTimeout(() => {
        const element = document.getElementById(`table-${tableName}`);
        if (element && mainScrollRef.current) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      setActiveTable(tableName);
      const element = document.getElementById(`table-${tableName}`);
      if (element && mainScrollRef.current) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Update active table based on scroll position (only in schema view)
  useEffect(() => {
    if (!isAuthenticated || currentView !== 'schema') return;

    const handleScroll = () => {
      if (!mainScrollRef.current) return;
      
      const scrollPosition = mainScrollRef.current.scrollTop;
      const tableElements = expenseSchema.tables.map(t => ({
        name: t.name,
        element: document.getElementById(`table-${t.name}`)
      }));

      for (let i = tableElements.length - 1; i >= 0; i--) {
        const { name, element } = tableElements[i];
        if (element && element.offsetTop <= scrollPosition + 100) {
          if (activeTable !== name) {
            setActiveTable(name);
          }
          break;
        }
      }
    };

    const scrollContainer = mainScrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [activeTable, isAuthenticated, currentView]);

  const sqlString = React.useMemo(() => generateSQL(expenseSchema), []);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen w-full bg-gray-950 overflow-hidden font-sans">
      <Sidebar 
        schema={expenseSchema} 
        activeTable={activeTable} 
        onTableSelect={handleTableSelect}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-2 text-gray-400">
            <Info className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">
              {currentView === 'schema' 
                ? 'Select a table from the sidebar or click foreign key badges to navigate.'
                : 'Enter resource allocations to generate budget line records.'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {currentView === 'schema' && (
              <button 
                onClick={() => setIsSqlModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
              >
                <Code2 className="w-4 h-4" />
                <span className="hidden sm:inline">Generate SQL</span>
                <span className="sm:hidden">SQL</span>
              </button>
            )}
            <div className="w-px h-6 bg-gray-800 mx-1"></div>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div 
          ref={mainScrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar scroll-smooth"
        >
          {currentView === 'schema' ? (
            <div className="max-w-5xl mx-auto pb-32">
              <div className="mb-12">
                <h1 className="text-3xl font-bold text-gray-100 mb-2">{expenseSchema.name}</h1>
                <p className="text-gray-400 text-lg">Database Schema Documentation</p>
              </div>

              {expenseSchema.tables.map(table => (
                <TableCard 
                  key={table.name} 
                  table={table} 
                  onTableClick={handleTableSelect}
                />
              ))}
            </div>
          ) : (
            <div className="pb-32">
              <BlineInterface />
            </div>
          )}
        </div>
      </main>

      <SqlModal 
        isOpen={isSqlModalOpen} 
        onClose={() => setIsSqlModalOpen(false)} 
        sql={sqlString} 
      />

      {/* Global styles for custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}} />
    </div>
  );
}
