<script lang="ts">
    //TODO rewrite the shapes (rectangle and circle);
    //TODO rewrite constants into one big object wrapped in a store, make it readable
    //TODO merge canvas and canvasHistory into one store
    //TODO in mousemove, and mouseclick, change only whenver there is a change in mouse position; track mouse position in a point variable

    import { onMount } from 'svelte';
	import { config } from "../stores";
	import { pictureStore } from "../lib/stores/pictureStore";
    import { commandHistory } from "../lib/stores/commandHistory";
    import { getPointerPosition } from "../subroutines";
    import { Picture, DrawCommand, Point, CompoundCommand, ShapeCommand } from "../types";
    import type { Config, Command } from "../types"
    import { drawShape } from "../lib/utils/drawing";
    import { width, height, backgroundColor } from "../lib/config";


    /* constants & HTMLElements */
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let start: Point;
    let initialPicture: Picture;
    let commands: Command[] = [];

    let drawing: boolean = false;

    onMount(() => {
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    });
    $: if (ctx && $pictureStore) {
        $pictureStore.redraw(ctx);
    }

    function drawPoint(p: Point, config: Config) {
        let color = config.tool === 'ERASER' ? config.background_color : config.color;
        let command = new DrawCommand(p, color, $pictureStore);
        command.execute();
        commands.push(command);
        pictureStore.update(p => p);
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

        drawing = true;
        start = getPointerPosition(event, canvas);
        
        initialPicture = $pictureStore.copy();

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
            case 'SHAPE':
                let current = getPointerPosition(event, canvas);
                let tempPicture = initialPicture.copy();
                drawShape(start, current, config['color'], ctx, tempPicture);
                pictureStore.set(tempPicture);
                break;
            default:
                drawPoint(getPointerPosition(event, canvas), config);
        }
    }

    function handleMouseUp(event: MouseEvent, config: Config) {
        drawing = false;

        if (config.tool === 'SHAPE') {
            let command = new ShapeCommand(pictureStore, initialPicture);
            commandHistory.execute(command);
            initialPicture = null;
        } else if (commands.length > 0) {
            commandHistory.execute(new CompoundCommand(commands));
            commands = [];
        }
    }


    /*********************************************************/
</script>

<canvas bind:this={canvas} id="canvas" width={width} height={height} style="border:1px solid #000; background-color: {backgroundColor}" on:mousedown={(e) => handleMouseDown(e, $config)} on:mousemove={(e) => handleMove(e, $config)} on:mouseup={(e) => handleMouseUp(e, $config)} >  </canvas>