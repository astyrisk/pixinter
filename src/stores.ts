import { writable } from "svelte/store"
import type { Picture } from "./types";
import type { Config } from "./types";

let pictures: Picture[] = []; 

const config = writable<Config>({color: "#000000", background_color: "#E1E3EA", tool: 'PEN', strokeColor: '#000000', strokeWidth: 1, eraserSize: 1});
const pictureHistory = writable<Picture[]>(pictures);

export { config, pictureHistory };