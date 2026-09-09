import { configureStore, createSlice } from "@reduxjs/toolkit";
import { EditableTableSlice } from "./EditableTableSlice.js";

export const currentActivesSlice = new EditableTableSlice("currentActives");

export const createCurrentActivesTableStore = () =>
  currentActivesSlice.createStore();
