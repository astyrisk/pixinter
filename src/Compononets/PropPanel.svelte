<script lang="ts">
    import { appStore } from "../lib/stores/appStore";
    import StrokeWidth from "./PropPanel/StrokeWidth.svelte";
    import StrokeShape from "./PropPanel/StrokeShape.svelte";
    import StrokeColor from "./PropPanel/StrokeColor.svelte";
    import EraserSize from "./PropPanel/EraserSize.svelte";

    const { config } = appStore;
</script>

<div class="prop-panel">
    {#if $config.tool === 'SHAPE'}
        <StrokeWidth />
        <StrokeShape />
        <StrokeColor />
    {/if}
    {#if $config.tool === 'ERASER'}
        <EraserSize />
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
</style>
