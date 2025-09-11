<script lang="ts">
    import { appStore } from "../../lib/stores/appStore";

    const { config } = appStore;
</script>

<div class="stroke-width-slider" data-tooltip="eraser size">
    <img src="../../icons-ex/eraser-prop.png" width="90" style="margin-bottom: 10px;" alt="Eraser size">
    <input type="range" min="1" max="3" bind:value={$config['eraserSize']} style="width: 80px;" />
    <input type="number" bind:value={$config['eraserSize']} min="1" max="3" class="stroke-width-input" readonly />
</div>

<style>
    .stroke-width-slider {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5em;
        color: #eceff4;
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