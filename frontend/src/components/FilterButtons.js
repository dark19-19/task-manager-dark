import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function FilterButtons({ onFilterChange, theme = 'light' }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const isDark = theme === 'dark';

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
                        isDark && styles.darkButton,
                        activeFilter === filter.key && styles.activeButton,
                        activeFilter === filter.key && isDark && styles.darkActiveButton,
                    ]}
                    onPress={() => handleFilterPress(filter.key)}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            isDark && styles.darkButtonText,
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
    darkButton: {
        borderColor: '#333',
        backgroundColor: '#1A1A1A',
    },
    activeButton: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    darkActiveButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    darkButtonText: {
        color: '#fafafa',
    },
    activeButtonText: {
        color: '#fff',
    },
});
