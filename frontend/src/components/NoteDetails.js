import React, { useEffect, useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const NoteDetails = ({ visible, note, onSave, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (note) {
            setTitle(note.title || '');
            setDescription(note.description || '');
            setIsDirty(false);
        } else {
            setTitle('');
            setDescription('');
            setIsDirty(false);
        }
    }, [note, visible]);

    useEffect(() => {
        if (!note) {
            setIsDirty(false);
            return;
        }

        setIsDirty(
            title.trim() !== (note.title || '').trim() ||
            description.trim() !== (note.description || '').trim()
        );
    }, [title, description, note]);

    const handleSave = () => {
        if (!note) {
            return;
        }

        onSave(note.id, {
            title: title.trim(),
            description: description.trim(),
        });
    };

    if (!note) return null;

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Note Details</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Title"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />

                    <Text style={styles.updatedAt}>
                        Last updated {new Date(note.updated_at).toLocaleString()}
                    </Text>

                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.saveButton,
                                isDirty ? styles.saveButtonActive : styles.saveButtonDisabled,
                            ]}
                            onPress={handleSave}
                            disabled={!isDirty}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
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
        marginBottom: 16,
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
    updatedAt: {
        fontSize: 12,
        color: '#666',
        marginBottom: 16,
        textAlign: 'right',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    closeButton: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
    saveButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonActive: {
        backgroundColor: '#4CAF50',
    },
    saveButtonDisabled: {
        backgroundColor: '#ccc',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default NoteDetails;
