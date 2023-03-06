import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Note {
  id: number;
  title: string;
  content?: string;
}

export interface NotesState {
  notes: Note[];
}

const initialState: NotesState = {
  notes: [],
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },
    updateNote: (state, action: PayloadAction<Note>) => {
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },
  },
});

export const { addNote, updateNote } = notesSlice.actions;

export default notesSlice.reducer;

