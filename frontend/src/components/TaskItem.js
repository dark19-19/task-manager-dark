import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function TaskItem({ task, onDelete, onEdit, onStart, onComplete, onView }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return '#4CAF50';
            case 'in-progress':
                return '#FF9800';
            default:
                return '#2196F3';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return '#F44336';
            case 'medium':
                return '#FF9800';
            default:
                return '#4CAF50';
        }
    };

    return (
        <Pressable style={styles.container} onPress={() => onView(task)}>
            <View style={styles.content}>
                <Text style={styles.title}>{task.title}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {task.description || 'No description'}
                </Text>
                <View style={styles.meta}>
                    <Text style={[styles.status, { color: getStatusColor(task.status) }]}>
                        {task.status}
                    </Text>
                    <Text style={[styles.priority, { color: getPriorityColor(task.priority) }]}>
                        {task.priority}
                    </Text>
                </View>
            </View>
            <View style={styles.actions}>
                {task.status === 'pending' && (
                    <Pressable
                        style={[styles.actionButton, styles.startButton]}
                        onPress={() => onStart(task.id)}
                    >
                        <Text style={styles.actionText}>▶</Text>
                    </Pressable>
                )}
                {task.status === 'in-progress' && (
                    <Pressable
                        style={[styles.actionButton, styles.completeButton]}
                        onPress={() => onComplete(task.id)}
                    >
                        <Text style={styles.actionText}>✓</Text>
                    </Pressable>
                )}
                <Pressable
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => onEdit(task)}
                >
                    <Text style={styles.actionText}>✎</Text>
                </Pressable>
                <Pressable
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => onDelete(task.id)}
                >
                    <Text style={styles.actionText}>✕</Text>
                </Pressable>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    meta: {
        flexDirection: 'row',
        gap: 12,
    },
    status: {
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    priority: {
        fontSize: 12,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#2196F3',
    },
    completeButton: {
        backgroundColor: '#4CAF50',
    },
    editButton: {
        backgroundColor: '#FF9800',
    },
    deleteButton: {
        backgroundColor: '#F44336',
    },
    actionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
