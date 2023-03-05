import { combineReducers, createStore, Store } from 'redux';
import { ADD_NOTE, NotesActionTypes, NotesState, RootState, UPDATE_NOTE } from './types';

const initialState: NotesState = {
  notes: [],
};

function notesReducer(state = initialState, action: NotesActionTypes): NotesState {
  switch (action.type) {
    case ADD_NOTE:
      return {
        ...state,
        notes: [...state.notes, action.payload],
      };
    case UPDATE_NOTE:
      return {
        ...state,
        notes: state.notes.map((note) => {
          if (note.id === action.payload.id) {
            return action.payload;
          }
          return note;
        }),
      };
    default:
      return state;
  }
}
const rootReducer = combineReducers<RootState>({
  notes: notesReducer,
});

export const store: Store<RootState, NotesActionTypes> = createStore(rootReducer);

