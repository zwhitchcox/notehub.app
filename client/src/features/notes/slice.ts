import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Note {
  id: number;
  title: string;
  content: string;
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
    loadNotes: (state) => {
      const notes = JSON.parse(localStorage.getItem('notes') || '[]');
      state.notes = notes;
    },
    saveNotes: (state) => {
      localStorage.setItem('notes', JSON.stringify(state.notes));
    },
    deleteNote: (state, action: PayloadAction<number>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
  },
});

export const { addNote, updateNote, deleteNote, loadNotes, saveNotes } = notesSlice.actions;

export default notesSlice.reducer;

