// configration of the store 

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice/authSlice';
import { saveStorage } from '../utils/localStorage';
import { createStateSyncMiddleware } from 'redux-state-sync';

const store = configureStore({
    reducer:{
        UserData: authReducer,
    },

})

// This will call the saveStorage function every time the store is updated, allowing you to persist the state to localStorage or any other storage mechanism you choose.
store.subscribe(() => {
    return saveStorage(store.getState().UserData);
});

export default store;