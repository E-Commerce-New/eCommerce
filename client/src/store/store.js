import {configureStore} from '@reduxjs/toolkit';
import userReducer from './User';

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('User');
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    } catch (e) {
        console.error('Could not load state', e);
        return undefined;
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('User', serializedState);
    } catch (e) {
        console.error('Could not save state', e);
    }
};

const preloadedState = loadState();

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
    preloadedState,
});


store.subscribe(() => {
    saveState({
        user: store.getState().user,
    });
});


