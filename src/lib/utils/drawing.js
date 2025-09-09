import { pictureStore } from "../stores/pictureStore";
import { getRadius } from "../../subroutines";
import { selectedShape } from "../stores/stores";
import { get } from "svelte/store";

export function drawRect(start, end, color, strokeColor, strokeWidth, ctx, initialPicture, isSquare) {
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
    let stroke = [];

    for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
            if (x >= xStart && x < xEnd && y >= yStart && y < yEnd) {
                if (x < xStart + strokeWidth || x >= xEnd - strokeWidth || y < yStart + strokeWidth || y >= yEnd - strokeWidth) {
                    stroke.push({x,y});
                } else {
                    drawn.push({x,y});
                }
            }
        }
    }

   initialPicture.drawPoints(drawn, color, ctx);
   initialPicture.drawPoints(stroke, strokeColor, ctx);
}

export function drawEllipse(start, end, color, strokeColor, strokeWidth, ctx, initialPicture, isCircle) {
    let rx = Math.abs(end.x - start.x);
    let ry = Math.abs(end.y - start.y);

    if (isCircle) {
        let r = Math.max(rx, ry);
        rx = r;
        ry = r;
    }

    let drawn = [];
    let stroke = [];

    let xStart = start.x - rx;
    let yStart = start.y - ry;
    let xEnd = start.x + rx;
    let yEnd = start.y + ry;

    for (let y = yStart; y <= yEnd; y++) {
        for (let x = xStart; x <= xEnd; x++) {
            if (
                (Math.pow(x - start.x, 2) / Math.pow(rx, 2)) +
                (Math.pow(y - start.y, 2) / Math.pow(ry, 2)) <= 1 &&
                x >= 0 && x < initialPicture.width && y >= 0 && y < initialPicture.height
            ) {
                let isStroke = false;
                if (rx > strokeWidth && ry > strokeWidth) {
                    if (
                        (Math.pow(x - start.x, 2) / Math.pow(rx - strokeWidth, 2)) +
                        (Math.pow(y - start.y, 2) / Math.pow(ry - strokeWidth, 2)) > 1
                    ) {
                        isStroke = true;
                    }
                } else {
                    isStroke = true;
                }

                if (isStroke) {
                    stroke.push({ x, y });
                } else {
                    drawn.push({ x, y });
                }
            }
        }
    }

    initialPicture.drawPoints(drawn, color, ctx);
    initialPicture.drawPoints(stroke, strokeColor, ctx);
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

export function drawShape(start, end, color, strokeColor, strokeWidth, ctx, initialPicture, isConstrained) {
    const shape = get(selectedShape);
    if (shape === 'rect') {
        drawRect(start, end, color, strokeColor, strokeWidth, ctx, initialPicture, isConstrained);
    } else if (shape === 'circle') {
        drawEllipse(start, end, color, strokeColor, strokeWidth, ctx, initialPicture, isConstrained);
    } else {
        drawLine(start, end, color, ctx, initialPicture);
    }
}