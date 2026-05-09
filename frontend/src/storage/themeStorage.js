import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@devhub_task_manager_theme';

export const getThemePreference = async () => {
    try {
        const value = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        return value;
    } catch (err) {
        console.warn('Unable to load theme preference:', err);
        return null;
    }
};

export const saveThemePreference = async (theme) => {
    try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (err) {
        console.warn('Unable to save theme preference:', err);
    }
};
