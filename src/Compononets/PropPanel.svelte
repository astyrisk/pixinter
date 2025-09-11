<script lang="ts">
    import { config } from "../stores";

    function handleStrokeWidthChange(event: Event) {
        config.update(n => ({
            ...n,
            strokeWidth: Number((event.target as HTMLInputElement).value),
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

    input[type="range"] {
        -webkit-appearance: none;
        width: 100%;
        height: 6px;
        background: #434c5e;
        border-radius: 5px;
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        background: #eceff4;
        border-radius: 50%;
        cursor: pointer;
    }

    input[type="range"]::-moz-range-thumb {
        width: 12px;
        height: 12px;
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
        font-size: 0.8em; /* Increased font size */
        padding: 2px; /* Added padding for better appearance */
    }
</style>