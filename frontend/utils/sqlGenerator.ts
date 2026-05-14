import { Schema, Table, Column } from '../types';

export const generateSQL = (schema: Schema): string => {
  let sql = `-- Schema: ${schema.name} (v${schema.version})\n`;
  sql += `-- Generated automatically\n\n`;

  schema.tables.forEach((table: Table) => {
    sql += `CREATE TABLE ${table.name} (\n`;
    
    const columnDefs = table.columns.map((col: Column) => {
      let def = `  ${col.name} ${col.type}`;
      
      if (col.length) {
        if (col.type === 'DECIMAL') {
           def += `(${col.length}, 2)`; // Assuming standard 2 decimal places for currency
        } else {
           def += `(${col.length})`;
        }
      }
      
      if (col.isPrimaryKey) def += ' PRIMARY KEY';
      if (col.isUnique && !col.isPrimaryKey) def += ' UNIQUE';
      if (!col.isNullable && !col.isPrimaryKey) def += ' NOT NULL';
      if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`;
      
      return def;
    });

    // Add foreign key constraints at the end of the table definition
    const fkDefs = table.columns
      .filter(col => col.foreignKey)
      .map(col => `  FOREIGN KEY (${col.name}) REFERENCES ${col.foreignKey!.table}(${col.foreignKey!.column})`);

    const allDefs = [...columnDefs, ...fkDefs];
    
    sql += allDefs.join(',\n');
    sql += `\n);\n\n`;
  });

  return sql;
};
