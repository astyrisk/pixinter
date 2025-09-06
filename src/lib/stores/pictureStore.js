import { writable, get } from 'svelte/store';
import { Picture } from '../../types';

function createPictureStore() {
  const { subscribe, set, update } = writable(new Picture(90, 60, 10));

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
      return get(this).getColor(p);
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
      return get(this).getPixels();
    },

    setPixels(pixels) {
      update(picture => {
        picture.setPixels(pixels);
        return picture;
      });
    }
  };
}

export const pictureStore = createPictureStore();