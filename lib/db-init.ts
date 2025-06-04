import { getDb, tableExists } from "./db"

// SQLite-compatible schema
const createTablesSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Households table
CREATE TABLE IF NOT EXISTS households (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- User-Household relationship
CREATE TABLE IF NOT EXISTS user_households (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    household_id TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE,
    UNIQUE(user_id, household_id)
);

-- Domains table (groups of tasks)
CREATE TABLE IF NOT EXISTS domains (
    id TEXT PRIMARY KEY,
    household_id TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    details TEXT,
    links TEXT, -- JSON array as text
    screenshots TEXT, -- JSON array as text
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    domain_id TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    title TEXT NOT NULL,
    details TEXT,
    links TEXT, -- JSON array as text
    screenshots TEXT, -- JSON array as text
    due_date TEXT,
    due_time TEXT,
    frequency_type TEXT, -- 'daily', 'weekly', 'monthly', 'yearly', 'custom'
    frequency_interval INTEGER DEFAULT 1,
    is_completed INTEGER DEFAULT 0,
    completed_at TEXT,
    is_snoozed INTEGER DEFAULT 0,
    snoozed_until TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Subtasks table
CREATE TABLE IF NOT EXISTS subtasks (
    id TEXT PRIMARY KEY,
    parent_task_id TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    title TEXT NOT NULL,
    details TEXT,
    links TEXT, -- JSON array as text
    screenshots TEXT, -- JSON array as text
    due_date TEXT,
    due_time TEXT,
    frequency_type TEXT,
    frequency_interval INTEGER DEFAULT 1,
    is_completed INTEGER DEFAULT 0,
    completed_at TEXT,
    is_snoozed INTEGER DEFAULT 0,
    snoozed_until TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Discussion Items table
CREATE TABLE IF NOT EXISTS discussion_items (
    id TEXT PRIMARY KEY,
    household_id TEXT NOT NULL,
    created_by_id TEXT NOT NULL,
    title TEXT NOT NULL,
    details TEXT,
    links TEXT, -- JSON array as text
    screenshots TEXT, -- JSON array as text
    is_resolved INTEGER DEFAULT 0,
    resolved_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Shopping List Items table
CREATE TABLE IF NOT EXISTS shopping_list_items (
    id TEXT PRIMARY KEY,
    household_id TEXT NOT NULL,
    created_by_id TEXT NOT NULL,
    item_name TEXT NOT NULL,
    quantity TEXT,
    notes TEXT,
    is_purchased INTEGER DEFAULT 0,
    purchased_by_id TEXT,
    purchased_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (purchased_by_id) REFERENCES users(id)
);

-- User notification preferences
CREATE TABLE IF NOT EXISTS user_notification_defaults (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    push_notifications INTEGER DEFAULT 1,
    text_notifications INTEGER DEFAULT 0,
    alarm_notifications INTEGER DEFAULT 0,
    reminder_frequency_hours INTEGER DEFAULT 24,
    streak_reminders INTEGER DEFAULT 1,
    partner_thank_you_notifications INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id)
);

-- Task-specific notification preferences
CREATE TABLE IF NOT EXISTS task_notifications (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    push_notifications INTEGER DEFAULT 1,
    text_notifications INTEGER DEFAULT 0,
    alarm_notifications INTEGER DEFAULT 0,
    reminder_frequency_hours INTEGER DEFAULT 24,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    UNIQUE(task_id)
);
`

// Sample data for testing
const sampleDataSQL = `
-- Insert sample users
INSERT OR IGNORE INTO users (id, email, name) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'alice@example.com', 'Alice Johnson'),
    ('550e8400-e29b-41d4-a716-446655440002', 'bob@example.com', 'Bob Smith');

-- Insert sample household
INSERT OR IGNORE INTO households (id, name) VALUES 
    ('550e8400-e29b-41d4-a716-446655440010', 'The Johnson-Smith Family');

-- Link users to household
INSERT OR IGNORE INTO user_households (id, user_id, household_id, role) VALUES 
    ('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'admin'),
    ('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', 'member');

-- Insert sample domains
INSERT OR IGNORE INTO domains (id, household_id, owner_id, name, details) VALUES 
    ('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Kitchen Management', 'All tasks related to kitchen cleaning and maintenance'),
    ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Pet Care', 'Taking care of our dog Max');

-- Insert sample tasks
INSERT OR IGNORE INTO tasks (id, domain_id, owner_id, title, details, due_date, frequency_type, frequency_interval) VALUES 
    ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 'Clean refrigerator', 'Deep clean shelves and drawers', date('now', '+2 days'), 'weekly', 1),
    ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002', 'Walk Max', 'Morning walk around the neighborhood', date('now'), 'daily', 1);

-- Insert sample subtasks
INSERT OR IGNORE INTO subtasks (id, parent_task_id, owner_id, title, details, due_date) VALUES 
    ('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440001', 'Remove all items from fridge', 'Take everything out and check expiration dates', date('now', '+2 days')),
    ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440001', 'Wipe down shelves', 'Use baking soda solution', date('now', '+2 days'));

-- Insert sample discussion item
INSERT OR IGNORE INTO discussion_items (id, household_id, created_by_id, title, details) VALUES 
    ('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Should we get a robot vacuum?', 'I saw a good deal on a Roomba. What do you think?');

-- Insert sample shopping list items
INSERT OR IGNORE INTO shopping_list_items (id, household_id, created_by_id, item_name, quantity) VALUES 
    ('550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Milk', '1 gallon'),
    ('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Dog food', '1 bag');

-- Insert default notification preferences
INSERT OR IGNORE INTO user_notification_defaults (id, user_id, push_notifications, text_notifications, reminder_frequency_hours) VALUES 
    ('550e8400-e29b-41d4-a716-446655440070', '550e8400-e29b-41d4-a716-446655440001', 1, 0, 24),
    ('550e8400-e29b-41d4-a716-446655440071', '550e8400-e29b-41d4-a716-446655440002', 1, 1, 12);
`

// Initialize the database
export async function initializeDatabase() {
  console.log("Initializing database...")
  const db = await getDb()

  // Create tables
  await db.exec(createTablesSQL)
  console.log("Tables created")

  // Check if we need to insert sample data
  const hasUsers = await tableExists("users")
  const userCount = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM users")

  if (hasUsers && userCount && userCount.count === 0) {
    console.log("Inserting sample data...")
    await db.exec(sampleDataSQL)
    console.log("Sample data inserted")
  } else {
    console.log("Sample data already exists")
  }

  console.log("Database initialization complete")
}

// Function to generate a UUID
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
