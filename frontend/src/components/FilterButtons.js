import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function FilterButtons({ onFilterChange }) {
    const [activeFilter, setActiveFilter] = useState('all');

    const filters = [
        { key: 'all', label: 'All' },
        { key: 'pending', label: 'Pending' },
        { key: 'in-progress', label: 'In Progress' },
        { key: 'completed', label: 'Completed' },
    ];

    const handleFilterPress = (filterKey) => {
        setActiveFilter(filterKey);
        const filter = filterKey === 'all' ? {} : { status: filterKey };
        onFilterChange(filter);
    };

    return (
        <View style={styles.container}>
            {filters.map((filter) => (
                <Pressable
                    key={filter.key}
                    style={[
                        styles.button,
                        activeFilter === filter.key && styles.activeButton,
                    ]}
                    onPress={() => handleFilterPress(filter.key)}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            activeFilter === filter.key && styles.activeButtonText,
                        ]}
                    >
                        {filter.label}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    activeButton: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    buttonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    activeButtonText: {
        color: '#fff',
    },
});
