import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useDispatch, useSelector } from 'react-redux';
import { addNoteAction, updateNoteAction } from '../store/notes';
import { Note, RootState } from '../store/types';
import { useParams } from 'react-router-dom';

const NotePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const dispatch = useDispatch();
  const { noteId } = useParams<{ noteId: string }>(); // Retrieve noteId parameter from URL
  const notes = useSelector((state: RootState) => state.notes.notes);
  const note = notes.find((note) => note.id.toString() === noteId); // Find note with matching ID

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, {
      backgroundColor: 'white',
    });

    // Add event listener for panning
    let isDragging = false;
    let selection = false;
    let lastPosX = 0;
    let lastPosY = 0;
    canvas.on('mouse:down', (evt) => {
      if (evt.e.altKey) {
        selection = canvas.selection as boolean;
        canvas.selection = false;
        isDragging = true;
        lastPosX = evt.e.clientX;
        lastPosY = evt.e.clientY;
      }
    });
    canvas.on('mouse:move', (evt) => {
      if (isDragging) {
        const delta = new fabric.Point(
          evt.e.clientX - lastPosX,
          evt.e.clientY - lastPosY
        );
        canvas.relativePan(delta);
        lastPosX = evt.e.clientX;
        lastPosY = evt.e.clientY;
      }
    });
    canvas.on('mouse:up', () => {
      isDragging = false;
      canvas.selection = selection;
    });

    // Load note content into canvas
    if (note?.content) {
      canvas.loadFromJSON(note.content, () => {
        canvas.renderAll();
      });
    }
    setCanvas(canvas);

    return () => {
      canvas.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveNote = () => {
    if (canvasRef.current) {
      if (noteId === "new") {
        const title = window.prompt('Enter note title:');
        if (title) {
          const note: Note = {
            id: Date.now(),
            title,
            content: canvas!.toJSON() as unknown as string,
          };
          dispatch(addNoteAction(note));
        }
      } else {
        const editedNote: Note = {
          id: note!.id as number,
          title: note!.title,
          content: canvas!.toJSON() as unknown as string,
        };
        dispatch(updateNoteAction(editedNote));
      }
    }
  };
  return (
    <div>
      <button onClick={() => {
        if (canvasRef.current) {
          canvas!.isDrawingMode = !canvas!.isDrawingMode;
        }
      }}>{canvas?.isDrawingMode ? 'Select' : 'Draw'}</button>
      <button onClick={saveNote}>Save Note</button>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default NotePage;

