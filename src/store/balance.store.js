import { configureStore, createSlice } from "@reduxjs/toolkit";
import { EditableTableSlice } from "./EditableTableSlice.js";

export const currentActivesSlice = new EditableTableSlice("currentActives");
export const passiveSlice = new EditableTableSlice("passives");

export const createCurrentActivesTableStore = () =>
  currentActivesSlice.createStore();

export const createPassiveStore = () => passiveSlice.createStore();
