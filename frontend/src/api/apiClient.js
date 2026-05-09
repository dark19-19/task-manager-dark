import { API_BASE_URL } from '../constants/apiConfig';

const request = async (path, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, options);

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error ${response.status}: ${text}`);
    }

    return response.json();
};

export const fetchGreeting = () => request('/api/greeting');

// Task API functions
export const fetchTasks = (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/api/tasks?${params}`);
};

export const fetchTaskById = (id) => request(`/api/tasks/${id}`);

export const createTask = (task) =>
    request('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });

export const updateTask = (id, task) =>
    request(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });

export const deleteTask = (id) =>
    request(`/api/tasks/${id}`, {
        method: 'DELETE',
    });
