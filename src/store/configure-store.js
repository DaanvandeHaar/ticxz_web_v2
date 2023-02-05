import {applyMiddleware, createStore} from "redux";
import {persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage'
import {useMemo} from "react";
import {rootReducer} from "./root-reducer";
import {configureStore} from "@reduxjs/toolkit";
import { getPersistConfig } from 'redux-deep-persist';
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/lib/constants";

let store

const exampleInitialState = {
    event: {
        activeEvent: {},
    },
}

const persistConfig = getPersistConfig({
    key: 'primary',
    storage,
    whitelist: ['event.activeEvent'],
    rootReducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer)

function makeStore(initialState = exampleInitialState) {
    return configureStore({
        reducer: persistedReducer,
        devTools: process.env.NODE_ENV !== 'production',
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }),
        }
    )
}

export const initializeStore = (preloadedState) => {
    let _store = store ?? makeStore(preloadedState)

    // After navigating to a page with an initial Redux state, merge that state
    // with the current state in the store, and create a new store
    if (preloadedState && store) {
        _store = makeStore({
            ...store.getState(),
            ...preloadedState,
        })
        // Reset the current store
        store = undefined
    }

    // For SSG and SSR always create a new store
    if (typeof window === 'undefined') return _store
    // Create the store once in the client
    if (!store) store = _store

    return _store
}

export function useStore(initialState) {
    return useMemo(() => initializeStore(initialState), [initialState])
}