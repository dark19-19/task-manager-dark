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
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import TaskDetails from '../components/TaskDetails';
import FilterButtons from '../components/FilterButtons';

function HomeScreenContent() {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

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

    useEffect(() => {
        loadTasks();
    }, [filters]);

    const handleCreateTask = async (taskData) => {
        try {
            await createTask(taskData);
            setShowForm(false);
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

    const handleMarkDone = async (id) => {
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

    const renderTask = ({ item }) => (
        <TaskItem
            task={item}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            onMarkDone={handleMarkDone}
            onView={handleViewTask}
        />
    );

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar style="auto" />
            <Text style={styles.title}>Dev-Hub Task Manager</Text>

            <FilterButtons onFilterChange={handleFilterChange} />

            {loading && <ActivityIndicator size="large" color="#007AFF" />}
            {error && <Text style={styles.error}>{error}</Text>}
            {!loading && !error && (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderTask}
                    contentContainerStyle={[styles.taskList, { paddingBottom: insets.bottom + 80 }]}
                    ListEmptyComponent={<Text style={styles.empty}>No tasks found</Text>}
                />
            )}

            <Pressable style={[styles.addButton, { bottom: insets.bottom + 24 }]} onPress={() => setShowForm(true)}>
                <Text style={styles.addButtonText}>+</Text>
            </Pressable>

            <TaskForm
                visible={showForm}
                onClose={() => setShowForm(false)}
                onSubmit={handleCreateTask}
            />

            <TaskForm
                visible={!!editingTask}
                task={editingTask}
                onClose={() => setEditingTask(null)}
                onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
            />

            <TaskDetails
                visible={!!selectedTask}
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
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
    }
});
