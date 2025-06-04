-- Sample data for testing

-- Insert sample users
INSERT INTO users (id, email, name) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'alice@example.com', 'Alice Johnson'),
    ('550e8400-e29b-41d4-a716-446655440002', 'bob@example.com', 'Bob Smith');

-- Insert sample household
INSERT INTO households (id, name) VALUES 
    ('550e8400-e29b-41d4-a716-446655440010', 'The Johnson-Smith Family');

-- Link users to household
INSERT INTO user_households (user_id, household_id, role) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'admin'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', 'member');

-- Insert sample domains
INSERT INTO domains (id, household_id, owner_id, name, details) VALUES 
    ('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Kitchen Management', 'All tasks related to kitchen cleaning and maintenance'),
    ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Pet Care', 'Taking care of our dog Max');

-- Insert sample tasks
INSERT INTO tasks (id, domain_id, owner_id, title, details, due_date, frequency_type, frequency_interval) VALUES 
    ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 'Clean refrigerator', 'Deep clean shelves and drawers', CURRENT_DATE + INTERVAL '2 days', 'weekly', 1),
    ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002', 'Walk Max', 'Morning walk around the neighborhood', CURRENT_DATE, 'daily', 1);

-- Insert sample subtasks
INSERT INTO subtasks (parent_task_id, owner_id, title, details, due_date) VALUES 
    ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440001', 'Remove all items from fridge', 'Take everything out and check expiration dates', CURRENT_DATE + INTERVAL '2 days'),
    ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440001', 'Wipe down shelves', 'Use baking soda solution', CURRENT_DATE + INTERVAL '2 days');

-- Insert sample discussion item
INSERT INTO discussion_items (household_id, created_by_id, title, details) VALUES 
    ('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Should we get a robot vacuum?', 'I saw a good deal on a Roomba. What do you think?');

-- Insert sample shopping list items
INSERT INTO shopping_list_items (household_id, created_by_id, item_name, quantity) VALUES 
    ('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Milk', '1 gallon'),
    ('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Dog food', '1 bag');

-- Insert default notification preferences
INSERT INTO user_notification_defaults (user_id, push_notifications, text_notifications, reminder_frequency_hours) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', TRUE, FALSE, 24),
    ('550e8400-e29b-41d4-a716-446655440002', TRUE, TRUE, 12);
