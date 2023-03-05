import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

const NotePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas>();

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
    setCanvas(canvas)

    return () => {
      canvas.dispose();
    };
  }, []);

  return (
    <div>
      <button onClick={() => {
        if (canvasRef.current) {
          canvas!.isDrawingMode = !canvas!.isDrawingMode;
        }
      }}>{canvas?.isDrawingMode ? 'Select' : 'Draw'}</button>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default NotePage;

