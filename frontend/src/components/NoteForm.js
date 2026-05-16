import React, { useEffect, useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const NoteForm = ({ visible, note, onSubmit, onClose, theme }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const isDark = theme === 'dark';
    const placeholderColor = isDark ? '#fafafa' : '#777';

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setDescription(note.description);
        } else {
            setTitle('');
            setDescription('');
        }
    }, [note, visible]);

    const handleSubmit = () => {
        if (!title.trim()) {
            return;
        }

        onSubmit({
            title: title.trim(),
            description: description.trim(),
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                    <Text style={[styles.title, { color: isDark ? '#fafafa' : '#333' }]}>{note ? 'Edit Note' : 'New Note'}</Text>

                    <TextInput
                        style={[styles.input, { backgroundColor: isDark ? '#252525' : '#fff', color: isDark ? '#fafafa' : '#000', borderColor: isDark ? '#444' : '#ddd' }]}
                        placeholder="Note title"
                        placeholderTextColor={placeholderColor}
                        value={title}
                        onChangeText={setTitle}
                    />

                    <TextInput
                        style={[styles.input, styles.textArea, { backgroundColor: isDark ? '#252525' : '#fff', color: isDark ? '#fafafa' : '#000', borderColor: isDark ? '#444' : '#ddd' }]}
                        placeholder="Note description"
                        placeholderTextColor={placeholderColor}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />

                    <View style={styles.buttonContainer}>
                        <Pressable style={[styles.button, {backgroundColor: isDark ? '#252525' : '#f5f5f5'}]} onPress={onClose}>
                            <Text style={{color: isDark ? '#fafafa' : '#666'}}>Cancel</Text>
                        </Pressable>
                        <Pressable style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>{note ? 'Save' : 'Create'}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

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
        height: 100,
        textAlignVertical: 'top',
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
    cancelButtonText: {
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

export default NoteForm;
