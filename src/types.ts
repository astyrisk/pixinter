class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

const TOOLENUM = {
    PEN: 'PEN',
    ERASER: 'ERASER',
    FILL: 'FILL',
    PICKER: 'PICKER',
    SHAPE: 'SHAPE',
} as const;

type ObjectValues<T> = T[keyof T];
type ToolEnum = ObjectValues<typeof TOOLENUM>

interface Config {
    color: string | null,
    background_color: string,
    tool: ToolEnum,
    strokeColor: string | null,
    strokeWidth: number,
    eraserSize?: number,
    strokeShape: StrokeShapeEnum,
    showGrid: boolean,
}

const STROKE_SHAPE_ENUM = {
    CONTINUOUS: 'CONTINUOUS',
    DOTTED: 'DOTTED',
} as const;

type StrokeShapeEnum = ObjectValues<typeof STROKE_SHAPE_ENUM>;

interface Command {
    execute(): void;
    undo(): void;
}

class Picture {
    width: number;
    height: number;
    scale: number;
    pixels: (string | null)[][];

    constructor (width: number, height: number, scale: number) {
        this.width = width;
        this.height = height;
        this.scale = scale;

        this.pixels = new Array(height);
        for (let i = 0; i < height ; i++)
            this.pixels[i] = new Array(width).fill(null); // Initialize with null
    }

    setPixels(pixels: (string | null)[][], ctx: CanvasRenderingContext2D | null) {
        this.pixels = pixels;
        if (ctx) {
            this.redraw(ctx);
        }
    }

    getPixels() {
        let newPixels = new Array(this.height);
        for (let i = 0; i < this.height; i++) 
            newPixels[i] = this.pixels[i].slice();

        return newPixels;
    }

    redraw(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, this.width * this.scale, this.height * this.scale);
        for (let j = 0; j < this.height; j++)
            for (let i = 0; i < this.width; i++) {
                console.log(`Pixel at (${i}, ${j}): ${this.pixels[j][i]}`);
                if (this.pixels[j][i] !== null) { // Check for null instead of 'transparent'
                    ctx.fillStyle = this.pixels[j][i] as string;
                    ctx.fillRect(i * this.scale, j * this.scale, this.scale, this.scale);
                }
            }
    }

    draw(p: Point, color: string | null) {
        if (p.y < 0 || p.y >= this.height || p.x < 0 || p.x >= this.width) return;
        this.pixels[p.y][p.x] = color;
    }

    drawPoint(p: Point, color: string | null, ctx: CanvasRenderingContext2D | null) {
        if (p.y < 0 || p.y >= this.height || p.x < 0 || p.x >= this.width) return;
        this.pixels[p.y][p.x] = color;
        if (ctx && color !== null) { // Only draw if color is not null
            ctx.fillStyle = color;
            ctx.fillRect(p.x * this.scale, p.y * this.scale, this.scale, this.scale);
        } else if (ctx && color === null) { // Clear the rectangle if color is null
            ctx.clearRect(p.x * this.scale, p.y * this.scale, this.scale, this.scale);
        }
    }

    getColor(p: Point) : string | null {
        return this.pixels[p.y][p.x];
    }

    drawPoints(points: Point[], color: string | null, ctx: CanvasRenderingContext2D | null) {
        for (let {x, y} of points) {
            this.pixels[y][x] = color;
        }

        if (ctx && color !== null) {
            ctx.fillStyle = color;
            for (let {x, y} of points) {
                ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
            }
        } else if (ctx && color === null) {
            for (let {x, y} of points) {
                ctx.clearRect(x * this.scale, y * this.scale, this.scale, this.scale);
            }
        }
    }
    copy() {
        let newPic = new Picture(this.width, this.height, this.scale);
        newPic.pixels = this.getPixels();
        return newPic;
    }
}

class DrawCommand implements Command {
    point: Point;
    color: string | null;
    prevColor: string | null;
    picture: Picture;

    constructor(point: Point, color: string | null, picture: Picture) {
        this.point = point;
        this.color = color;
        this.picture = picture;
        this.prevColor = picture.getColor(point);
    }

    execute(): void {
        this.picture.drawPoint(this.point, this.color, null);
    }

    undo(): void {
        this.picture.drawPoint(this.point, this.prevColor, null);
    }
}

class CompoundCommand implements Command {
    commands: Command[];

    constructor(commands: Command[]) {
        this.commands = commands;
    }

    execute(): void {
        for (const command of this.commands) {
            command.execute();
        }
    }

    undo(): void {
        for (let i = this.commands.length - 1; i >= 0; i--) {
            this.commands[i].undo();
        }
    }
}

class ShapeCommand implements Command {
    pictureStore: any;
    initialPicturePixels: (string | null)[][];
    finalPicturePixels: (string | null)[][];

    constructor(pictureStore: any, initialPicture: Picture, finalPicture: Picture) {
        this.pictureStore = pictureStore;
        this.initialPicturePixels = initialPicture.getPixels();
        this.finalPicturePixels = finalPicture.getPixels();
    }

    execute(): void {
        this.pictureStore.setPixels(this.finalPicturePixels, null);
    }

    undo(): void {
        this.pictureStore.setPixels(this.initialPicturePixels, null);
    }
}
class FillCommand implements Command {
    pictureStore: any;
    initialPicturePixels: (string | null)[][];
    finalPicturePixels: (string | null)[][];

    constructor(pictureStore: any, initialPicture: Picture, finalPicture: Picture) {
        this.pictureStore = pictureStore;
        this.initialPicturePixels = initialPicture.getPixels();
        this.finalPicturePixels = finalPicture.getPixels();
    }

    execute(): void {
        this.pictureStore.setPixels(this.finalPicturePixels, null);
    }

    undo(): void {
        this.pictureStore.setPixels(this.initialPicturePixels, null);
    }
}

export {Picture, TOOLENUM, Point, DrawCommand, CompoundCommand, ShapeCommand, FillCommand, STROKE_SHAPE_ENUM};
export type {Config, ToolEnum, Command, StrokeShapeEnum};
