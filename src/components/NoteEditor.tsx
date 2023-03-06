import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/root';
import { addNote, Note } from '../features/notes';
import { updateNote } from '../features/notes';
import Canvas from './Canvas';
import { toggleDrawingMode } from '../features/canvas';
import { useNavigate } from 'react-router-dom';

interface Props {
  noteId: number;
}

const NoteEditor: React.FC<Props> = ({ noteId }) => {
  console.log({noteId});
  const dispatch = useDispatch();
  const [content, setContent] = useState<string>('');
  const note = useSelector((state: RootState) =>
    state.notes.notes.find((note: Note) => note.id === noteId)
  );
  console.log('title', note?.title);
  const canvas = useSelector((state: RootState) => state.canvas);
  const [title, setTitle] = useState<string>(note?.title || '');

  const isDrawingMode = useSelector((state: RootState) => state.canvas.isDrawingMode);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (content: string) => {
    setContent(content);
  };

  const navigate = useNavigate();
  const handleSave = () => {
    if (note) {
      dispatch(updateNote({
        id: note.id,
        title: title || note.title,
        content: content || note.content
      }));
    } else {
      const id = Date.now();
      dispatch(addNote({
        id,
        title,
        content
      }));
      try {
        console.log('disposing canvas -- NoteEditor.tsx');
        canvas.canvas?.dispose();
      } catch (err) {
        console.log("couldn't dispose canvas -- NoteEditor.tsx");
      }
      navigate(`/notes/${id}`);
    }
  };

  const handleToggleDrawingMode = () => {
    dispatch(toggleDrawingMode());
  }

  return (
    <div>
      <div id="toolbar" className="flex items-center justify-between mb-4">
        <div>
          <label htmlFor="title" className="mr-4">Title:</label>
          <input type="text" id="title" value={title || note?.title || ''} onChange={handleTitleChange} className="border rounded px-2 py-1" />
        </div>
        <div>
          <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
            <i className="fas fa-save"></i> Save Note
          </button>
          <button onClick={handleToggleDrawingMode} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {isDrawingMode ? <><i className="fas fa-pencil-alt"></i> Exit Drawing Mode</> : <><i className="fas fa-pencil-alt"></i> Enter Drawing Mode</>}
          </button>
        </div>
      </div>
      <div className="w-full h-full canvas-wrapper">
        <Canvas key={noteId} initialContent={note?.content} onContentChange={handleContentChange} />
      </div>
    </div>  );
};

export default NoteEditor;
