import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/root';
import { addNote, Note, saveNotes } from '../features/notes';
import { updateNote } from '../features/notes';
import { maximizeCanvas, toggleDrawingMode } from '../features/canvas';
import useSocket from '../features/notes/use-socket';

interface Props {
  noteId: number;
}

// debounce the onContentChange function
const debounce = (func: any, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const NoteEditor: React.FC<Props> = ({ noteId }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState<string>('');
  const socket = useSocket(String(noteId))
  const note = useSelector((state: RootState) =>
    state.notes.notes.find((note: Note) => note.id === noteId)
  );
  const canvas = useSelector((state: RootState) => state.canvas);
  const [title, setTitle] = useState<string>(note?.title || '');

  const isDrawingMode = useSelector((state: RootState) => state.canvas.isDrawingMode);

  useLayoutEffect(() => {
    dispatch(maximizeCanvas());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (socket && noteId > 0) {
      socket.emit('noteTitle', {
        noteId,
        title: event.target.value,
      });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('noteContent', (data: string) => {
        setContent(content);
        canvas.canvas?.loadFromJSON(JSON.parse(data), () => {});
      });
      socket.on('noteTitle', (data: any) => {
        setTitle(data.title);
      });
      socket.on('error', (err: Error) => {
        console.error('Socket error:', err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, canvas.canvas])

  useEffect(() => {
    setTitle('');
    canvas.canvas.clear();
    // @ts-ignore
    canvas.canvas.setBackgroundColor('#ffffff');
    canvas.canvas.renderAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  const handleSave = () => {
    if (note) {
      dispatch(updateNote({
        id: note.id,
        title: title || note.title,
        content: content || note.content
      }));
    } else {
      dispatch(addNote({
        id: noteId,
        title,
        content
      }));
    }
    dispatch(saveNotes());
  };

  const handleToggleDrawingMode = () => {
    dispatch(toggleDrawingMode());
  }

  useLayoutEffect(() => {
    document.querySelector('#root-canvas-wrapper')?.classList.remove('hidden');
    const handleResize = () => {
      dispatch(maximizeCanvas());
    }
    window.addEventListener('resize', handleResize);
    return () => {
      document.querySelector('#root-canvas-wrapper')?.classList.add('hidden');
      window.removeEventListener('resize', handleResize);
    };
  })

  useEffect(() => {
    // define a function to save the canvas content
    const saveCanvas = debounce(() => {
      const content = JSON.stringify(canvas.canvas.toJSON());
      setContent(content);
      if (socket && noteId > 0) {
        socket.emit('noteContent', {
          noteId,
          content,
        });
      }
    }, 500);

    // add event listeners for all relevant events
    canvas.canvas.on('object:modified', saveCanvas);
    canvas.canvas.on('object:added', saveCanvas);
    canvas.canvas.on('object:removed', saveCanvas);
    canvas.canvas.on('path:created', saveCanvas);
    canvas.canvas.on('mouse:up', saveCanvas);
    canvas.canvas.on('text:changed', saveCanvas);
    canvas.canvas.on('selection:created', saveCanvas);
    canvas.canvas.on('selection:updated', saveCanvas);
    canvas.canvas.on('selection:cleared', saveCanvas);
    return () => {
      canvas.canvas.off('object:modified', saveCanvas);
      canvas.canvas.off('object:added', saveCanvas);
      canvas.canvas.off('object:removed', saveCanvas);
      canvas.canvas.off('path:created', saveCanvas);
      canvas.canvas.off('mouse:up', saveCanvas);
      canvas.canvas.off('text:changed', saveCanvas);
      canvas.canvas.off('selection:created', saveCanvas);
      canvas.canvas.off('selection:updated', saveCanvas);
      canvas.canvas.off('selection:cleared', saveCanvas);
    };
  }, [socket, canvas, noteId]);

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
    </div>  );
};

export default NoteEditor;
