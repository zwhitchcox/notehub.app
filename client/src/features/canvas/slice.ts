import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fabric } from 'fabric';
import store from '../../store';

export interface CanvasState {
  canvas: any;
  isDrawingMode: boolean;
}

const initialState = {
  canvas: createCanvas(),
  isDrawingMode: false,
};

const getDimensions = (el: HTMLElement) => {
  if (!el) return {
    padding: { y: 0, x: 0 },
    margin: { y: 0, x: 0 },
    width: 0,
    height: 0,
  }
  const style = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  return {
    padding: {
      y: parseInt(style.paddingTop) + parseInt(style.paddingBottom),
      x: parseInt(style.paddingLeft) + parseInt(style.paddingRight),
    },
    margin: {
      y: parseInt(style.marginTop) + parseInt(style.marginBottom),
      x: parseInt(style.marginLeft) + parseInt(style.marginRight),
    },
    width: rect.width,
    height: rect.height,
  };
}


const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setCanvas: (state, action: PayloadAction<any>) => {
      state.canvas = action.payload;
    },
    toggleDrawingMode: (state) => {
      if (state.canvas) {
        state.canvas.isDrawingMode = !state.canvas.isDrawingMode;
        state.isDrawingMode = state.canvas.isDrawingMode;
      }
    },
    setDrawingMode: (state, action: PayloadAction<boolean>) => {
      if (state.canvas) {
        state.canvas.isDrawingMode = action.payload;
        state.isDrawingMode = state.canvas.isDrawingMode;
      }
    },
    maximizeCanvas: (state) => {
      const main = getDimensions(document.querySelector('main') as HTMLElement);
      const sidebar = getDimensions(document.querySelector('#sidebar') as HTMLElement);
      const toolbar = getDimensions(document.querySelector('#toolbar') as HTMLElement);

      state.canvas.setDimensions({
        width: window.innerWidth - sidebar.width - main.margin.x - main.padding.x*2,
        height: window.innerHeight - main.margin.y - main.padding.y - toolbar.height - toolbar.padding.y - main.padding.y - 10,
      });
      const canvasWrapper = document.querySelector('#root-canvas-wrapper') as HTMLElement;
      if (canvasWrapper) {
        canvasWrapper.style.right = `${main.padding.x}px`;
        canvasWrapper.style.bottom = `${main.padding.y}px`;
        state.canvas.renderAll();
      }
    },
  },
});

function createCanvas() {
   const canvas = new fabric.Canvas('c', {
    backgroundColor: 'white',
    isDrawingMode: false,
  })
  addPanning(canvas);
  return canvas;
}

function addPanning(canvas: fabric.Canvas) {
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
    canvas.isDrawingMode = false;
    store.dispatch(setDrawingMode(false));
    canvas.selection = selection;
  });
}

export const { setCanvas, toggleDrawingMode, setDrawingMode, maximizeCanvas } = canvasSlice.actions;
export default canvasSlice.reducer;
