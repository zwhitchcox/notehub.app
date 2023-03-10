import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { createCanvas, addPanning, maximizeCanvas } from './utils';
import React from 'react';

interface CanvasContextProps {
  canvas: fabric.Canvas | null;
  isDrawingMode: boolean;
  toggleDrawingMode: () => void;
  setDrawingMode: (value: boolean) => void;
  maximizeCanvas: () => void;
  setCanvas: (canvas: fabric.Canvas | null) => void;
}

export const FabricCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCanvas } = useCanvas();
  useEffect(() => {
    if (!(containerRef?.current)) {
      return
    }
    const canvasElement = document.createElement('canvas');
    containerRef.current.appendChild(canvasElement);
    const newCanvas = createCanvas(canvasElement);
    addPanning(newCanvas);
    setCanvas(newCanvas);
    return () => {
      newCanvas?.dispose();
      setCanvas(null);
      // eslint-disable-next-line
      containerRef.current?.removeChild(canvasElement);
    }
  }, [containerRef, setCanvas]);
  return <div ref={containerRef} />;
}

const CanvasContext = createContext<CanvasContextProps>({
  canvas: null,
  isDrawingMode: false,
  toggleDrawingMode: () => { },
  setDrawingMode: () => { },
  maximizeCanvas: () => { },
  setCanvas: () => { },
});

export const useCanvas = (): CanvasContextProps => {
  return useContext(CanvasContext);
};

interface CanvasProviderProps {
  children: React.ReactNode;
}

const CanvasProvider: React.FC<CanvasProviderProps> = ({ children }) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);

  const toggleDrawingMode = () => {
    if (canvas) {
      const newDrawingMode = !canvas.isDrawingMode;
      setIsDrawingMode(newDrawingMode);
      canvas.isDrawingMode = newDrawingMode;
    }
  };

  const setDrawingMode = (value: boolean) => {
    if (canvas) {
      canvas.isDrawingMode = value;
      setIsDrawingMode(value);
    }
  };

  const handleMaximizeCanvas = () => {
    if (canvas) {
      maximizeCanvas(canvas);
    }
  };

  const value = {
    canvas,
    isDrawingMode,
    toggleDrawingMode,
    setDrawingMode,
    maximizeCanvas: handleMaximizeCanvas,
    setCanvas,
  };

  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>;
};

export default CanvasProvider;

