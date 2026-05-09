import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@devhub_task_manager_tasks';

const loadTasksFromStorage = async () => {
    const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (!storedValue) {
        return [];
    }

    try {
        return JSON.parse(storedValue);
    } catch (err) {
        console.warn('Failed to parse tasks from storage:', err);
        return [];
    }
};

const saveTasksToStorage = async (tasks) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const fetchTasks = async (filters = {}) => {
    const tasks = await loadTasksFromStorage();

    if (!filters || Object.keys(filters).length === 0) {
        return tasks;
    }

    return tasks.filter((task) =>
        Object.entries(filters).every(([key, value]) => task[key] === value)
    );
};

export const fetchTaskById = async (id) => {
    const tasks = await loadTasksFromStorage();
    return tasks.find((task) => task.id === id) || null;
};

export const createTask = async (task) => {
    const tasks = await loadTasksFromStorage();
    const newTask = {
        id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        created_at: new Date().toISOString(),
    };

    const updatedTasks = [newTask, ...tasks];
    await saveTasksToStorage(updatedTasks);
    return newTask;
};

export const updateTask = async (id, updates) => {
    const tasks = await loadTasksFromStorage();
    const updatedTasks = tasks.map((task) =>
        task.id === id
            ? { ...task, ...updates }
            : task
    );

    await saveTasksToStorage(updatedTasks);
    return updatedTasks.find((task) => task.id === id) || null;
};

export const deleteTask = async (id) => {
    const tasks = await loadTasksFromStorage();
    const updatedTasks = tasks.filter((task) => task.id !== id);
    await saveTasksToStorage(updatedTasks);
    return true;
};
