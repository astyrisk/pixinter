<script lang="ts">
    import { appStore } from "../../lib/stores/appStore";
    import { STROKE_SHAPE_ENUM } from "../../types";

    const { config } = appStore;

    function handleStrokeShapeChange(event: Event) {
        config.update(n => ({
            ...n,
            strokeShape: (event.target as HTMLSelectElement).value as typeof STROKE_SHAPE_ENUM[keyof typeof STROKE_SHAPE_ENUM],
        }));
    }
</script>

<img src="./icons//style-prop.png" width="80" style="margin-bottom: 7px;" alt="Stroke shape">
<div class="stroke-shape-selector" data-tooltip="stroke shape">
    <select on:change={handleStrokeShapeChange} bind:value={$config.strokeShape}>
        <option value="CONTINUOUS">Continuous</option>
        <option value="DOTTED">Dotted</option>
    </select>
</div>

<style>
    .stroke-shape-selector select {
        background-color: #434c5e;
        color: #eceff4;
        border: 1px solid #4c566a;
        border-radius: 5px;
        padding: 5px;
        font-family: 'Times New Roman', Times, serif;
    }
</style>