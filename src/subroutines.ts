//DONE

import type  { Point } from "./types";
import { SCALE } from "./lib/constants";

function elt(type, props, ...children) {
  let dom = document.createElement(type);

  if (props) 
   Object.assign(dom, props);

  for (let child of children) {
    if (typeof child != "string")
     dom.appendChild(child);
    else
     dom.appendChild(document.createTextNode(child));
  }

  return dom;
}

function getPointerPosition(p: MouseEvent, domNode: HTMLCanvasElement): Point {
    let rect = domNode.getBoundingClientRect();
    let x = Math.floor((p.clientX - rect.left) / SCALE);
    let y = Math.floor((p.clientY - rect.top) / SCALE);

    // Clamp the coordinates to the canvas boundaries
    x = Math.max(0, Math.min(x, domNode.width / SCALE));
    y = Math.max(0, Math.min(y, domNode.height / SCALE));

    return { x, y };
}

function getRadius(x: Point, y: Point): number {
  return Math.sqrt(Math.pow(x.x - y.x, 2) + Math.pow(x.y - y.y, 2));
}

function getClassName(target: EventTarget | any) : string {
    return  (target.classList[0]);
}

export {elt, getPointerPosition, getRadius, getClassName};
