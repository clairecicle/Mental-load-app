-- Notification preferences tables

-- User default notification preferences
CREATE TABLE user_notification_defaults (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    push_notifications BOOLEAN DEFAULT TRUE,
    text_notifications BOOLEAN DEFAULT FALSE,
    alarm_notifications BOOLEAN DEFAULT FALSE,
    reminder_frequency_hours INTEGER DEFAULT 24, -- hours before due date
    streak_reminders BOOLEAN DEFAULT TRUE,
    partner_thank_you_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Task-specific notification preferences
CREATE TABLE task_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    push_notifications BOOLEAN DEFAULT TRUE,
    text_notifications BOOLEAN DEFAULT FALSE,
    alarm_notifications BOOLEAN DEFAULT FALSE,
    reminder_frequency_hours INTEGER DEFAULT 24,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(task_id)
);

-- Subtask-specific notification preferences
CREATE TABLE subtask_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subtask_id UUID NOT NULL REFERENCES subtasks(id) ON DELETE CASCADE,
    push_notifications BOOLEAN DEFAULT TRUE,
    text_notifications BOOLEAN DEFAULT FALSE,
    alarm_notifications BOOLEAN DEFAULT FALSE,
    reminder_frequency_hours INTEGER DEFAULT 24,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(subtask_id)
);
