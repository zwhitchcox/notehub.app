import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CanvasState {
  canvas: any;
  isDrawingMode: boolean;
}

const initialState = {
  canvas: null as any,
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
    maximizeCanvas: (state) => {
      const canvas = state.canvas;
      if (!canvas) return;
      const main = getDimensions(document.querySelector('main') as HTMLElement);
      const sidebar = getDimensions(document.querySelector('#sidebar') as HTMLElement);
      const toolbar = getDimensions(document.querySelector('#toolbar') as HTMLElement);

      canvas.setDimensions({
        width: window.innerWidth - sidebar.width - main.margin.x - main.padding.x,
        height: window.innerHeight - main.margin.y - main.padding.y - toolbar.height - 10,
      });
      canvas.renderAll();
    },
  },
});

export const { setCanvas, toggleDrawingMode, maximizeCanvas } = canvasSlice.actions;
export default canvasSlice.reducer;
