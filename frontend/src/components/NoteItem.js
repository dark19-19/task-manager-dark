import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function NoteItem({ note, onDelete, onView }) {
    return (
        <Pressable style={styles.container} onPress={() => onView(note)}>
            <View style={styles.content}>
                <Text style={styles.title}>{note.title}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {note.description || 'No description'}
                </Text>
                <Text style={styles.updatedAt}>
                    Updated {new Date(note.updated_at).toLocaleString()}
                </Text>
            </View>
            <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={() => onDelete(note.id)}>
                <Text style={styles.actionText}>✕</Text>
            </Pressable>
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
    updatedAt: {
        fontSize: 12,
        color: '#999',
    },
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
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
