import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export default function TaskDetails({ visible, task, onClose }) {
    if (!task) return null;

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
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>{task.title}</Text>

                    <View style={styles.meta}>
                        <Text style={[styles.status, { color: getStatusColor(task.status) }]}>
                            Status: {task.status}
                        </Text>
                        <Text style={[styles.priority, { color: getPriorityColor(task.priority) }]}>
                            Priority: {task.priority}
                        </Text>
                    </View>

                    <Text style={styles.label}>Description:</Text>
                    <Text style={styles.description}>
                        {task.description || 'No description provided.'}
                    </Text>

                    <Text style={styles.label}>Created:</Text>
                    <Text style={styles.createdAt}>
                        {new Date(task.created_at).toLocaleString()}
                    </Text>

                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxWidth: 400,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    meta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    status: {
        fontSize: 16,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    priority: {
        fontSize: 16,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 4,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    createdAt: {
        fontSize: 14,
        color: '#666',
    },
    closeButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignSelf: 'center',
        marginTop: 24,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
