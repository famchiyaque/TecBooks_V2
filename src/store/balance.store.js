import { configureStore, createSlice } from "@reduxjs/toolkit";
import { EditableTableSlice } from "./EditableTableSlice.js";

export const currentActivesSlice = new EditableTableSlice("currentActives");
export const passiveSlice = new EditableTableSlice("passives");
export const deferedActivesSlice = new EditableTableSlice("deferedActives");

export const createCurrentActivesTableStore = () =>
  currentActivesSlice.createStore();

export const createPassiveStore = () => passiveSlice.createStore();

export const createDeferedActivesTableStore = () =>
  deferedActivesSlice.createStore();
