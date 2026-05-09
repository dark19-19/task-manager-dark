import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchTasks, deleteTask, updateTask, createTask } from '../storage/taskStorage';
import { fetchNotes, deleteNote, updateNote, createNote } from '../storage/noteStorage';
import { getThemePreference, saveThemePreference } from '../storage/themeStorage';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import TaskDetails from '../components/TaskDetails';
import FilterButtons from '../components/FilterButtons';
import NoteItem from '../components/NoteItem';
import NoteForm from '../components/NoteForm';
import NoteDetails from '../components/NoteDetails';

function HomeScreenContent() {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const [activePage, setActivePage] = useState('tasks');
    const [theme, setTheme] = useState(colorScheme || 'light');
    const [storedTheme, setStoredTheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const [notes, setNotes] = useState([]);
    const [notesLoading, setNotesLoading] = useState(true);
    const [notesError, setNotesError] = useState(null);
    const [showNoteForm, setShowNoteForm] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

    const loadTasks = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchTasks(filters);
            setTasks(response);
        } catch (err) {
            setError(err.message || 'Unable to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const loadNotes = async () => {
        setNotesLoading(true);
        setNotesError(null);

        try {
            const response = await fetchNotes();
            setNotes(response);
        } catch (err) {
            setNotesError(err.message || 'Unable to load notes');
        } finally {
            setNotesLoading(false);
        }
    };

    useEffect(() => {
        const loadTheme = async () => {
            const stored = await getThemePreference();
            if (stored) {
                setTheme(stored);
                setStoredTheme(stored);
            } else {
                setTheme(colorScheme || 'light');
            }
        };

        loadTheme();
        loadTasks();
        loadNotes();
    }, []);

    useEffect(() => {
        if (storedTheme === null) {
            setTheme(colorScheme || 'light');
        }
    }, [colorScheme, storedTheme]);

    useEffect(() => {
        loadTasks();
    }, [filters]);

    const handleCreateTask = async (taskData) => {
        try {
            await createTask(taskData);
            setShowTaskForm(false);
            loadTasks();
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const handleUpdateTask = async (id, taskData) => {
        try {
            await updateTask(id, taskData);
            setEditingTask(null);
            loadTasks();
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const handleDeleteTask = async (id) => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteTask(id);
                            loadTasks();
                        } catch (err) {
                            Alert.alert('Error', err.message);
                        }
                    },
                },
            ]
        );
    };

    const handleStartTask = async (id) => {
        try {
            await updateTask(id, { status: 'in-progress' });
            loadTasks();
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const handleCompleteTask = async (id) => {
        try {
            await updateTask(id, { status: 'completed' });
            loadTasks();
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
    };

    const handleViewTask = (task) => {
        setSelectedTask(task);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleCreateNote = async (noteData) => {
        try {
            await createNote(noteData);
            setShowNoteForm(false);
            loadNotes();
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const handleSaveNote = async (id, noteData) => {
        try {
            const updatedNote = await updateNote(id, noteData);
            setSelectedNote(updatedNote);
            loadNotes();
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const handleDeleteNote = async (id) => {
        Alert.alert(
            'Delete Note',
            'Are you sure you want to delete this note?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteNote(id);
                            setSelectedNote(null);
                            loadNotes();
                        } catch (err) {
                            Alert.alert('Error', err.message);
                        }
                    },
                },
            ]
        );
    };

    const handleViewNote = (note) => {
        setSelectedNote(note);
    };

    const handleToggleTheme = async () => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
        setStoredTheme(nextTheme);
        await saveThemePreference(nextTheme);
    };

    const renderTask = ({ item }) => (
        <TaskItem
            task={item}
            theme={theme}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            onStart={handleStartTask}
            onComplete={handleCompleteTask}
            onView={handleViewTask}
        />
    );

    const renderNote = ({ item }) => (
        <NoteItem
            note={item}
            theme={theme}
            onDelete={handleDeleteNote}
            onView={handleViewNote}
        />
    );

    const isDark = theme === 'dark';
    const activeTitle = activePage === 'tasks' ? 'Dev-Hub Task Manager' : activePage === 'notes' ? 'Notes' : 'Settings';
    const emptyText = activePage === 'tasks' ? 'No tasks found' : 'No notes found';
    const themeStyles = {
        backgroundColor: isDark ? '#121212' : '#F5F7FB',
        pageText: isDark ? '#F5F5F5' : '#333',
        subtitleText: isDark ? '#ccc' : '#666',
        cardBackground: isDark ? '#1E1E1E' : '#fff',
        navButtonBackground: isDark ? '#1A1A1A' : '#fff',
        navButtonText: isDark ? '#ccc' : '#666',
        inputBackground: isDark ? '#252525' : '#fff',
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top, backgroundColor: themeStyles.backgroundColor }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <View style={styles.headerRow}>
                <Text style={[styles.title, { color: themeStyles.pageText }]}>{activeTitle}</Text>
                <Pressable style={styles.settingsTopButton} onPress={() => setActivePage('settings')}>
                    <Text style={styles.settingsTopButtonText}>Settings</Text>
                </Pressable>
            </View>

            <View style={[styles.navRow, { backgroundColor: themeStyles.cardBackground }]}>
                <Pressable
                    style={[
                        styles.navButton,
                        { backgroundColor: activePage === 'tasks' ? '#007AFF' : themeStyles.navButtonBackground },
                        activePage === 'tasks' && styles.navButtonActive,
                    ]}
                    onPress={() => setActivePage('tasks')}
                >
                    <Text style={[styles.navButtonText, activePage === 'tasks' && styles.navButtonTextActive]}>Tasks</Text>
                </Pressable>
                <Pressable
                    style={[
                        styles.navButton,
                        { backgroundColor: activePage === 'notes' ? '#007AFF' : themeStyles.navButtonBackground },
                        activePage === 'notes' && styles.navButtonActive,
                    ]}
                    onPress={() => setActivePage('notes')}
                >
                    <Text style={[styles.navButtonText, activePage === 'notes' && styles.navButtonTextActive]}>Notes</Text>
                </Pressable>
            </View>

            {activePage === 'tasks' && <FilterButtons onFilterChange={handleFilterChange} theme={theme} />}

            {activePage === 'tasks' && loading && <ActivityIndicator size="large" color="#007AFF" />}
            {activePage === 'tasks' && error && <Text style={styles.error}>{error}</Text>}
            {activePage === 'tasks' && !loading && !error && (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderTask}
                    contentContainerStyle={[styles.taskList, { paddingBottom: insets.bottom + 80 }]}
                    ListEmptyComponent={<Text style={styles.empty}>{emptyText}</Text>}
                />
            )}

            {activePage === 'notes' && notesLoading && <ActivityIndicator size="large" color="#007AFF" />}
            {activePage === 'notes' && notesError && <Text style={styles.error}>{notesError}</Text>}
            {activePage === 'notes' && !notesLoading && !notesError && (
                <FlatList
                    data={notes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderNote}
                    contentContainerStyle={[styles.taskList, { paddingBottom: insets.bottom + 80 }]}
                    ListEmptyComponent={<Text style={[styles.empty, { color: themeStyles.subtitleText }]}>{emptyText}</Text>}
                />
            )}

            {activePage === 'settings' && (
                <View style={[styles.settingsContainer, { backgroundColor: themeStyles.cardBackground }]}>
                    <Text style={[styles.settingsParagraph, { color: themeStyles.pageText }]}>Dev-Hub Task Manager is an offline-first mobile app for managing tasks and notes on the go. Use this screen to switch the app theme and keep your workflow comfortable at any time.</Text>
                    <Pressable
                        style={[
                            styles.settingsActionButton,
                            { backgroundColor: isDark ? '#4CAF50' : '#007AFF' },
                        ]}
                        onPress={handleToggleTheme}
                    >
                        <Text style={styles.settingsActionButtonText}>{isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}</Text>
                    </Pressable>
                </View>
            )}

            <Pressable
                style={[styles.addButton, { bottom: insets.bottom + 24 }]}
                onPress={() => activePage === 'tasks' ? setShowTaskForm(true) : activePage === 'notes' ? setShowNoteForm(true) : null}
            >
                <Text style={styles.addButtonText}>+</Text>
            </Pressable>

            <TaskForm
                visible={showTaskForm}
                onClose={() => setShowTaskForm(false)}
                onSubmit={handleCreateTask}
                theme={theme}
            />

            <TaskForm
                visible={!!editingTask}
                task={editingTask}
                onClose={() => setEditingTask(null)}
                onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
                theme={theme}
            />

            <NoteForm
                visible={showNoteForm}
                onClose={() => setShowNoteForm(false)}
                onSubmit={handleCreateNote}
                theme={theme}
            />

            <TaskDetails
                visible={!!selectedTask}
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
            />

            <NoteDetails
                visible={!!selectedNote}
                note={selectedNote}
                onSave={handleSaveNote}
                onClose={() => setSelectedNote(null)}
            />
        </SafeAreaView>
    );
}

export default function HomeScreen() {
    return <HomeScreenContent />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        textAlign: 'center',
        marginVertical: 16,
        color: '#333',
    },
    navRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 16,
        gap: 12,
        marginBottom: 16,
    },
    navButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    navButtonActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    navButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    navButtonTextActive: {
        color: '#fff',
    },
    error: {
        color: '#D00',
        textAlign: 'center',
        marginTop: 16,
    },
    taskList: {
        paddingHorizontal: 16,
    },
    empty: {
        textAlign: 'center',
        marginTop: 32,
        color: '#666',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 12,
    },
    settingsTopButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 24,
        backgroundColor: '#007AFF',
    },
    settingsTopButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    navRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 16,
        gap: 12,
        marginBottom: 16,
        borderRadius: 24,
        padding: 4,
    },
    settingsContainer: {
        marginHorizontal: 16,
        padding: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    settingsParagraph: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
        color: '#333',
    },
    settingsActionButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    settingsActionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    addButton: {
        position: 'absolute',
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
});
