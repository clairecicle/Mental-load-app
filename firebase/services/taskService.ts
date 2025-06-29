import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { db } from "@/firebase/config";

export interface FirestoreTask {
  id: string;
  title: string;
  details?: string;
  domainId: string;
  domainName: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  dueDate?: string;
  dueTime?: string;
  frequencyType?: string;
  frequencyInterval?: number;
  isCompleted: boolean;
  completedAt?: Date;
  isSnoozed: boolean;
  snoozedUntil?: Date;
  emoji: string;
  subtasksCount: number;
  isOverdue?: boolean;
  isRecurring?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskData {
  title: string;
  details?: string;
  domainId: string;
  domainName: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  dueDate?: string;
  dueTime?: string;
  frequencyType?: string;
  frequencyInterval?: number;
  emoji: string;
}

export interface UpdateTaskData {
  title?: string;
  details?: string;
  domainId?: string;
  domainName?: string;
  ownerId?: string;
  ownerName?: string;
  ownerAvatar?: string;
  dueDate?: string;
  dueTime?: string;
  frequencyType?: string;
  frequencyInterval?: number;
  isCompleted?: boolean;
  completedAt?: Date | null;
  isSnoozed?: boolean;
  snoozedUntil?: Date;
  emoji?: string;
}

// Helper function to check if task is overdue
const isTaskOverdue = (dueDate?: string, dueTime?: string): boolean => {
  if (!dueDate) return false;
  
  const now = new Date();
  const taskDate = new Date(dueDate);
  
  if (dueTime) {
    const [hours, minutes] = dueTime.split(':').map(Number);
    taskDate.setHours(hours, minutes, 0, 0);
  } else {
    taskDate.setHours(23, 59, 59, 999); // End of day
  }
  
  return now > taskDate;
};

// Helper function to convert Firestore data to our interface
const convertFirestoreTask = (doc: any): FirestoreTask => {
  const data = doc.data();
  const dueDate = data.dueDate;
  const dueTime = data.dueTime;
  
  return {
    id: doc.id,
    title: data.title,
    details: data.details,
    domainId: data.domainId,
    domainName: data.domainName,
    ownerId: data.ownerId,
    ownerName: data.ownerName,
    ownerAvatar: data.ownerAvatar,
    dueDate,
    dueTime,
    frequencyType: data.frequencyType,
    frequencyInterval: data.frequencyInterval,
    isCompleted: data.isCompleted || false,
    completedAt: data.completedAt?.toDate(),
    isSnoozed: data.isSnoozed || false,
    snoozedUntil: data.snoozedUntil?.toDate(),
    emoji: data.emoji || "📋",
    subtasksCount: data.subtasksCount || 0,
    isOverdue: isTaskOverdue(dueDate, dueTime),
    isRecurring: !!data.frequencyType,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

// Fetch all tasks for a household
export async function fetchTasks(householdId: string): Promise<FirestoreTask[]> {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      where("householdId", "==", householdId),
      orderBy("dueDate", "asc"),
      orderBy("dueTime", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirestoreTask);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

// Fetch tasks for a specific user
export async function fetchUserTasks(userId: string, householdId: string): Promise<FirestoreTask[]> {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      where("householdId", "==", householdId),
      where("ownerId", "==", userId),
      orderBy("dueDate", "asc"),
      orderBy("dueTime", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertFirestoreTask);
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    throw error;
  }
}

// Fetch today's tasks
export async function fetchTodayTasks(householdId: string): Promise<FirestoreTask[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log("🔍 Debug: Fetching today's tasks for date:", today, "householdId:", householdId);
    
    const tasksRef = collection(db, "tasks");
    
    // Simplified query without orderBy to avoid indexing issues
    const q = query(
      tasksRef,
      where("householdId", "==", householdId),
      where("dueDate", "==", today)
    );
    
    console.log("🔍 Debug: Query created, executing...");
    
    const querySnapshot = await getDocs(q);
    console.log("🔍 Debug: Query snapshot size:", querySnapshot.size);
    
    if (querySnapshot.size === 0) {
      console.log("🔍 Debug: No tasks found. Let's check what's in the collection...");
      
      // Debug: Let's fetch ALL tasks to see what's there
      const allTasksQuery = query(tasksRef);
      const allTasksSnapshot = await getDocs(allTasksQuery);
      console.log("🔍 Debug: Total tasks in collection:", allTasksSnapshot.size);
      
      allTasksSnapshot.docs.forEach(doc => {
        const data = doc.data();
        console.log("🔍 Debug: Task in collection:", {
          id: doc.id,
          title: data.title,
          dueDate: data.dueDate,
          householdId: data.householdId,
          dueDateType: typeof data.dueDate,
          householdIdType: typeof data.householdId
        });
      });
    }
    
    const tasks = querySnapshot.docs.map(doc => {
      const task = convertFirestoreTask(doc);
      console.log("🔍 Debug: Task from Firestore:", {
        id: task.id,
        title: task.title,
        dueDate: task.dueDate,
        householdId: doc.data().householdId
      });
      return task;
    });
    
    console.log("🔍 Debug: Converted tasks:", tasks);
    
    // Sort manually since we removed orderBy
    tasks.sort((a, b) => {
      if (!a.dueTime || !b.dueTime) return 0;
      return a.dueTime.localeCompare(b.dueTime);
    });
    
    return tasks;
  } catch (error) {
    console.error("❌ Debug: Error fetching today's tasks:", error);
    throw error;
  }
}

// Fetch a single task by ID
export async function fetchTaskById(taskId: string): Promise<FirestoreTask | null> {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const taskSnap = await getDoc(taskRef);
    
    if (taskSnap.exists()) {
      return convertFirestoreTask(taskSnap);
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
}

// Create a new task
export async function createTask(taskData: CreateTaskData, householdId: string): Promise<FirestoreTask> {
  try {
    console.log("🔥 Debug: Creating task with data:", taskData);
    console.log("🔥 Debug: Using householdId:", householdId);
    
    const tasksRef = collection(db, "tasks");
    const newTask = {
      ...taskData,
      householdId,
      isCompleted: false,
      isSnoozed: false,
      subtasksCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    console.log("🔥 Debug: Final task object to save:", newTask);
    
    const docRef = await addDoc(tasksRef, newTask);
    console.log("🔥 Debug: Task saved with ID:", docRef.id);
    
    const createdTask = await fetchTaskById(docRef.id);
    console.log("🔥 Debug: Retrieved created task:", createdTask);
    
    if (!createdTask) {
      throw new Error("Failed to create task");
    }
    
    return createdTask;
  } catch (error) {
    console.error("❌ Debug: Error creating task:", error);
    throw error;
  }
}

// Update a task
export async function updateTask(taskId: string, updateData: UpdateTaskData): Promise<FirestoreTask> {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const updatePayload: any = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };
    
    // Handle completion timestamp
    if (updateData.isCompleted !== undefined) {
      if (updateData.isCompleted) {
        updatePayload.completedAt = serverTimestamp();
      } else {
        updatePayload.completedAt = null;
      }
    }
    
    await updateDoc(taskRef, updatePayload);
    
    const updatedTask = await fetchTaskById(taskId);
    if (!updatedTask) {
      throw new Error("Failed to update task");
    }
    
    return updatedTask;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

// Toggle task completion
export async function toggleTaskCompletion(taskId: string, isCompleted: boolean): Promise<FirestoreTask> {
  return updateTask(taskId, { 
    isCompleted,
    completedAt: isCompleted ? new Date() : null
  });
}

// Delete a task
export async function deleteTask(taskId: string): Promise<void> {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

// Real-time listener for tasks
export function subscribeToTasks(
  householdId: string, 
  callback: (tasks: FirestoreTask[]) => void,
  userId?: string
) {
  const tasksRef = collection(db, "tasks");
  let q;
  
  if (userId) {
    q = query(
      tasksRef,
      where("householdId", "==", householdId),
      where("ownerId", "==", userId),
      orderBy("dueDate", "asc"),
      orderBy("dueTime", "asc")
    );
  } else {
    q = query(
      tasksRef,
      where("householdId", "==", householdId),
      orderBy("dueDate", "asc"),
      orderBy("dueTime", "asc")
    );
  }
  
  return onSnapshot(q, (querySnapshot) => {
    const tasks = querySnapshot.docs.map(convertFirestoreTask);
    callback(tasks);
  });
}

// Real-time listener for today's tasks
export function subscribeToTodayTasks(
  householdId: string, 
  callback: (tasks: FirestoreTask[]) => void
) {
  const today = new Date().toISOString().split('T')[0];
  console.log("🔄 Debug: Setting up real-time listener for today's tasks:", { householdId, today });
  
  const tasksRef = collection(db, "tasks");
  
  // Simplified query without orderBy to avoid indexing issues
  const q = query(
    tasksRef,
    where("householdId", "==", householdId),
    where("dueDate", "==", today)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    console.log("🔄 Debug: Real-time snapshot received, size:", querySnapshot.size);
    
    const tasks = querySnapshot.docs.map(doc => {
      const task = convertFirestoreTask(doc);
      console.log("🔄 Debug: Real-time task:", {
        id: task.id,
        title: task.title,
        dueDate: task.dueDate,
        householdId: doc.data().householdId
      });
      return task;
    });
    
    // Sort manually since we removed orderBy
    tasks.sort((a, b) => {
      if (!a.dueTime || !b.dueTime) return 0;
      return a.dueTime.localeCompare(b.dueTime);
    });
    
    console.log("🔄 Debug: Calling callback with tasks:", tasks);
    callback(tasks);
  }, (error) => {
    console.error("❌ Debug: Real-time listener error:", error);
  });
}

// Fetch upcoming tasks (future dates)
export async function fetchUpcomingTasks(householdId: string): Promise<FirestoreTask[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log("🔍 Debug: Fetching upcoming tasks after date:", today, "householdId:", householdId);
    
    const tasksRef = collection(db, "tasks");
    
    // Simplified query - just filter by date to avoid indexing issues
    // TODO: Add householdId filter back when we set up the composite index
    const q = query(
      tasksRef,
      where("dueDate", ">", today)
    );
    
    console.log("🔍 Debug: Upcoming tasks query created, executing...");
    
    const querySnapshot = await getDocs(q);
    console.log("🔍 Debug: Upcoming query snapshot size:", querySnapshot.size);
    
    // Filter by householdId in JavaScript since we can't do it in Firestore yet
    const tasks = querySnapshot.docs
      .filter(doc => doc.data().householdId === householdId)
      .map(doc => {
        const task = convertFirestoreTask(doc);
        console.log("🔍 Debug: Upcoming task from Firestore:", {
          id: task.id,
          title: task.title,
          dueDate: task.dueDate,
          householdId: doc.data().householdId
        });
        return task;
      });
    
    console.log("🔍 Debug: Converted upcoming tasks:", tasks);
    
    // Sort by due date, then by time
    tasks.sort((a, b) => {
      // First sort by date
      const dateCompare = (a.dueDate || "").localeCompare(b.dueDate || "");
      if (dateCompare !== 0) return dateCompare;
      
      // Then by time if dates are the same
      if (!a.dueTime || !b.dueTime) return 0;
      return a.dueTime.localeCompare(b.dueTime);
    });
    
    return tasks;
  } catch (error) {
    console.error("❌ Debug: Error fetching upcoming tasks:", error);
    throw error;
  }
}

// Real-time listener for upcoming tasks
export function subscribeToUpcomingTasks(
  householdId: string, 
  callback: (tasks: FirestoreTask[]) => void
) {
  const today = new Date().toISOString().split('T')[0];
  console.log("🔄 Debug: Setting up real-time listener for upcoming tasks:", { householdId, afterDate: today });
  
  const tasksRef = collection(db, "tasks");
  
  // Simplified query - just filter by date to avoid indexing issues
  const q = query(
    tasksRef,
    where("dueDate", ">", today)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    console.log("🔄 Debug: Upcoming real-time snapshot received, size:", querySnapshot.size);
    
    // Filter by householdId in JavaScript
    const tasks = querySnapshot.docs
      .filter(doc => doc.data().householdId === householdId)
      .map(doc => {
        const task = convertFirestoreTask(doc);
        console.log("🔄 Debug: Upcoming real-time task:", {
          id: task.id,
          title: task.title,
          dueDate: task.dueDate,
          householdId: doc.data().householdId
        });
        return task;
      });
    
    // Sort by due date, then by time
    tasks.sort((a, b) => {
      const dateCompare = (a.dueDate || "").localeCompare(b.dueDate || "");
      if (dateCompare !== 0) return dateCompare;
      
      if (!a.dueTime || !b.dueTime) return 0;
      return a.dueTime.localeCompare(b.dueTime);
    });
    
    console.log("🔄 Debug: Calling callback with upcoming tasks:", tasks);
    callback(tasks);
  }, (error) => {
    console.error("❌ Debug: Upcoming real-time listener error:", error);
  });
} 