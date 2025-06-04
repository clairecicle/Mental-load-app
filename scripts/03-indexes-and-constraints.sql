-- Indexes for performance optimization

-- User lookups
CREATE INDEX idx_users_email ON users(email);

-- Household-related queries
CREATE INDEX idx_user_households_user_id ON user_households(user_id);
CREATE INDEX idx_user_households_household_id ON user_households(household_id);

-- Domain queries
CREATE INDEX idx_domains_household_id ON domains(household_id);
CREATE INDEX idx_domains_owner_id ON domains(owner_id);

-- Task queries (most frequently accessed)
CREATE INDEX idx_tasks_domain_id ON tasks(domain_id);
CREATE INDEX idx_tasks_owner_id ON tasks(owner_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_completed ON tasks(is_completed);
CREATE INDEX idx_tasks_snoozed ON tasks(is_snoozed);

-- Subtask queries
CREATE INDEX idx_subtasks_parent_task_id ON subtasks(parent_task_id);
CREATE INDEX idx_subtasks_owner_id ON subtasks(owner_id);
CREATE INDEX idx_subtasks_due_date ON subtasks(due_date);

-- Discussion items
CREATE INDEX idx_discussion_items_household_id ON discussion_items(household_id);
CREATE INDEX idx_discussion_items_created_by ON discussion_items(created_by_id);

-- Shopping list
CREATE INDEX idx_shopping_list_household_id ON shopping_list_items(household_id);
CREATE INDEX idx_shopping_list_purchased ON shopping_list_items(is_purchased);

-- Conversion tracking
CREATE INDEX idx_conversions_source ON item_conversions(source_type, source_id);
CREATE INDEX idx_conversions_target ON item_conversions(target_type, target_id);

-- Add check constraints
ALTER TABLE tasks ADD CONSTRAINT check_frequency_type 
    CHECK (frequency_type IN ('daily', 'weekly', 'monthly', 'yearly', 'custom', NULL));

ALTER TABLE subtasks ADD CONSTRAINT check_subtask_frequency_type 
    CHECK (frequency_type IN ('daily', 'weekly', 'monthly', 'yearly', 'custom', NULL));

ALTER TABLE item_conversions ADD CONSTRAINT check_conversion_types
    CHECK (source_type IN ('task', 'subtask', 'discussion_item') 
           AND target_type IN ('task', 'subtask', 'discussion_item')
           AND conversion_type IN ('cut_paste', 'copy_paste'));
