"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuthContext } from "@/components/AuthProvider";
import { 
  FirestoreTask, 
  CreateTaskData, 
  UpdateTaskData,
  fetchTodayTasks,
  fetchUserTasks,
  fetchTasks,
  fetchUpcomingTasks,
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  subscribeToTodayTasks,
  subscribeToTasks,
  subscribeToUpcomingTasks
} from "@/firebase/services/taskService";

export interface UseTasksOptions {
  householdId?: string;
  userId?: string;
  realtime?: boolean;
  filterToday?: boolean;
  filterUpcoming?: boolean;
}

export function useFirestoreTasks(options: UseTasksOptions = {}) {
  const { firestoreUser } = useAuthContext();
  const [tasks, setTasks] = useState<FirestoreTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const {
    householdId = "default", // You'll need to get this from user's household
    userId,
    realtime = true,
    filterToday = false,
    filterUpcoming = false
  } = options;

  // Initialize tasks and set up real-time listener
  useEffect(() => {
    if (!firestoreUser) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const initializeTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        let initialTasks: FirestoreTask[] = [];

        console.log("🔍 Debug: Fetching tasks with options:", {
          householdId,
          userId,
          filterToday,
          filterUpcoming,
          today: new Date().toISOString().split('T')[0]
        });

        if (filterToday) {
          initialTasks = await fetchTodayTasks(householdId);
        } else if (filterUpcoming) {
          initialTasks = await fetchUpcomingTasks(householdId);
        } else if (userId) {
          initialTasks = await fetchUserTasks(userId, householdId);
        } else {
          initialTasks = await fetchTasks(householdId);
        }

        console.log("📋 Debug: Fetched tasks:", initialTasks);
        console.log("📋 Debug: Number of tasks:", initialTasks.length);

        setTasks(initialTasks);
        
        // Set completed tasks
        const completedIds = initialTasks
          .filter(task => task.isCompleted)
          .map(task => task.id);
        setCompletedTasks(completedIds);

        // Set up real-time listener if enabled
        if (realtime) {
          console.log("🔄 Debug: Setting up real-time listener");
          if (filterToday) {
            unsubscribe = subscribeToTodayTasks(householdId, (updatedTasks) => {
              console.log("🔄 Debug: Real-time update - today's tasks:", updatedTasks);
              setTasks(updatedTasks);
              const completedIds = updatedTasks
                .filter(task => task.isCompleted)
                .map(task => task.id);
              setCompletedTasks(completedIds);
            });
          } else if (filterUpcoming) {
            unsubscribe = subscribeToUpcomingTasks(householdId, (updatedTasks) => {
              console.log("🔄 Debug: Real-time update - upcoming tasks:", updatedTasks);
              setTasks(updatedTasks);
              const completedIds = updatedTasks
                .filter(task => task.isCompleted)
                .map(task => task.id);
              setCompletedTasks(completedIds);
            });
          } else {
            unsubscribe = subscribeToTasks(householdId, (updatedTasks) => {
              console.log("🔄 Debug: Real-time update - all tasks:", updatedTasks);
              setTasks(updatedTasks);
              const completedIds = updatedTasks
                .filter(task => task.isCompleted)
                .map(task => task.id);
              setCompletedTasks(completedIds);
            }, userId);
          }
        }
      } catch (err) {
        console.error("❌ Debug: Error initializing tasks:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch tasks");
        console.error("Error initializing tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeTasks();

    return () => {
      if (unsubscribe) {
        console.log("🔄 Debug: Cleaning up real-time listener");
        unsubscribe();
      }
    };
  }, [firestoreUser, householdId, userId, realtime, filterToday, filterUpcoming]);

  // Create a new task
  const createNewTask = useCallback(async (taskData: CreateTaskData): Promise<FirestoreTask | null> => {
    try {
      setError(null);
      const newTask = await createTask(taskData, householdId);
      
      // If not using realtime, manually add to state
      if (!realtime) {
        setTasks(prev => [newTask, ...prev]);
      }
      
      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create task";
      setError(errorMessage);
      console.error("Error creating task:", err);
      return null;
    }
  }, [householdId, realtime]);

  // Update a task
  const updateExistingTask = useCallback(async (taskId: string, updateData: UpdateTaskData): Promise<FirestoreTask | null> => {
    try {
      setError(null);
      const updatedTask = await updateTask(taskId, updateData);
      
      // If not using realtime, manually update state
      if (!realtime) {
        setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
      }
      
      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update task";
      setError(errorMessage);
      console.error("Error updating task:", err);
      return null;
    }
  }, [realtime]);

  // Toggle task completion
  const toggleTask = useCallback(async (taskId: string): Promise<boolean> => {
    try {
      setError(null);
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error("Task not found");
      }

      const isCompleted = !task.isCompleted;
      await toggleTaskCompletion(taskId, isCompleted);
      
      // If not using realtime, manually update state
      if (!realtime) {
        setCompletedTasks(prev => {
          if (isCompleted) {
            return [...prev, taskId];
          } else {
            return prev.filter(id => id !== taskId);
          }
        });
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to toggle task";
      setError(errorMessage);
      console.error("Error toggling task:", err);
      return false;
    }
  }, [tasks, realtime]);

  // Delete a task
  const deleteExistingTask = useCallback(async (taskId: string): Promise<boolean> => {
    try {
      setError(null);
      await deleteTask(taskId);
      
      // If not using realtime, manually remove from state
      if (!realtime) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        setCompletedTasks(prev => prev.filter(id => id !== taskId));
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete task";
      setError(errorMessage);
      console.error("Error deleting task:", err);
      return false;
    }
  }, [realtime]);

  // Get filtered tasks based on completion status
  const activeTasks = tasks.filter(task => !task.isCompleted);
  const completedTasksList = tasks.filter(task => task.isCompleted);

  // Group tasks by time (for daily view)
  const groupedTasks = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();

    const earlierToday: FirestoreTask[] = [];
    const upNext: FirestoreTask[] = [];
    const anytime: FirestoreTask[] = [];

    activeTasks.forEach((task) => {
      if (!task.dueTime) {
        anytime.push(task);
        return;
      }

      const timeMatch = task.dueTime.match(/(\d+):(\d+)/);
      if (!timeMatch) {
        anytime.push(task);
        return;
      }

      const hour = Number.parseInt(timeMatch[1]);
      const taskHour = hour;

      if (taskHour < currentHour) {
        earlierToday.push(task);
      } else {
        upNext.push(task);
      }
    });

    const sortByTime = (a: FirestoreTask, b: FirestoreTask) => {
      if (!a.dueTime || !b.dueTime) return 0;
      return a.dueTime.localeCompare(b.dueTime);
    };

    return {
      earlierToday: earlierToday.sort(sortByTime),
      upNext: upNext.sort(sortByTime),
      anytime: anytime,
      completed: completedTasksList,
    };
  }, [activeTasks, completedTasksList]);

  return {
    // State
    tasks,
    loading,
    error,
    completedTasks,
    
    // Grouped tasks
    groupedTasks,
    activeTasks,
    completedTasksList,
    
    // Actions
    createTask: createNewTask,
    updateTask: updateExistingTask,
    toggleTask,
    deleteTask: deleteExistingTask,
    
    // Utilities
    clearError: () => setError(null),
  };
} 