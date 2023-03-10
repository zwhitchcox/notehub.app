import { fabric } from 'fabric';

export function getDimensions(el: HTMLElement) {
  if (!el) {
    return {
      padding: { y: 0, x: 0 },
      margin: { y: 0, x: 0 },
      width: 0,
      height: 0,
    };
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

export function addPanning(canvas: fabric.Canvas) {
  // Add event listener for panning
  let isDragging = false;
  let selection = false;
  let lastPosX = 0;
  let lastPosY = 0;
  let wasDrawing: boolean;

  canvas.on('mouse:down', (evt) => {
    if (evt.e.altKey) {
      selection = canvas.selection as boolean;
      canvas.selection = false;
      isDragging = true;
      lastPosX = evt.e.clientX;
      lastPosY = evt.e.clientY;
      wasDrawing = Boolean(canvas.isDrawingMode);
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
    if (isDragging) {
      isDragging = false;
      canvas.isDrawingMode = wasDrawing;
      canvas.selection = selection;
    }
  });
}

export function createCanvas(el: HTMLCanvasElement) {
  const main = getDimensions(document.querySelector('main') as HTMLElement);
  const toolbar = getDimensions(document.querySelector('#toolbar') as HTMLElement);
  const width = main.width - main.padding.x;
  const height = main.height - main.padding.x - toolbar.height - toolbar.margin.y;
  const canvas = new fabric.Canvas(el || 'c', {
    backgroundColor: 'white',
    isDrawingMode: false,
    width, 
    height,
  });
  return canvas;
}

export function maximizeCanvas(canvas: fabric.Canvas) {
  const main = getDimensions(document.querySelector('main') as HTMLElement);
  const sidebar = getDimensions(document.querySelector('#sidebar') as HTMLElement);
  const toolbar = getDimensions(document.querySelector('#toolbar') as HTMLElement);
  const width = window.innerWidth - sidebar.width - main.margin.x - main.padding.x
  const height = window.innerHeight -
    main.margin.y -
    main.padding.y -
    toolbar.height -
    toolbar.padding.y -
    10;

  canvas.setDimensions({ width, height });
  canvas.renderAll();
}
