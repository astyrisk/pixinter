<script lang="ts">
    import { config } from "../stores";
    import { STROKE_SHAPE_ENUM } from "../types";
    

    function handleStrokeWidthChange(event: Event) {
        config.update(n => ({
            ...n,
            strokeWidth: Number((event.target as HTMLInputElement).value),
        }));
    }

    function handleStrokeShapeChange(event: Event) {
        config.update(n => ({
            ...n,
            strokeShape: (event.target as HTMLSelectElement).value as typeof STROKE_SHAPE_ENUM[keyof typeof STROKE_SHAPE_ENUM],
        }));
    }

    function handleStrokeColorChange(event) {
        config.update(n => ({
            ...n,
            strokeColor: event.target.value,
        }));
    }
</script>

<div class="prop-panel">
    {#if $config.tool === 'SHAPE'}
        <div class="stroke-width-slider" data-tooltip="stroke width">
            <img src="../../icons-ex/stroke.png" width="90" style="margin-bottom: 10px;">
            <input type="range" min="0" max="3" bind:value={$config['strokeWidth']} on:input={handleStrokeWidthChange} style="width: 80px;" />
            <input type="number" bind:value={$config['strokeWidth']} min="1" max="3" class="stroke-width-input" readonly  />
        </div>

            <img src="../../icons-ex/style-prop.png" width="80" style="margin-bottom: 7px;">

        <div class="stroke-shape-selector" data-tooltip="stroke shape">
            <select on:change={handleStrokeShapeChange} bind:value={$config.strokeShape}>
                <option value="CONTINUOUS">Continuous</option>
                <option value="DOTTED">Dotted</option>
            </select>
        </div>
            <img src="../../icons-ex/color-prop.png" width="80" style="margin-bottom: 7px;">

        <div class="stroke-color-picker" data-tooltip="stroke color picker" style="background-color: {$config['strokeColor']}" on:click={() => document.getElementById('strokeColorInput').click()}>
        </div>
            <input type="color" id="strokeColorInput" bind:value={$config['strokeColor']} on:input={handleStrokeColorChange} style="display: none;" />
        <div class="non-color-option" data-tooltip="no stroke color" on:click={() => config.update(n => ({ ...n, strokeColor: null }))}>
        </div>
        
    {/if}
    {#if $config.tool === 'ERASER'}
        <div class="stroke-width-slider" data-tooltip="eraser size">
            <img src="../../icons-ex/eraser-prop.png" width="90" style="margin-bottom: 10px;">
            <input type="range" min="1" max="3" bind:value={$config['eraserSize']} style="width: 80px;" />
            <input type="number" bind:value={$config['eraserSize']} min="1" max="3" class="stroke-width-input" readonly />
        </div>
    {/if}
</div>

<style>
    .prop-panel {
        position: absolute;
        top: 6em;
        left: 7em;
        z-index: 10;
        padding: 1em;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5em;
        margin-top: 10px;
    }

    .stroke-width-slider {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5em;
        color: #eceff4;
    }
    .stroke-width-slider input {
        box-sizing: border-box;
        vertical-align: middle;
    }

    .stroke-shape-selector select {
        background-color: #434c5e;
        color: #eceff4;
        border: 1px solid #4c566a;
        border-radius: 5px;
        padding: 5px;
    }

    input[type="range"] {
        -webkit-appearance: none;
        width: 100%;
        height: 1px;
        background: #434c5e;
        /* border-radius: 5px; */
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 19px;
        height: 19px;
        background: #eceff4;
        border-radius: 50%;
        cursor: pointer;
    }

    input[type="range"]::-moz-range-thumb {
        width: 19px;
        height: 19px;
        background: #eceff4;
        border-radius: 50%;
        cursor: pointer;
    }

    .stroke-width-input {
        width: 40px; /* Increased width */
        background-color: #434c5e;
        color: #eceff4;
        border: 1px solid #4c566a;
        border-radius: 5px;
        text-align: center;
        font-size: 1em; /* Increased font size */
        padding: 2px; /* Added padding for better appearance */
    }

    .prop-panel{
        font-family: 'Times New Roman', Times, serif;
        font-size: 1em;
    }
    .stroke-color-picker {
        width: 30px;
        height: 30px;
        border-radius: 10%;
        cursor: pointer;
        margin-bottom: 10px;
    }

    .non-color-option {
        width: 30px;
        height: 30px;
        border-radius: 10%;
        background-image: linear-gradient(to top left,
                                        rgba(0,0,0,0) 0%,
                                        rgba(0,0,0,0) 45%,
                                        #ff0000 50%,
                                        rgba(0,0,0,0) 55%,
                                        rgba(0,0,0,0) 100%);
        border: 1px solid #4c566a;
        cursor: pointer;
        margin-bottom: 10px;
    }
</style>
