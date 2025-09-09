<script lang="ts">
	import PictureCanvas from "./Compononets/PictureCanvas.svelte";
	import Tool from "./Compononets/Tool.svelte";
	import File from "./Compononets/File.svelte"
	import { config } from "./stores";

	function handleStrokeWidthChange(event) {
		config.update(n => ({
			...n,
			strokeWidth: Number(event.target.value),
		}));
	}
</script>

<main>
	<div class="toolbox">
		<Tool />
	</div>
	<div class="canvas">
		{#if $config.tool === 'SHAPE'}
			<div class="stroke-width-slider" data-tooltip="stroke width">
				<!-- <p style="font-size: 2em;">size: </p> -->
				<input type="range" min="0" max="3" bind:value={$config['strokeWidth']} on:input={handleStrokeWidthChange} style="width: 100px;" />
				<input type="number" bind:value={$config['strokeWidth']} min="0" max="3" class="stroke-width-input" readonly  />
			</div>
		{/if}
		{#if $config.tool === 'ERASER'}
			<div class="stroke-width-slider" data-tooltip="eraser size">
				<input type="range" min="1" max="4" bind:value={$config['eraserSize']} style="width: 100px;" />
				<input type="number" bind:value={$config['eraserSize']} min="1" max="4" class="stroke-width-input" readonly />
			</div>
		{/if}
		<PictureCanvas />
	</div>
	<div class="action-buttons">
		<File />
	</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;1,200&family=Ubuntu:wght@300&display=swap');

	main {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 1em;
		height: 100%;
	}

	.toolbox, .action-buttons {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
	.stroke-width-slider {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1em;
		margin-bottom: 1em;
		color: #eceff4;
	}

	input[type="range"] {
		-webkit-appearance: none;
		width: 100%;
		height: 10px;
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
		width: 20px;
		height: 20px;
		background: #eceff4;
		border-radius: 50%;
		cursor: pointer;
	}

	input[type="range"]::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: #eceff4;
		border-radius: 50%;
		cursor: pointer;
	}

	.stroke-width-input {
		width: 40px;
		background-color: #434c5e;
		color: #eceff4;
		border: 1px solid #4c566a;
		border-radius: 5px;
		text-align: center;
	}
</style>
