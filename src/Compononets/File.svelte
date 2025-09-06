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
                const pixels = await pictureFromImage(image);
                const newPic = new Picture(pixels.length, pixels[0].length, 10);
                newPic.setPixels(pixels);
                pictureStore.update(_ => newPic);
                const mainCanvas = document.querySelector("#canvas") as HTMLCanvasElement;
                if(mainCanvas) {
                    const mainCtx = mainCanvas.getContext("2d");
                    if (mainCtx) {
                        pictureStore.subscribe(p => p.redraw(mainCtx))();
                    }
                }
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

<button class="save" on:click={handleSave}> Save </button>
<button class="load" on:click={handleLoadClick}> Load </button>
<input type="file" bind:this={fileInput} on:change={handleFileSelect} style="display: none;" />

<style>
    button {
        margin-top: 1em;
        width: 7%;
    }
    .load{
        margin-left: 1em;
    }
</style>