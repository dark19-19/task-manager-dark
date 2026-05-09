import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@devhub_task_manager_notes';

const loadNotesFromStorage = async () => {
    const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (!storedValue) {
        return [];
    }

    try {
        return JSON.parse(storedValue);
    } catch (err) {
        console.warn('Failed to parse notes from storage:', err);
        return [];
    }
};

const saveNotesToStorage = async (notes) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const fetchNotes = async (filters = {}) => {
    const notes = await loadNotesFromStorage();

    const sortedNotes = notes.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    if (!filters || Object.keys(filters).length === 0) {
        return sortedNotes;
    }

    return sortedNotes.filter((note) =>
        Object.entries(filters).every(([key, value]) => note[key] === value)
    );
};

export const fetchNoteById = async (id) => {
    const notes = await loadNotesFromStorage();
    return notes.find((note) => note.id === id) || null;
};

export const createNote = async (note) => {
    const notes = await loadNotesFromStorage();
    const newNote = {
        id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: note.title,
        description: note.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const updatedNotes = [newNote, ...notes];
    await saveNotesToStorage(updatedNotes);
    return newNote;
};

export const updateNote = async (id, updates) => {
    const notes = await loadNotesFromStorage();
    const updatedNotes = notes.map((note) =>
        note.id === id
            ? { ...note, ...updates, updated_at: new Date().toISOString() }
            : note
    );

    await saveNotesToStorage(updatedNotes);
    return updatedNotes.find((note) => note.id === id) || null;
};

export const deleteNote = async (id) => {
    const notes = await loadNotesFromStorage();
    const updatedNotes = notes.filter((note) => note.id !== id);
    await saveNotesToStorage(updatedNotes);
    return true;
};
