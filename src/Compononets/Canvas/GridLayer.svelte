<script lang="ts">
    import { onMount } from 'svelte';
    import { width, height, scale } from "../../lib/config";

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    onMount(() => {
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        drawGrid();
    });

    function drawGrid() {
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;

        for (let i = 0; i < width; i += scale) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }

        for (let i = 0; i < height; i += scale) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
    }
</script>

<canvas bind:this={canvas} {width} {height} style="position: absolute; top: 0; left: 0; z-index: 1; pointer-events: none;"></canvas>