import { pictureStore } from "../stores/pictureStore";
import { getRadius } from "../../subroutines";
import { selectedShape } from "../stores/stores";
import { get } from "svelte/store";

export function drawRect(start, end, color, ctx, initialPicture) {
    pictureStore.setPixels(initialPicture.getPixels(), ctx);

    let xStart = Math.min(start.x, end.x);
    let yStart = Math.min(start.y, end.y);
    let xEnd   = Math.max(start.x, end.x);
    let yEnd   = Math.max(start.y, end.y);
    let drawn  = [];

    for (let y = yStart; y < yEnd; y++)
        for (let x = xStart; x < xEnd; x++)
            drawn.push({x,y});

   pictureStore.drawPoints(drawn, color, ctx);
}

export function drawCircle(start, end, color, ctx, initialPicture) {
    pictureStore.setPixels(initialPicture.getPixels(), ctx);

    let r = Math.ceil(getRadius(start, end));
    let drawn  = [];

    let xStart = start.x - r;
    let yStart = start.y - r;
    let xEnd   = start.x + r;
    let yEnd   = start.y + r;

    for (let y = yStart; y <= yEnd; y++)
        for (let x = xStart; x <= xEnd; x++)
            if (getRadius(start, {x, y}) <= r)
                drawn.push({x, y});

    pictureStore.drawPoints(drawn, color, ctx);
}

export function drawShape(start, end, color, ctx, initialPicture) {
    const shape = get(selectedShape);
    if (shape === 'rect') {
        drawRect(start, end, color, ctx, initialPicture);
    } else {
        drawCircle(start, end, color, ctx, initialPicture);
    }
}