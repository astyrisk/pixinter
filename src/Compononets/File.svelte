<script lang="ts">
    import { appStore } from '../lib/stores/appStore';
 import { Picture } from '../types';
 import { SCALE } from '../lib/constants';
    import { ClearAllCommand } from '../lib/ClearAllCommand';
    import { get } from 'svelte/store';
    
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let fileInput: HTMLInputElement;
   
    function toggleGrid() {
    	appStore.config.update(c => ({...c, showGrid: !c.showGrid}));
    }
   
    function handleSave() {
    	const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
    	if(canvas) {
    		let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    		window.location.href=image;
    	}
    }

    function handleLoadClick() {
        fileInput.click();
    }

    function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        if (!target.files) return;
        const file = target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.onload = async () => {
                const mainCanvas = document.querySelector("#canvas") as HTMLCanvasElement;
                if (!mainCanvas) return;
                const mainCtx = mainCanvas.getContext("2d");
                if (!mainCtx) return;

                const pixels = await pictureFromImage(image);
                const newPic = new Picture(pixels.length, pixels[0].length, SCALE);
                newPic.setPixels(pixels, mainCtx);
                appStore.pictureStore.update(_ => newPic);
                appStore.pictureStore.subscribe(p => p.redraw(mainCtx))();
            };
            image.src = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    async function pictureFromImage(image: HTMLImageElement): Promise<string[][]> {
        const width = Math.min(90, image.width);
        const height = Math.min(60, image.height);

        const offscreenCanvas = new OffscreenCanvas(width, height);
        const ctx = offscreenCanvas.getContext("2d");
        if (!ctx) return [];
        ctx.drawImage(image, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);

        return new Promise((resolve) => {
            const worker = new Worker(new URL('../lib/workers/imageProcessor.worker.ts', import.meta.url));
            worker.onmessage = (event) => {
                resolve(event.data);
                worker.terminate();
            };
            worker.postMessage({ imageData });
        });
    }
</script>

<div class="action-button" data-tooltip="show grid">
	<button on:click={toggleGrid} aria-label="Toggle grid">
		<img src="/icons-ex/grid.png" alt="Toggle grid" width="30px" />
	</button>
</div>

<div class="action-button" data-tooltip="Clear all">
	<button on:click={() => {
		const pic = get(appStore.pictureStore);
		const command = new ClearAllCommand(pic);
		appStore.commandHistory.execute(command);
		command.execute();
	}} aria-label="Clear all">
		<img src="/icons-ex/clean-all.png" alt="Clean all" width="30px" />
	</button>
</div>

<div class="action-button" data-tooltip="Save">
	<button on:click={handleSave} aria-label="Save">
		<img src="/icons-ex/download.png" alt="Save" width="30px" />
	</button>
</div>

<div class="action-button" data-tooltip="Load">
	<button on:click={handleLoadClick} aria-label="Load">
		<img src="/icons-ex/ulpoad.png" alt="Load" width="30px" />
	</button>
</div>
<input type="file" bind:this={fileInput} on:change={handleFileSelect} style="display: none;" />

<style>
    button {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
    }
    img {
        border-width: 0px;
        border: solid;
        border-radius: 10%;
        border-color: white;
        border-width: 0px;
        margin-right: 7px;
        margin-left: 7px;
        margin-top: 1em;
    }
    .action-button {
        position: relative;
        display: inline-block;
    }
    .action-button:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        right: 100%;
        top: 50%;
        transform: translateY(-50%);
        margin-right: 10px;
        padding: 5px;
        background-color: #2e3440;
        color: white;
        border: 1px solid #E1E4EA;
        border-radius: 5px;
        white-space: nowrap;
        z-index: 1;
    }
</style>