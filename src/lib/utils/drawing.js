import { pictureStore } from "../stores/pictureStore";
import { getRadius } from "../../subroutines";

export function drawRect(start, end, color, ctx) {
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

export function drawCircle(start, end, color, ctx) {
    let r = Math.ceil(getRadius(start, end));
    let drawn  = [];

    let xStart = Math.min(start.x, end.x) - 2 * r;
    let yStart = Math.min(start.y, end.y) - 2 * r;
    let xEnd   = Math.max(start.x, end.x) + 2 * r;
    let yEnd   = Math.max(start.y, end.y) + 2 * r;

    for (let y = yStart; y < yEnd; y++) 
        for (let x = xStart; x < xEnd; x++)  
            if (getRadius(start, {x, y}) <= r) 
                drawn.push({x, y});

    pictureStore.drawPoints(drawn, color, ctx);
}