<script lang="ts">
    import { appStore } from "../../lib/stores/appStore";

    const { config } = appStore;

    function handleStrokeWidthChange(event: Event) {
        config.update(n => ({
            ...n,
            strokeWidth: Number((event.target as HTMLInputElement).value),
        }));
    }
</script>

<div class="stroke-width-slider" data-tooltip="stroke width">
    <img src="../../icons-ex/stroke.png" width="90" style="margin-bottom: 10px;" alt="Stroke width">
    <input type="range" min="0" max="3" bind:value={$config['strokeWidth']} on:input={handleStrokeWidthChange} style="width: 80px;" />
    <input type="number" bind:value={$config['strokeWidth']} min="1" max="3" class="stroke-width-input" readonly  />
</div>

<style>
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
    .stroke-width-input {
        width: 40px;
        background-color: #434c5e;
        color: #eceff4;
        border: 1px solid #4c566a;
        border-radius: 5px;
        text-align: center;
        font-size: 1em;
        padding: 2px;
    }
</style>