import {configureStore} from '@reduxjs/toolkit';
import sessionReducer from "./Session/sessionSlice";

export const store = configureStore({
    reducer: {
        sessions:sessionReducer
    }
});

