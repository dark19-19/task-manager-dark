import React, { useState, useEffect } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const TaskForm = ({ visible, task, onSubmit, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [priority, setPriority] = useState('medium');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setStatus(task.status);
            setPriority(task.priority);
        } else {
            setTitle('');
            setDescription('');
            setStatus('pending');
            setPriority('medium');
        }
    }, [task, visible]);

    const handleSubmit = () => {
        if (!title.trim()) {
            return;
        }

        onSubmit({
            title: title.trim(),
            description: description.trim(),
            status,
            priority,
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>{task ? 'Edit Task' : 'New Task'}</Text>
                    <Text style={styles.label}>Title:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Task title"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <Text style={styles.label}>Description:</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Task description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                    />

                    <View style={styles.pickerContainer}>
                        <Text style={styles.label}>Status:</Text>
                        <Picker
                            selectedValue={status ? status : 'pending'}
                            onValueChange={setStatus}
                            style={styles.picker}
                        >
                            <Picker.Item label="Pending" value="pending" />
                            <Picker.Item label="In Progress" value="in-progress" />
                            <Picker.Item label="Completed" value="completed" />
                        </Picker>
                    </View>

                    <View style={styles.pickerContainer}>
                        <Text style={styles.label}>Priority:</Text>
                        <Picker
                            selectedValue={priority ? priority : 'medium'}
                            onValueChange={setPriority}
                            style={styles.picker}
                        >
                            <Picker.Item label="Low" value="low" />
                            <Picker.Item label="Medium" value="medium" />
                            <Picker.Item label="High" value="high" />
                        </Picker>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>
                        <Pressable style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>{task ? 'Update' : 'Create'}</Text>
                        </Pressable>
                    </View>
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: '#007AFF',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default TaskForm;
