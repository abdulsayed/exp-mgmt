import React from 'react';
import { Table, Column } from '../types';
import { Key, Link as LinkIcon, Hash, Type, AlignLeft, Calendar, ToggleLeft, List } from 'lucide-react';

interface TableCardProps {
  table: Table;
  onTableClick: (tableName: string) => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'UUID': return <Hash className="w-4 h-4 text-purple-400" />;
    case 'VARCHAR':
    case 'TEXT': return <Type className="w-4 h-4 text-green-400" />;
    case 'INT':
    case 'DECIMAL': return <Hash className="w-4 h-4 text-blue-400" />;
    case 'DATE':
    case 'TIMESTAMP': return <Calendar className="w-4 h-4 text-yellow-400" />;
    case 'BOOLEAN': return <ToggleLeft className="w-4 h-4 text-red-400" />;
    case 'ENUM': return <List className="w-4 h-4 text-orange-400" />;
    default: return <AlignLeft className="w-4 h-4 text-gray-400" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'UUID': return 'text-purple-400';
    case 'VARCHAR':
    case 'TEXT': return 'text-green-400';
    case 'INT':
    case 'DECIMAL': return 'text-blue-400';
    case 'DATE':
    case 'TIMESTAMP': return 'text-yellow-400';
    case 'BOOLEAN': return 'text-red-400';
    case 'ENUM': return 'text-orange-400';
    default: return 'text-gray-400';
  }
};

export const TableCard: React.FC<TableCardProps> = ({ table, onTableClick }) => {
  return (
    <div id={`table-${table.name}`} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg mb-8 scroll-mt-24 transition-all hover:border-gray-700">
      <div className="bg-gray-850 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            {table.name}
          </h2>
          <p className="text-sm text-gray-400 mt-1">{table.description}</p>
        </div>
        <div className="text-xs font-mono text-gray-500 bg-gray-950 px-2 py-1 rounded">
          {table.columns.length} columns
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950/50 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 font-medium">Column</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Attributes</th>
              <th className="px-6 py-3 font-medium">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {table.columns.map((col: Column, idx: number) => (
              <tr key={idx} className="hover:bg-gray-800/30 transition-colors group">
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {col.isPrimaryKey && <Key className="w-4 h-4 text-yellow-500" title="Primary Key" />}
                    {col.foreignKey && <LinkIcon className="w-4 h-4 text-blue-400" title="Foreign Key" />}
                    {!col.isPrimaryKey && !col.foreignKey && <div className="w-4 h-4" />}
                    <span className={`font-mono font-medium ${col.isPrimaryKey ? 'text-yellow-100' : 'text-gray-200'}`}>
                      {col.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    {getTypeIcon(col.type)}
                    <span className={getTypeColor(col.type)}>
                      {col.type}
                      {col.length && `(${col.length})`}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="flex gap-2 text-xs font-mono">
                    {col.isPrimaryKey && <span className="px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">PK</span>}
                    {col.foreignKey && (
                      <button 
                        onClick={() => onTableClick(col.foreignKey!.table)}
                        className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                        title={`References ${col.foreignKey.table}.${col.foreignKey.column}`}
                      >
                        FK &rarr; {col.foreignKey.table}
                      </button>
                    )}
                    {!col.isNullable && !col.isPrimaryKey && <span className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">NOT NULL</span>}
                    {col.isUnique && <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">UNIQUE</span>}
                  </div>
                </td>
                <td className="px-6 py-3 text-gray-400 text-sm max-w-md truncate group-hover:whitespace-normal group-hover:break-words transition-all">
                  {col.description || <span className="text-gray-600 italic">No description</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
