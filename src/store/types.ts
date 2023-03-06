import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './root';
import { Note } from '../features/notes';

// Action types
export interface AddNoteAction extends Action<'notes/addNote'> {
  payload: Note;
}
export interface UpdateNoteAction extends Action<'notes/updateNote'> {
  payload: Note;
}

export type NotesActionTypes = AddNoteAction | UpdateNoteAction;

// Action creators
export const addNoteAction = (note: Note): AddNoteAction => ({
  type: 'notes/addNote',
  payload: note,
});

export const updateNoteAction = (note: Note): UpdateNoteAction => ({
  type: 'notes/updateNote',
  payload: note,
});

// Thunks
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

