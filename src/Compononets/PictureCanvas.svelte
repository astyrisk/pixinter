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
    import type { ModuleCompileOptions } from 'svelte/compiler';


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
   }


    function handleContextMenu(event: MouseEvent) {
        if (!drawing) return;
        pictureStore.set(initialPicture);
        drawing = false;
    }

    function handleKeyDown(event: KeyboardEvent) {
        // 
    }


    function handleMove(event: MouseEvent) {
        if (!drawing) return;

        switch($config.tool) {
            case 'SHAPE':
                let current = getPointerPosition(event, canvas);
                let tempPicture = initialPicture.copy();
                drawShape(start, current, $config['color'], $config['strokeColor'], $config['strokeWidth'], null, tempPicture, event.shiftKey);
                pictureStore.set(tempPicture);
                break;
            default:
                drawPoint(getPointerPosition(event, canvas), $config);
        }
    }

    function handleMouseUp(event: MouseEvent) {
        if (!drawing) return;
        drawing = false;

        if ($config.tool === 'SHAPE') {
            let command = new ShapeCommand(pictureStore, initialPicture, $pictureStore);
            commandHistory.execute(command);
            initialPicture = null;
        } else if (commands.length > 0) {
            commandHistory.execute(new CompoundCommand(commands));
            commands = [];
        }
    }


    /*********************************************************/
</script>

<canvas bind:this={canvas} id="canvas" width={width} height={height} style="border:1px solid #000; background-color: {backgroundColor}" on:mousedown={(e) => handleMouseDown(e, $config)}>  </canvas>
<svelte:window on:mousemove={handleMove} on:mouseup={handleMouseUp} on:contextmenu|preventDefault|stopPropagation={handleContextMenu} on:keydown={handleKeyDown} />