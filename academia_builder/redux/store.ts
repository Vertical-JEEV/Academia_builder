import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import { apiSlice } from "./services/apiSlice";





// Create a store with no reducers
// a reducer is a function that determines how the state changes in response to an action
export const makeStore = () => {
    return configureStore({
        reducer: {
            // Add the api slice to the store
            [apiSlice.reducerPath]: apiSlice.reducer,
            // Add the auth reducer to the store
            auth: authReducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(apiSlice.middleware),
        
        devTools: process.env.NODE_ENV !== "production",
    });
}

// appstore is a type that represents the store
export type AppStore = ReturnType<typeof makeStore>;
// RootState is a type that represents the state of the store
export type RootState = ReturnType<AppStore["getState"]>;
// AppDispatch is a type that represents the dispatch function of the store
// dispatch is a function that sends an action to the store
export type AppDispatch = AppStore["dispatch"];


