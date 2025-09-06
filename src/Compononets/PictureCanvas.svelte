<script lang="ts">
    //TODO rewrite the shapes (rectangle and circle);
    //TODO rewrite constants into one big object wrapped in a store, make it readable
    //TODO merge canvas and canvasHistory into one store
    //TODO in mousemove, and mouseclick, change only whenver there is a change in mouse position; track mouse position in a point variable

    import { onMount } from 'svelte';
	import { config, pictureHistory } from "../stores";
	import { pictureStore } from "../lib/stores/pictureStore";
    import { getPointerPosition } from "../subroutines";
    import { Picture } from "../types";
    import type { Point } from "../types";
    import type { Config } from "../types"
    import { drawCircle, drawRect } from "../lib/utils/drawing";
    import { width, height, backgroundColor } from "../lib/config";


    /* constants & HTMLElements */
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let start: Point;

    let drawingRect: boolean = false;
    let drawingCircle: boolean = false;

    onMount(() => {
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    function drawPoint(p: Point, config: Config) {
        switch(config.tool) {
            case 'PEN':
                pictureStore.drawPoint(p, config['color'], ctx);
                break;
            case 'ERASER':
                pictureStore.drawPoint(p, config['background_color'], ctx);
                break;
        }
    }

    function pickColor(p: Point) {
        let selectedColor: string = pictureStore.getColor(p);

        config.update(n => {
            n.color = selectedColor;
            return n;
        });
    }

    /* handling canvas */
    function handleClick(event: MouseEvent, config: Config) {
        if (event.button != 0) return;

        let newPic = new Picture(90, 60, 10);
        newPic.setPixels(pictureStore.getPixels());
        pictureHistory.update(history => [...history, newPic]);

        switch(config.tool) {
            case 'PICKER':
                pickColor(getPointerPosition(event, canvas));
                break;
            case 'FILL':
                pictureStore.fillColor(getPointerPosition(event, canvas), config['color'], ctx);
                break;
            case 'RECT':
                if (drawingRect) drawRect(start, getPointerPosition(event, canvas), config['color'], ctx);
                else start = getPointerPosition(event, canvas);
                drawingRect = !drawingRect;
                break;
            case 'CIRCLRE':
                if (drawingCircle) drawCircle(start, getPointerPosition(event, canvas), config['color'], ctx);
                else start = getPointerPosition(event, canvas);
                drawingCircle = !drawingCircle;
                break;
            default:
                drawPoint(getPointerPosition(event, canvas), config);
        }
   }

    function handleMove(event: MouseEvent, config: Config) {
        if (event.buttons == 0) return;

        let newPic = new Picture(90, 60, 10);
        newPic.setPixels(pictureStore.getPixels());
        pictureHistory.update(history => [...history, newPic]);

        switch(config.tool) {
            default:
                drawPoint(getPointerPosition(event, canvas), config);
        } 
    }


    /*********************************************************/
</script>

<canvas bind:this={canvas} id="canvas" width={width} height={height} style="border:1px solid #000; background-color: {backgroundColor}" on:click={(e) => handleClick(e, $config)} on:mousemove={(e) => handleMove(e, $config)}  >  </canvas>