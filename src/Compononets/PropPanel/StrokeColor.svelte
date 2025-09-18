<script lang="ts">
    import { appStore } from "../../lib/stores/appStore";

    const { config } = appStore;

    function handleStrokeColorChange(event) {
        config.update(n => ({
            ...n,
            strokeColor: event.target.value,
        }));
    }
</script>

<img src="./icons//color-prop.png" width="80" style="margin-bottom: 7px;" alt="Stroke shape">
<div class="stroke-color-picker" data-tooltip="stroke color picker" style="background-color: {$config['strokeColor']}" on:click={() => document.getElementById('strokeColorInput').click()} on:keydown={(e) => e.key === 'Enter' && document.getElementById('strokeColorInput').click()} role="button" tabindex="0">
</div>

<input type="color" id="strokeColorInput" bind:value={$config['strokeColor']} on:input={handleStrokeColorChange} style="display: none;" />
<div class="non-color-option" data-tooltip="no stroke color" on:click={() => config.update(n => ({ ...n, strokeColor: null }))} on:keydown={(e) => e.key === 'Enter' && config.update(n => ({ ...n, strokeColor: null }))} role="button" tabindex="0">
</div>

<style>
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