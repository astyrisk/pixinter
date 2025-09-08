<script lang="ts">

    import { onMount } from 'svelte';
	import { config } from "../stores";
	import { pictureStore } from "../lib/stores/pictureStore";
    import { commandHistory } from "../lib/stores/commandHistory";
    import { getPointerPosition } from "../subroutines";
    import { Picture, DrawCommand, Point, CompoundCommand, ShapeCommand, FillCommand } from "../types";
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

        config.update(n => ({
            ...n,
            color: selectedColor,
        }));
    }

    /* handling canvas */
    function handleMouseDown(event: MouseEvent, config: Config) {
        if (event.button != 0) return;
        if (event.shiftKey && (event.button === 0 || event.button === 2)) {
            event.preventDefault();
            pictureStore.set(initialPicture);
            drawing = false;
            return;
        }
 
         drawing = true;
         start = getPointerPosition(event, canvas);
        
        initialPicture = $pictureStore.copy();

        switch(config.tool) {
            case 'PICKER':
                pickColor(getPointerPosition(event, canvas));
                break;
            case 'FILL':
                pictureStore.fillColor(getPointerPosition(event, canvas), config['color'], ctx);
                let command = new FillCommand(pictureStore, initialPicture, $pictureStore);
                commandHistory.execute(command);
                break;
            default:
                drawPoint(getPointerPosition(event, canvas), config);
        }

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('contextmenu', handleContextMenu);
   }

    function handleContextMenu(event: MouseEvent) {
        event.preventDefault();
        pictureStore.set(initialPicture);
        drawing = false;

        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('contextmenu', handleContextMenu);
    }

    function handleMove(event: MouseEvent) {
        if (!drawing) return;

        switch($config.tool) {
            case 'SHAPE':
                let current = getPointerPosition(event, canvas);
                let tempPicture = initialPicture.copy();
                drawShape(start, current, $config['color'], null, tempPicture, event.shiftKey);
                pictureStore.set(tempPicture);
                break;
            default:
                drawPoint(getPointerPosition(event, canvas), $config);
        }
    }

    function handleMouseUp(event: MouseEvent) {
        drawing = false;

        if ($config.tool === 'SHAPE') {
            let command = new ShapeCommand(pictureStore, initialPicture, $pictureStore);
            commandHistory.execute(command);
            initialPicture = null;
        } else if (commands.length > 0) {
            commandHistory.execute(new CompoundCommand(commands));
            commands = [];
        }

        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('contextmenu', handleContextMenu);
    }


    /*********************************************************/
</script>

<canvas bind:this={canvas} id="canvas" width={width} height={height} style="border:1px solid #000; background-color: {backgroundColor}" on:mousedown={(e) => handleMouseDown(e, $config)} >  </canvas>
