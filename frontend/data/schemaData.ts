import { Schema } from '../types';

export const expenseSchema: Schema = {
  name: "Corporate Expense Management",
  version: "1.1.0",
  tables: [
    {
      name: "locations",
      description: "Geographical locations for offices or regions, used for currency and rate determination.",
      columns: [
        { name: "id", type: "UUID", isPrimaryKey: true, description: "Unique identifier for the location" },
        { name: "name", type: "VARCHAR", length: 100, isNullable: false, description: "Name of the location (e.g., 'New York HQ')" },
        { name: "country_code", type: "VARCHAR", length: 2, isNullable: false, description: "ISO 3166-1 alpha-2 country code" },
        { name: "currency_code", type: "VARCHAR", length: 3, isNullable: false, description: "ISO 4217 currency code (e.g., 'USD', 'EUR')" },
        { name: "created_at", type: "TIMESTAMP", defaultValue: "CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "users",
      description: "Employees and contractors who can submit or approve expenses.",
      columns: [
        { name: "id", type: "UUID", isPrimaryKey: true, description: "Unique identifier for the user" },
        { name: "email", type: "VARCHAR", length: 255, isNullable: false, isUnique: true, description: "User's corporate email address" },
        { name: "first_name", type: "VARCHAR", length: 50, isNullable: false },
        { name: "last_name", type: "VARCHAR", length: 50, isNullable: false },
        { name: "role", type: "ENUM", description: "System role: 'EMPLOYEE', 'MANAGER', 'ADMIN', 'FINANCE'" },
        { name: "location_id", type: "UUID", isNullable: false, foreignKey: { table: "locations", column: "id" }, description: "User's primary working location" },
        { name: "manager_id", type: "UUID", isNullable: true, foreignKey: { table: "users", column: "id" }, description: "Direct supervisor for default approval routing" },
        { name: "is_active", type: "BOOLEAN", defaultValue: "true" },
        { name: "created_at", type: "TIMESTAMP", defaultValue: "CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "projects",
      description: "Cost centers or specific initiatives that budgets and expenses are tied to.",
      columns: [
        { name: "id", type: "UUID", isPrimaryKey: true },
        { name: "project_code", type: "VARCHAR", length: 20, isNullable: false, isUnique: true, description: "Internal accounting code" },
        { name: "name", type: "VARCHAR", length: 255, isNullable: false },
        { name: "description", type: "TEXT", isNullable: true },
        { name: "status", type: "ENUM", description: "'PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED'" },
        { name: "owner_id", type: "UUID", isNullable: false, foreignKey: { table: "users", column: "id" }, description: "Project sponsor or main owner" },
        { name: "start_date", type: "DATE", isNullable: true },
        { name: "end_date", type: "DATE", isNullable: true },
        { name: "created_at", type: "TIMESTAMP", defaultValue: "CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "rates",
      description: "Standardized billing or cost rates for different roles in different locations.",
      columns: [
        { name: "id", type: "UUID", isPrimaryKey: true },
        { name: "role_title", type: "VARCHAR", length: 100, isNullable: false, description: "e.g., 'Senior Engineer', 'Consultant'" },
        { name: "location_id", type: "UUID", isNullable: false, foreignKey: { table: "locations", column: "id" } },
        { name: "hourly_rate", type: "DECIMAL", length: 10, description: "Standard hourly cost rate" },
        { name: "effective_from", type: "DATE", isNullable: false },
        { name: "effective_to", type: "DATE", isNullable: true }
      ]
    },
    {
      name: "headcount_resources",
      description: "Allocation of users to specific projects, often used for forecasting headcount costs.",
      columns: [
        { name: "id", type: "UUID", isPrimaryKey: true },
        { name: "project_id", type: "UUID", isNullable: false, foreignKey: { table: "projects", column: "id" } },
        { name: "user_id", type: "UUID", isNullable: false, foreignKey: { table: "users", column: "id" } },
        { name: "rate_id", type: "UUID", isNullable: true, foreignKey: { table: "rates", column: "id" }, description: "Specific rate applied for this allocation" },
        { name: "allocation_percentage", type: "INT", isNullable: false, description: "0-100 representing time dedicated to project" },
        { name: "start_date", type: "DATE", isNullable: false },
        { name: "end_date", type: "DATE", isNullable: true }
      ]
    },
    {
      name: "budget_lines",
      description: "Allocated funds for specific categories within a project.",
      columns: [
        { name: "id", type: "UUID", isPrimaryKey: true },
        { name: "project_id", type: "UUID", isNullable: false, foreignKey: { table: "projects", column: "id" } },
        { name: "category", type: "VARCHAR", length: 50, isNullable: false, description: "e.g., 'TRAVEL', 'SOFTWARE', 'HARDWARE', 'CONTRACTORS'" },
        { name: "fiscal_year", type: "INT", isNullable: false },
        { name: "allocated_amount", type: "DECIMAL", length: 15, isNullable: false },
        { name: "currency_code", type: "VARCHAR", length: 3, isNullable: false },
        { name: "notes", type: "TEXT", isNullable: true },
        { name: "created_at", type: "TIMESTAMP", defaultValue: "CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "budget_line_allocations",
      description: "Granular time-based (weekly/monthly) allocations for a specific budget line and resource.",
      columns: [
        { name: "id", type: "UUID", isPrimaryKey: true },
        { name: "budget_line_id", type: "UUID", isNullable: false, foreignKey: { table: "budget_lines", column: "id" } },
        { name: "resource_name", type: "VARCHAR", length: 255, isNullable: false, description: "Name of the resource or vendor" },
        { name: "period_type", type: "ENUM", description: "'WEEKLY', 'MONTHLY'" },
        { name: "period_start_date", type: "DATE", isNullable: false },
        { name: "period_end_date", type: "DATE", isNullable: false },
        { name: "allocated_amount", type: "DECIMAL", length: 15, isNullable: false, description: "Dollar value allocated for this specific period" },
        { name: "currency_code", type: "VARCHAR", length: 3, defaultValue: "'USD'" },
        { name: "created_at", type: "TIMESTAMP", defaultValue: "CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "usage_lines",
      description: "Actual incurred expenses or forecasted usage drawing down from budget lines.",
      columns: [
        { name: "id", type: "UUID", isPrimaryKey: true },
        { name: "project_id", type: "UUID", isNullable: false, foreignKey: { table: "projects", column: "id" } },
        { name: "budget_line_id", type: "UUID", isNullable: true, foreignKey: { table: "budget_lines", column: "id" }, description: "Optional link to specific budget bucket" },
        { name: "submitter_id", type: "UUID", isNullable: false, foreignKey: { table: "users", column: "id" } },
        { name: "expense_date", type: "DATE", isNullable: false },
        { name: "amount", type: "DECIMAL", length: 15, isNullable: false },
        { name: "currency_code", type: "VARCHAR", length: 3, isNullable: false },
        { name: "exchange_rate", type: "DECIMAL", length: 10, defaultValue: "1.0", description: "Rate to base currency at time of expense" },
        { name: "description", type: "TEXT", isNullable: false },
        { name: "receipt_url", type: "VARCHAR", length: 500, isNullable: true },
        { name: "status", type: "ENUM", description: "'DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID'" },
        { name: "created_at", type: "TIMESTAMP", defaultValue: "CURRENT_TIMESTAMP" }
      ]
    },
    {
      name: "approval_workflows",
      description: "Tracks the routing and status of approvals for usage lines.",
      columns: [
        { name: "id", type: "UUID", isPrimaryKey: true },
        { name: "usage_line_id", type: "UUID", isNullable: false, foreignKey: { table: "usage_lines", column: "id" } },
        { name: "approver_id", type: "UUID", isNullable: false, foreignKey: { table: "users", column: "id" } },
        { name: "step_order", type: "INT", isNullable: false, description: "Sequence of approval (1, 2, 3...)" },
        { name: "status", type: "ENUM", description: "'PENDING', 'APPROVED', 'REJECTED', 'SKIPPED'" },
        { name: "comments", type: "TEXT", isNullable: true },
        { name: "assigned_at", type: "TIMESTAMP", defaultValue: "CURRENT_TIMESTAMP" },
        { name: "resolved_at", type: "TIMESTAMP", isNullable: true }
      ]
    }
  ]
};
