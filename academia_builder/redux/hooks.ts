import { useSelector, useDispatch } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux"; // TypedUseSelectorHook is a type that represents the useSelector hook which is used to access the state of the store
import type { AppDispatch, RootState } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch; // useDispatch is a hook that returns the dispatch function of the store

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // useSelector is a hook that returns the state of the store
