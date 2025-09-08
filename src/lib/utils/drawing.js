import { pictureStore } from "../stores/pictureStore";
import { getRadius } from "../../subroutines";
import { selectedShape } from "../stores/stores";
import { get } from "svelte/store";

export function drawRect(start, end, color, ctx, initialPicture, isSquare) {
    let xStart = Math.min(start.x, end.x);
    let yStart = Math.min(start.y, end.y);
    let xEnd   = Math.max(start.x, end.x);
    let yEnd   = Math.max(start.y, end.y);

    if (isSquare) {
        let width = xEnd - xStart;
        let height = yEnd - yStart;
        let size = Math.max(width, height);
        if (end.x < start.x) {
            xStart = start.x - size;
        } else {
            xEnd = xStart + size;
        }
        if (end.y < start.y) {
            yStart = start.y - size;
        } else {
            yEnd = yStart + size;
        }
    }
    let drawn  = [];

    for (let y = yStart; y < yEnd; y++)
        for (let x = xStart; x < xEnd; x++)
            drawn.push({x,y});

   initialPicture.drawPoints(drawn, color, ctx);
}

export function drawCircle(start, end, color, ctx, initialPicture) {
    let r = Math.ceil(getRadius(start, end));
    let drawn  = [];

    let xStart = start.x - r;
    let yStart = start.y - r;
    let xEnd   = start.x + r;
    let yEnd   = start.y + r;

    for (let y = yStart; y <= yEnd; y++)
        for (let x = xStart; x <= xEnd; x++)
            if (getRadius(start, {x, y}) <= r && x >= 0 && x < initialPicture.width && y >= 0 && y < initialPicture.height)
                drawn.push({x, y});

    initialPicture.drawPoints(drawn, color, ctx);
}

export function drawLine(start, end, color, ctx, initialPicture) {
    let x0 = start.x;
    let y0 = start.y;
    let x1 = end.x;
    let y1 = end.y;
    let drawn = [];

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while(true) {
        drawn.push({x: x0, y: y0});

        if ((x0 === x1) && (y0 === y1)) break;
        let e2 = 2 * err;
        if (e2 > -dy) { err -= dy; x0 += sx; }
        if (e2 < dx) { err += dx; y0 += sy; }
    }

    initialPicture.drawPoints(drawn, color, ctx);
}

export function drawShape(start, end, color, ctx, initialPicture, isSquare) {
    const shape = get(selectedShape);
    if (shape === 'rect') {
        drawRect(start, end, color, ctx, initialPicture, isSquare);
    } else if (shape === 'circle') {
        drawCircle(start, end, color, ctx, initialPicture);
    } else {
        drawLine(start, end, color, ctx, initialPicture);
    }
}