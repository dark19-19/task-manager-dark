import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchTasks, deleteTask, updateTask, createTask } from '../storage/taskStorage';
import { fetchNotes, deleteNote, updateNote, createNote } from '../storage/noteStorage';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import TaskDetails from '../components/TaskDetails';
import FilterButtons from '../components/FilterButtons';
import NoteItem from '../components/NoteItem';
import NoteForm from '../components/NoteForm';
import NoteDetails from '../components/NoteDetails';

function HomeScreenContent() {
    const insets = useSafeAreaInsets();
    const [activePage, setActivePage] = useState('tasks');
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
        loadTasks();
        loadNotes();
    }, []);

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

    const renderTask = ({ item }) => (
        <TaskItem
            task={item}
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
            onDelete={handleDeleteNote}
            onView={handleViewNote}
        />
    );

    const activeTitle = activePage === 'tasks' ? 'Dev-Hub Task Manager' : 'Notes';
    const emptyText = activePage === 'tasks' ? 'No tasks found' : 'No notes found';

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar style="auto" />
            <Text style={styles.title}>{activeTitle}</Text>

            <View style={styles.navRow}>
                <Pressable
                    style={[styles.navButton, activePage === 'tasks' && styles.navButtonActive]}
                    onPress={() => setActivePage('tasks')}
                >
                    <Text style={[styles.navButtonText, activePage === 'tasks' && styles.navButtonTextActive]}>Tasks</Text>
                </Pressable>
                <Pressable
                    style={[styles.navButton, activePage === 'notes' && styles.navButtonActive]}
                    onPress={() => setActivePage('notes')}
                >
                    <Text style={[styles.navButtonText, activePage === 'notes' && styles.navButtonTextActive]}>Notes</Text>
                </Pressable>
            </View>

            {activePage === 'tasks' && <FilterButtons onFilterChange={handleFilterChange} />}

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
                    ListEmptyComponent={<Text style={styles.empty}>{emptyText}</Text>}
                />
            )}

            <Pressable
                style={[styles.addButton, { bottom: insets.bottom + 24 }]}
                onPress={() => activePage === 'tasks' ? setShowTaskForm(true) : setShowNoteForm(true)}
            >
                <Text style={styles.addButtonText}>+</Text>
            </Pressable>

            <TaskForm
                visible={showTaskForm}
                onClose={() => setShowTaskForm(false)}
                onSubmit={handleCreateTask}
            />

            <TaskForm
                visible={!!editingTask}
                task={editingTask}
                onClose={() => setEditingTask(null)}
                onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
            />

            <NoteForm
                visible={showNoteForm}
                onClose={() => setShowNoteForm(false)}
                onSubmit={handleCreateNote}
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
