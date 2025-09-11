import { writable, get } from 'svelte/store';
import { Picture } from '../../types';
import { SCALE, DEFAULT_STROKE_WIDTH, DEFAULT_ERASER_SIZE, DEFAULT_STROKE_SHAPE } from '../constants';
import type { Config } from '../../types';

function createPictureStore() {
  const store = writable(new Picture(90, 60, SCALE));
  const { subscribe, set, update } = store;

  return {
    subscribe,
    set,
    update,

    drawPoint(p, color, ctx) {
      update(picture => {
        picture.drawPoint(p, color, ctx);
        return picture;
      });
    },

    drawPoints(points, color, ctx) {
      update(picture => {
        picture.drawPoints(points, color, ctx);
        return picture;
      });
    },

    getColor(p) {
      return get(store).getColor(p);
    },

    fillColor(point, color, ctx) {
      update(picture => {
        const around = [{dx: -1, dy: 0}, {dx: 1, dy: 0},
                        {dx: 0, dy: -1}, {dx: 0, dy: 1}];
        let targetColor = picture.getColor(point);
        let drawn = [point];
 
        for (let done = 0; done < drawn.length; done++){
            for (let {dx, dy} of around) {
                let x = drawn[done].x + dx, y =  drawn[done].y + dy;
                if (x >= 0 && x < picture.width &&
                    y >= 0 && y < picture.height &&
                    picture.getColor({x,y}) == targetColor &&
                    !drawn.some(p => p.x == x && p.y == y)) {
                    drawn.push({x, y});
                }
            }
        }
        picture.drawPoints(drawn, color, ctx);
        return picture;
      });
    },

    getPixels() {
      return get(store).getPixels();
    },

    setPixels(pixels, ctx) {
      update(picture => {
        picture.setPixels(pixels, ctx);
        return picture;
      });
    }
  };
}

function createCommandHistory(pictureStore) {
  const { subscribe, set, update } = writable({
    undoStack: [],
    redoStack: [],
  });

  return {
    subscribe,
    execute: (command) => {
      update((history) => {
        console.log("Executing command:", command);
        pictureStore.update((p) => p);
        return {
          undoStack: [...history.undoStack, command],
          redoStack: [],
        };
      });
    },
    undo: () => {
      update((history) => {
        const command = history.undoStack.pop();
        if (command) {
          command.undo();
          pictureStore.update(p => p);
          return {
            ...history,
            redoStack: [...history.redoStack, command],
          };
        }
        return history;
      });
    },
    redo: () => {
      update((history) => {
        const command = history.redoStack.pop();
        if (command) {
          command.execute();
          pictureStore.update(p => p);
          return {
            ...history,
            undoStack: [...history.undoStack, command],
          };
        }
        return history;
      });
    },
  };
}

export const pictureStore = createPictureStore();
const commandHistory = createCommandHistory(pictureStore);

export const config = writable<Config>({
    color: "#000000",
    background_color: "#E1E3EA",
    tool: 'PEN',
    strokeColor: null,
    strokeWidth: DEFAULT_STROKE_WIDTH,
    eraserSize: DEFAULT_ERASER_SIZE,
    strokeShape: DEFAULT_STROKE_SHAPE,
    showGrid: false
});

const pictureHistory = writable<Picture[]>([]);
export const selectedShape = writable('rect');

export const appStore = {
    config,
    pictureHistory,
    selectedShape,
    pictureStore,
    commandHistory
};