import { AddNoteAction, ADD_NOTE, Note, UpdateNoteAction, UPDATE_NOTE } from './types';
export function addNoteAction(note: Note): AddNoteAction {
  return {
    type: ADD_NOTE,
    payload: note,
  };
}
export function updateNoteAction(note: Note): UpdateNoteAction {
  return {
    type: UPDATE_NOTE,
    payload: note,
  };
}
