<script lang="ts">
    import { onMount } from "svelte";
    import { config, pictureHistory } from "../stores";
    import { TOOLENUM } from "../types";
    import { getClassName } from "../subroutines";
    import { pictureStore } from "../lib/stores/pictureStore.js";

    const tools: string[] = ["pen", "eraser", "fill", "picker"];
    const shapes: string[] = ["circle", "rect"];

    let toolsImg: HTMLImageElement[];

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    onMount(() => {
        toolsImg = Array.from(document.querySelectorAll(".img"));
        canvas = document.querySelector('canvas') as HTMLCanvasElement;
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        
        // Set pen as the default tool
        const penTool = toolsImg.find(img => img.classList.contains('pen'));
        if (penTool) {
            penTool.style.borderWidth = "1px";
        }
    });

    function handleColorChange(event) {
        config.update(n => n =  {
            color: event.target.value,
            background_color: n.background_color,
            tool: n.tool,
        });
    }

    function handleUndo() {
        const lastPicture = ($pictureHistory).pop();
        if (lastPicture) {
            pictureStore.setPixels(lastPicture.getPixels());
            pictureStore.update(p => {
                p.redraw(ctx);
                return p;
            });
        }
    }

    function handleMouseClick(event: MouseEvent) {
        let toolName: string = getClassName(event.target);
        toolsImg.map(n => { n.style.borderWidth = "0px"; });
        toolsImg.filter(n => n.classList[0] == toolName)[0].style.borderWidth = "1px";
        toolName = toolName.toUpperCase();

        config.update(n => n = {
            color: n.color,
            background_color: n.background_color,
            tool: TOOLENUM[toolName],
        });
    }

    function handleMouseOver(event: MouseEvent | FocusEvent) {
        let toolName: string = getClassName(event.target);
        const selectedTool = document.querySelector('.img[style*="border-width: 1px"]');
        if (selectedTool && selectedTool.classList[0] === toolName) return;

        toolsImg.map(n => { if(n.style.borderWidth !== "1px") n.style.borderColor = "transparent"; });
        toolsImg.filter(n => n.classList[0] == toolName)[0].style.borderColor = "white";
    }
</script>


<main>
    <!-- Tools-->
    <!-- <div class="tools"> -->
    {#each tools as tool}
        <div class="tool" data-tooltip={tool}>
            <img src="../../icons-ex/{tool}.png" class="{tool} img" alt="{tool}" width="42px" on:click={handleMouseClick} on:keydown={() => {}} on:mouseover={handleMouseOver} on:focus={() => {}}>
        </div>
    {/each}
    <!-- </div> -->


    <!-- Shapes -->
    <!-- <div class="shapes"> -->
        {#each shapes as shape}
            <div class="shape" data-tooltip={shape}>
                <img src="../../icons-ex/{shape}.png" class="{shape} img" alt="{shape}" width="42px" on:click={handleMouseClick} on:keydown={() => {}} on:mouseover={handleMouseOver} on:focus={() => {}}>
            </div>
        {/each}
    <!-- </div> -->
    
    
    <div class="undo" data-tooltip="undo">  <img src="../../icons-ex/undo.png" class="undo" width="40" alt="undo icon" on:click={handleUndo} on:keydown={() => {}}> </div>
    <div class="color-picker" data-tooltip="color picker" style="background-color: {$config['color']}" on:click={() => document.getElementById('colorInput').click()}></div>
    <input type="color" id="colorInput" bind:value={$config['color']} on:input={handleColorChange} style="display: none;" />
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
    .tool, .shape, .color-picker, .undo {
        cursor: pointer;
        position: relative;
    }

    .tool:hover::after, .shape:hover::after, .undo:hover::after, .color-picker:hover::after {
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