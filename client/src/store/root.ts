import { combineReducers } from 'redux';
import notesReducer from '../features/notes';
import sidebarReducer from '../features/sidebar';

const rootReducer = combineReducers({
  notes: notesReducer,
  sidebar: sidebarReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
