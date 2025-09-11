import { writable } from "svelte/store"
import type { Picture } from "./types";
import type { Config } from "./types";
import { DEFAULT_STROKE_WIDTH, DEFAULT_ERASER_SIZE } from "./lib/constants";

let pictures: Picture[] = [];

const config = writable<Config>({color: "#000000", background_color: "#E1E3EA", tool: 'PEN', strokeColor: null, strokeWidth: DEFAULT_STROKE_WIDTH, eraserSize: DEFAULT_ERASER_SIZE});
const pictureHistory = writable<Picture[]>(pictures);

export { config, pictureHistory };