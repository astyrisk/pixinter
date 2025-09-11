<script lang="ts">
    import { onMount } from "svelte";
    import { config } from "../stores";
    import { TOOLENUM } from "../types";
    import { getClassName } from "../subroutines";
    import { pictureStore } from "../lib/stores/pictureStore.js";
    import { commandHistory } from "../lib/stores/commandHistory.js";
    import { selectedShape } from "../lib/stores/stores.js";
    import ShapeTool from "./ShapeTool.svelte";

    const tools: string[] = ["pen", "eraser", "fill", "picker"];

    let toolsImg: HTMLImageElement[];
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    onMount(() => {
        toolsImg = Array.from(document.querySelectorAll(".img"));
        const shapeToolImg = document.querySelector('.tool[data-tooltip="shape"] img');
        if (shapeToolImg) {
            toolsImg.push(shapeToolImg as HTMLImageElement);
        }
        canvas = document.querySelector('canvas') as HTMLCanvasElement;
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        
        // Set pen as the default tool
        const penTool = toolsImg.find(img => img.classList.contains('pen'));
        if (penTool) {
            penTool.style.borderWidth = "1px";
        }
    });

    function handleColorChange(event) {
        config.update(n => ({
            ...n,
            color: event.target.value,
        }));
    }

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
</script>


<main>
    <!-- Tools-->
    {#each tools as tool}
        <div class="tool" data-tooltip={tool}>
            <img src="../../icons-ex/{tool}.png" class="{tool} img" alt="{tool}" width="42px" on:click={handleMouseClick} on:keydown={() => {}} on:focus={() => {}}>
        </div>
    {/each}


<div on:click={handleMouseClick} on:focus={() => {}} on:keydown={()=>{}}>
    <ShapeTool />
</div>

    <div class="undo" data-tooltip="undo">  <img src="../../icons-ex/undo.png" class="undo" width="40" alt="undo icon" on:click={handleUndo} on:keydown={() => {}}> </div>

    <div class="redo" data-tooltip="redo">  <img src="../../icons-ex/redo.png" class="redo" width="40" alt="redo icon" on:click={handleRedo} on:keydown={() => {}}> </div>



    <div class="color-picker" data-tooltip="color picker" style="background-color: {$config['color']}" on:click={() => document.getElementById('colorInput').click()}></div>
    <input type="color" id="colorInput" bind:value={$config['color']} on:input={handleColorChange} style="display: none;" />
    <div class="non-color-option" data-tooltip="no color" on:click={() => config.update(n => ({ ...n, color: null }))}></div>


</main>


<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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
        z-index: 1;
    }
</style>
