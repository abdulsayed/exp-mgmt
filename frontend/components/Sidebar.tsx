import React from 'react';
import { Schema } from '../types';
import { Database, Table as TableIcon, Search, LayoutDashboard, PlusCircle } from 'lucide-react';

interface SidebarProps {
  schema: Schema;
  activeTable: string | null;
  onTableSelect: (tableName: string) => void;
  currentView: 'schema' | 'allocations';
  onViewChange: (view: 'schema' | 'allocations') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  schema, 
  activeTable, 
  onTableSelect,
  currentView,
  onViewChange
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTables = schema.tables.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Database className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="font-bold text-gray-100 leading-tight">Expense App</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => onViewChange('schema')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentView === 'schema'
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Schema Explorer
          </button>
          <button
            onClick={() => onViewChange('allocations')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentView === 'allocations'
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200 border border-transparent'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Allocation Entry
          </button>
        </div>
      </div>

      {currentView === 'schema' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search tables..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-md py-2 pl-9 pr-3 text-sm text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              Tables ({filteredTables.length})
            </div>
            {filteredTables.map(table => (
              <button
                key={table.name}
                onClick={() => onTableSelect(table.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                  activeTable === table.name 
                    ? 'bg-gray-800 text-gray-200 font-medium' 
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-300'
                }`}
              >
                <TableIcon className={`w-4 h-4 ${activeTable === table.name ? 'text-gray-300' : 'text-gray-500'}`} />
                <span className="truncate">{table.name}</span>
              </button>
            ))}
            {filteredTables.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-4">
                No tables found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
