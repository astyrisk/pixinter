<script lang="ts">
    import { pictureStore } from '../lib/stores/pictureStore';
    import { Picture } from '../types';
    
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let fileInput: HTMLInputElement;

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
                const newPic = new Picture(pixels.length, pixels[0].length, 10);
                newPic.setPixels(pixels, mainCtx);
                pictureStore.update(_ => newPic);
                pictureStore.subscribe(p => p.redraw(mainCtx))();
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
            const worker = new Worker(new URL('../lib/utils/imageProcessor.js', import.meta.url));
            worker.onmessage = (event) => {
                resolve(event.data);
                worker.terminate();
            };
            worker.postMessage({ imageData });
        });
    }
</script>

<div class="action-button" data-tooltip="Save">
    <img src="/icons-ex/download.png" alt="Save" width="30px" on:click={handleSave} on:keydown={() => {}} />
</div>
<div class="action-button" data-tooltip="Load">
    <img src="/icons-ex/ulpoad.png" alt="Load" width="30px" on:click={handleLoadClick} on:keydown={() => {}} />
</div>
<input type="file" bind:this={fileInput} on:change={handleFileSelect} style="display: none;" />

<style>
    img {
        border-width: 0px;
        border: solid;
        border-radius: 10%;
        border-color: white;
        border-width: 0px;
        margin-right: 7px;
        margin-left: 7px;
        margin-top: 1em;
        cursor: pointer;
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