export interface RootState {
  notes: NotesState;
}

export interface NotesState {
  notes: Note[];
}

export interface Note {
  id: number;
  title: string;
  content: string;
}

export type NotesActionTypes = AddNoteAction | UpdateNoteAction;

export const ADD_NOTE = 'ADD_NOTE';
export interface AddNoteAction {
  type: typeof ADD_NOTE;
  payload: Note;
}

export const UPDATE_NOTE = 'UPDATE_NOTE';
export interface UpdateNoteAction {
  type: typeof UPDATE_NOTE;
  payload: Note;
}
