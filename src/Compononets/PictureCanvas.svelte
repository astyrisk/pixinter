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

    let drawing: boolean = false;

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
    function handleMouseDown(event: MouseEvent, config: Config) {
        if (event.button != 0) return;

        let newPic = new Picture(90, 60, 10);
        newPic.setPixels(pictureStore.getPixels(), ctx);
        pictureHistory.update(history => [...history, newPic]);

        drawing = true;
        start = getPointerPosition(event, canvas);

        switch(config.tool) {
            case 'PICKER':
                pickColor(getPointerPosition(event, canvas));
                break;
            case 'FILL':
                pictureStore.fillColor(getPointerPosition(event, canvas), config['color'], ctx);
                break;
            default:
                drawPoint(getPointerPosition(event, canvas), config);
        }
   }

    function handleMove(event: MouseEvent, config: Config) {
        if (!drawing) return;

        switch(config.tool) {
            case 'RECT':
                drawRect(start, getPointerPosition(event, canvas), config['color'], ctx);
                break;
            case 'CIRCLRE':
                drawCircle(start, getPointerPosition(event, canvas), config['color'], ctx);
                break;
            default:
                drawPoint(getPointerPosition(event, canvas), config);
        }
    }

    function handleMouseUp(event: MouseEvent, config: Config) {
        drawing = false;
    }


    /*********************************************************/
</script>

<canvas bind:this={canvas} id="canvas" width={width} height={height} style="border:1px solid #000; background-color: {backgroundColor}" on:mousedown={(e) => handleMouseDown(e, $config)} on:mousemove={(e) => handleMove(e, $config)} on:mouseup={(e) => handleMouseUp(e, $config)} >  </canvas>