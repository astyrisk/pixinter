<script lang="ts">
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import { appStore } from "../lib/stores/appStore";
    import { TOOLENUM, Picture } from "../types";
    import { getClassName } from "../subroutines";
    import ShapeTool from "./ShapeTool.svelte";
    import { ClearAllCommand } from '../lib/ClearAllCommand';

    const { config, commandHistory, pictureStore } = appStore;

    const tools: string[] = ["pen", "eraser", "fill", "picker"];

    let toolsImg: HTMLImageElement[];
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let shapeToolImg: HTMLImageElement;

    onMount(() => {
        toolsImg = Array.from(document.querySelectorAll(".img"));
        shapeToolImg = document.querySelector('.shape.img') as HTMLImageElement;
        if (shapeToolImg) {
            toolsImg.push(shapeToolImg);
        }
        canvas = document.querySelector('canvas') as HTMLCanvasElement;
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        
        // Set pen as the default tool
        const penTool = toolsImg.find(img => img.classList.contains('pen'));
        if (penTool) {
            penTool.style.borderWidth = "1px";
        }
    });

    function handleUndo() {
        commandHistory.undo();
        pictureStore.update(p => {
            p.redraw(ctx);
            return p;
        });
    }

    function handleRedo() {
        commandHistory.redo();
        pictureStore.update(p => {
            p.redraw(ctx);
            return p;
        });
    }

    function handleMouseClick(event: MouseEvent) {
        let toolName: string = getClassName(event.target);
        let targetElement = undefined;
        toolsImg.map(n => { n.style.borderWidth = "0px"; });

        toolsImg.forEach(x => {
            if (x.classList[0] == toolName) {
                targetElement = x;
            }
        })

        if (targetElement) {
            targetElement.style.borderWidth = "1px";
            config.update(n => ({
                ...n,
                tool: TOOLENUM[toolName.toUpperCase()],
            }));
        }
   }

    function handleShapeToolActivation() {
        if (shapeToolImg) {
            handleMouseClick({ target: shapeToolImg } as unknown as MouseEvent);
        }
    }
</script>


<main>
    <!-- Tools-->
    {#each tools as tool}
        <div class="tool" data-tooltip={tool}>
            <button on:click={handleMouseClick} aria-label={tool}>
                <img src="./icons//{tool}.png" class="{tool} img" alt={tool} width="42px">
            </button>
        </div>
    {/each}

    <div on:click={handleShapeToolActivation} on:keydown={(e) => e.key === 'Enter' && handleShapeToolActivation()} role="button" tabindex="0">
        <ShapeTool />
    </div>

    <div class="undo" data-tooltip="undo">
        <button on:click={handleUndo} aria-label="Undo">
            <img src="./icons//undo.png" class="undo" width="40" alt="undo icon">
        </button>
    </div>

    <div class="redo" data-tooltip="redo">
        <button on:click={handleRedo} aria-label="Redo">
            <img src="./icons//redo.png" class="redo" width="40" alt="redo icon">
        </button>
    </div>

    <div class="color-picker" data-tooltip="color picker" style="background-color: {$config['color']}" on:click={() => document.getElementById('colorInput').click()} on:keydown={(e) => e.key === 'Enter' && document.getElementById('colorInput').click()} role="button" tabindex="0"></div>
    <input type="color" id="colorInput" bind:value={$config['color']} style="display: none;" />
    <div class="non-color-option" data-tooltip="no color" on:click={() => config.update(n => ({ ...n, color: null }))} on:keydown={(e) => e.key === 'Enter' && config.update(n => ({ ...n, color: null }))} role="button" tabindex="0"></div>

</main>


<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
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
    .color-picker {
        width: 30px;
        height: 30px;
        border-radius: 10%;
        margin-top: 1.3em;
    }

    .non-color-option {
        width: 30px;
        height: 30px;
        border-radius: 10%;
        margin-top: 1.3em;
        background-image: linear-gradient(to top left,
                                        rgba(0,0,0,0) 0%,
                                        rgba(0,0,0,0) 45%,
                                        #ff0000 50%,
                                        rgba(0,0,0,0) 55%,
                                        rgba(0,0,0,0) 100%);
        border: 1px solid #4c566a;
        cursor: pointer;
    }

    .tool, .shape, .color-picker, .undo, .redo, .non-color-option {
        cursor: pointer;
        position: relative;
    }

    .tool:hover::after, .shape:hover::after, .undo:hover::after, .redo:hover::after, .color-picker:hover::after, .stroke-color-picker:hover::after, .non-color-option:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 10px;
        padding: 5px;
        background-color: #2e3440;
        color: white;
        border: 1px solid #E1E4EA;
        border-radius: 5px;
        white-space: nowrap;
        z-index: 3;
    }
</style>
