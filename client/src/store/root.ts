import { combineReducers } from 'redux';
import notesReducer from '../features/notes';
import canvasReducer from '../features/canvas';
import sidebarReducer from '../features/sidebar';

const rootReducer = combineReducers({
  notes: notesReducer,
  canvas: canvasReducer,
  sidebar: sidebarReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
