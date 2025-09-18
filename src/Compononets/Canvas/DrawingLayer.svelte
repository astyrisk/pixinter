<script lang="ts">
    import { onMount } from 'svelte';
    import { appStore } from "../../lib/stores/appStore";
    import { getPointerPosition } from "../../subroutines";
    import { Picture, DrawCommand, Point, CompoundCommand, ShapeCommand, FillCommand, TOOLENUM } from "../../types";
    import type { Config, Command } from "../../types"
    import { drawShape } from "../../lib/utils/drawing";
    import { get } from 'svelte/store';

    import { width, height } from "../../lib/config";

    const { config, pictureStore, commandHistory } = appStore;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let start: Point;
    let initialPicture: Picture;
    let commands: Command[] = [];
    let drawing: boolean = false;
    let dirty = true;

    pictureStore.subscribe(_ => {
        dirty = true;
    });

    onMount(() => {
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        function animate() {
            requestAnimationFrame(animate);
            if (!dirty) return;
            dirty = false;
            $pictureStore.redraw(ctx);
        }
        animate();
    });


    function drawPoint(p: Point, currentConfig: Config) {
        let color: string | null = currentConfig.color;
        if (currentConfig.tool === TOOLENUM.ERASER) {
            color = null; // Set to null for eraser
        }
        if (currentConfig.tool === TOOLENUM.ERASER) {
            let size = currentConfig.eraserSize ?? 1;
            let halfSize = Math.floor(size / 2);
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    let x = p.x - halfSize + i;
                    let y = p.y - halfSize + j;
                    $pictureStore.draw(new Point(x, y), color);
                }
            }
        } else {
            $pictureStore.draw(p, color);
        }
        dirty = true;
    }

    function pickColor(p: Point) {
        let selectedColor: string | null = pictureStore.getColor(p);

        config.update(n => ({
            ...n,
            color: selectedColor ?? n.color,
        }));
    }

    function handleMouseDown(event: MouseEvent) {
        if (event.button != 0) return;

        drawing = true;
        start = getPointerPosition(event, ctx.canvas);
        
        initialPicture = $pictureStore.copy();

        switch(get(config).tool) {
            case 'PICKER':
                pickColor(getPointerPosition(event, ctx.canvas));
                return;
            case 'FILL':
                pictureStore.fillColor(getPointerPosition(event, ctx.canvas), get(config)['color'], ctx);
                let command = new FillCommand(pictureStore, initialPicture, $pictureStore);
                commandHistory.execute(command);
                break;
            default:
                drawPoint(getPointerPosition(event, ctx.canvas), get(config));
        }
    }

    function handleContextMenu(event: MouseEvent) {
        if (!drawing) return;
        pictureStore.set(initialPicture);
        drawing = false;
        dirty = true;
    }

    function handleMove(event: MouseEvent) {
        if (!drawing) return;

        switch(get(config).tool) {
            case 'SHAPE':
                let current = getPointerPosition(event, ctx.canvas);
                let tempPicture = initialPicture.copy();
                drawShape(start, current, get(config)['color'], get(config)['strokeColor'], get(config)['strokeWidth'], ctx, tempPicture, event.shiftKey);
                pictureStore.set(tempPicture);
                dirty = true;
                break;
            case 'PICKER':
                break;
            default:
                drawPoint(getPointerPosition(event, ctx.canvas), get(config));
        }
    }

    function handleMouseUp(event: MouseEvent) {
        if (!drawing) return;
        drawing = false;

        if (get(config).tool === 'SHAPE') {
            let command = new ShapeCommand(pictureStore, initialPicture, $pictureStore);
            commandHistory.execute(command);
            initialPicture = null;
        } else {
            let command = new ShapeCommand(pictureStore, initialPicture, $pictureStore);
            commandHistory.execute(command);
            initialPicture = null;
        }
    }
</script>

<canvas id="canvas" bind:this={canvas} {width} {height} style="position: absolute; top: 0; left: 0; z-index: 2;" on:mousedown={handleMouseDown} on:mousemove={handleMove} on:mouseup={handleMouseUp} on:contextmenu|preventDefault|stopPropagation={handleContextMenu}></canvas>