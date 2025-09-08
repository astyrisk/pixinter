import { writable } from 'svelte/store';
import { pictureStore } from './pictureStore';

function createCommandHistory() {
  const { subscribe, set, update } = writable({
    undoStack: [],
    redoStack: [],
  });

  return {
    subscribe,
    execute: (command) => {
      update((history) => {
        if (command.setFinalPixels) {
          command.setFinalPixels();
        }
        command.execute();
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

export const commandHistory = createCommandHistory();