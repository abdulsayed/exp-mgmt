export type DataType = 
  | 'UUID' 
  | 'VARCHAR' 
  | 'TEXT'
  | 'INT' 
  | 'DECIMAL' 
  | 'DATE' 
  | 'TIMESTAMP' 
  | 'BOOLEAN' 
  | 'ENUM';

export interface ForeignKey {
  table: string;
  column: string;
}

export interface Column {
  name: string;
  type: DataType;
  length?: number;
  isPrimaryKey?: boolean;
  isNullable?: boolean;
  isUnique?: boolean;
  foreignKey?: ForeignKey;
  description?: string;
  defaultValue?: string;
}

export interface Table {
  name: string;
  description: string;
  columns: Column[];
}

export interface Schema {
  name: string;
  version: string;
  tables: Table[];
}
