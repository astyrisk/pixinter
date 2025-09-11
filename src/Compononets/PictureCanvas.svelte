<script lang="ts">

    import { onMount } from 'svelte';
	import { config } from "../stores";
	import { pictureStore } from "../lib/stores/pictureStore";
	   import { commandHistory } from "../lib/stores/commandHistory";
	   import { getPointerPosition } from "../subroutines";
	   import { Picture, DrawCommand, Point, CompoundCommand, ShapeCommand, FillCommand, TOOLENUM } from "../types";
	   import type { Config, Command } from "../types"
	   import { drawShape } from "../lib/utils/drawing";
	   import { width, height, backgroundColor } from "../lib/config";
	   import { get } from 'svelte/store'; // Import get


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
	       if ($config.showGrid) {
	           drawGrid();
	       }
	   }

	   function drawPoint(p: Point, currentConfig: Config) {
	       let color: string | null = currentConfig.color;
	       if (currentConfig.tool === TOOLENUM.ERASER) {
	           color = null; // Set to null for eraser
	       }
	       if (currentConfig.tool === TOOLENUM.ERASER) {
	           let size = currentConfig.eraserSize ?? 1;
	           let halfSize = Math.floor(size / 2);
	           let points = [];
	           for (let i = 0; i < size; i++) {
	               for (let j = 0; j < size; j++) {
	                   let x = p.x - halfSize + i;
	                   let y = p.y - halfSize + j;
	                   points.push(new Point(x, y));
	               }
	           }
	           let drawCommands = points.map(point => new DrawCommand(point, color, $pictureStore));
	           let command = new CompoundCommand(drawCommands);
	           command.execute();
	           commands.push(command);
	       } else {
	           let command = new DrawCommand(p, color, $pictureStore);
	           command.execute();
	           commands.push(command);
	       }
	       pictureStore.update(p => p);
	   }

	   function pickColor(p: Point) {
	       let selectedColor: string | null = pictureStore.getColor(p);
	
	       config.update(n => ({ // Use config.update directly
	           ...n,
	           color: selectedColor ?? n.color, // Use existing color if selectedColor is null
	       }));
	   }
	
	   function drawGrid() {
	       ctx.strokeStyle = '#ccc';
	       ctx.lineWidth = 1;
	
	       for (let i = 0; i < width; i += 10) {
	           ctx.beginPath();
	           ctx.moveTo(i, 0);
	           ctx.lineTo(i, height);
	           ctx.stroke();
	       }
	
	       for (let i = 0; i < height; i += 10) {
	           ctx.beginPath();
	           ctx.moveTo(0, i);
	           ctx.lineTo(width, i);
	           ctx.stroke();
	       }
	   }
	
	   /* handling canvas */
	   function handleMouseDown(event: MouseEvent) {
	       if (event.button != 0) return;
	
	       drawing = true;
	       start = getPointerPosition(event, canvas);
	       
	       initialPicture = $pictureStore.copy();
	
	       switch(get(config).tool) { // Use get(config).tool
	           case 'PICKER':
	               pickColor(getPointerPosition(event, canvas));
	               break;
	           case 'FILL':
	               pictureStore.fillColor(getPointerPosition(event, canvas), get(config)['color'], ctx); // Use get(config)['color']
	               let command = new FillCommand(pictureStore, initialPicture, $pictureStore);
	               commandHistory.execute(command);
	               break;
	           default:
	               drawPoint(getPointerPosition(event, canvas), get(config)); // Use get(config)
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

	       switch(get(config).tool) { // Use get(config).tool
	           case 'SHAPE':
	               let current = getPointerPosition(event, canvas);
	               let tempPicture = initialPicture.copy();
	               drawShape(start, current, get(config)['color'], get(config)['strokeColor'], get(config)['strokeWidth'], null, tempPicture, event.shiftKey); // Use get(config)
	               pictureStore.set(tempPicture);
	               break;
	           default:
	               drawPoint(getPointerPosition(event, canvas), get(config)); // Use get(config)
	       }
	   }

	   function handleMouseUp(event: MouseEvent) {
	       if (!drawing) return;
	       drawing = false;

	       if (get(config).tool === 'SHAPE') { // Use get(config).tool
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

<canvas bind:this={canvas} id="canvas" width={width} height={height} style="border:1px solid #000; background-color: {backgroundColor}" on:mousedown={handleMouseDown}>  </canvas>
<svelte:window on:mousemove={handleMove} on:mouseup={handleMouseUp} on:contextmenu|preventDefault|stopPropagation={handleContextMenu} on:keydown={handleKeyDown} />
