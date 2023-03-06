import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fabric } from 'fabric';
import { maximizeCanvas, setCanvas } from '../features/canvas/slice';

interface Props {
  initialContent?: string;
  onContentChange: (content: string) => void;
}

const Canvas: React.FC<Props> = ({ initialContent, onContentChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!canvasRef?.current) return;

    const canvas = new fabric.Canvas("c", {
      backgroundColor: 'white',
      isDrawingMode: false,
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


    if (initialContent) {
      canvas.loadFromJSON(initialContent, () => {});
    }

   if (onContentChange) {
      // debounce the onContentChange function
      const debounce = (func: any, delay: number) => {
        let timer: ReturnType<typeof setTimeout>;
        return (...args: any) => {
          clearTimeout(timer);
          timer = setTimeout(() => func(...args), delay);
        };
      };

      // define a function to save the canvas content
      const saveCanvas = () => {
        const json = canvas.toJSON() as unknown as string;
        onContentChange(json);
      };

      // add event listeners for all relevant events
      canvas.on('object:modified', debounce(saveCanvas, 500));
      canvas.on('object:added', debounce(saveCanvas, 500));
      canvas.on('object:removed', debounce(saveCanvas, 500));
      canvas.on('path:created', debounce(saveCanvas, 500));
      canvas.on('mouse:up', debounce(saveCanvas, 500));
      canvas.on('text:changed', debounce(saveCanvas, 500));
      canvas.on('selection:created', debounce(saveCanvas, 500));
      canvas.on('selection:updated', debounce(saveCanvas, 500));
      canvas.on('selection:cleared', debounce(saveCanvas, 500));
    }
    // Save canvas instance to state
    dispatch(setCanvas(canvas));

    const handleResize = () => {
      dispatch(maximizeCanvas());
    }
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup function to remove listeners and dispose canvas
    return () => {
      try {
        console.log('disposing canvas -- Canvas.tsx');
        canvas?.dispose();
      } catch (err) {
        console.log("couldn't dispose canvas -- Canvas.tsx");
      }
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line
  }, []);

  return <canvas ref={canvasRef} id="c" />;
};

export default Canvas;

