import { pictureStore } from './stores/pictureStore';
import { Picture } from '../types';
import type { Command } from '../types';

export class ClearAllCommand implements Command {
    private originalPicture: Picture;
    private newPicture: Picture;

    constructor(private pic: Picture) {
        this.originalPicture = pic.copy();
        this.newPicture = new Picture(pic.width, pic.height, pic.scale);
    }

    execute(): void {
        pictureStore.update(_ => this.newPicture);
    }

    undo(): void {
        pictureStore.update(_ => this.originalPicture);
    }
}