import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/root';
import { addNote, Note, saveNotes } from '../features/notes';
import { updateNote } from '../features/notes';
import { useSocket } from '../features/socket';
import { FabricCanvas, useCanvas } from '../features/canvas';

interface Props {
  noteId: number;
}
const noop = () => {};

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
  const note = useSelector((state: RootState) =>
    state.notes.notes.find((note: Note) => note.id === noteId)
  );
  const { emit, socket } = useSocket();
  const [title, setTitle] = useState<string>(note?.title || '');
  const { maximizeCanvas, isDrawingMode, canvas, toggleDrawingMode } = useCanvas();


  useEffect(() => {
    socket?.emit('join', String(noteId));
    return () => {
      socket?.emit('leave', noteId);
    }
  }, [noteId, socket]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (noteId > 0) {
      emit('noteTitle', {
        noteId,
        title: event.target.value,
      });
    }
  };

  useEffect(() => {
    const handlers: { [eventName: string]: (...args: any[]) => void } = {
      noteContent: (data: string) => {
        const content = JSON.parse(data);
        setContent(content);
        canvas?.loadFromJSON(content, noop);
      },
      noteTitle: (data: any) => {
        setTitle(data.title);
      },
      error: (err: Error) => {
        console.error('Socket error:', err);
      },
    };

    if (socket) {
      for (const [eventName, handler] of Object.entries(handlers)) {
        socket.on(eventName, handler);
      }
    }

    return () => {
      if (socket) {
        for (const [eventName, handler] of Object.entries(handlers)) {
          socket.off(eventName, handler);
        }
      }
    };
  }, [socket, canvas]);

  useEffect(() => {
    setTitle('');
    canvas?.clear();
    canvas?.setBackgroundColor('#ffffff', noop);
    canvas?.renderAll();
  }, [noteId, canvas]);

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
    toggleDrawingMode();
  }

  // show/hide canvas. we never destroy it.
  useLayoutEffect(() => {
    document.querySelector('#root-canvas-wrapper')?.classList.remove('hidden');
    window.addEventListener('resize', maximizeCanvas);
    setTimeout(maximizeCanvas, 100);
    return () => {
      document.querySelector('#root-canvas-wrapper')?.classList.add('hidden');
      window.removeEventListener('resize', maximizeCanvas);
    };
  })

  useEffect(() => {
    // define a function to save the canvas content
    const saveCanvas = debounce(() => {
      const content = JSON.stringify(canvas?.toJSON());
      setContent(content);
      if (socket && noteId > 0) {
        emit('noteContent', {
          noteId,
          content,
        });
      }
    }, 500);

    const events = [
      'object:modified',
      'object:added',
      'object:removed',
      'path:created',
      'text:changed',
    ];
    //
    // add event listeners for all relevant events
    for (const event of events) {
      canvas?.on(event, saveCanvas);
    }

    return () => {
      for (const event of events) {
        canvas?.off(event, saveCanvas);
      }
    };
  }, [socket, canvas, noteId, emit]);

  return (
    <div>
      <div id="toolbar" className="flex items-center justify-between mb-4">
        <div>
          <label htmlFor="title" className="mr-4">Title:</label>
          <input type="text" id="title" value={title || note?.title || ''} onChange={handleTitleChange} className="border rounded px-2 py-1" />
        </div>
        <div>
          <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
            <i className="fas fa-save"></i>&nbsp; Save Note
          </button>
          <button onClick={handleToggleDrawingMode} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {isDrawingMode ? <><i className="fas fa-mouse-pointer"></i>&nbsp; Select</> : <><i className="fas fa-pencil-alt"></i> Draw</>}
          </button>
        </div>
      </div>
      <FabricCanvas />
    </div>  
  );
};

export default NoteEditor;
