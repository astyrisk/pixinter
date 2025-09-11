<script lang="ts">
	import PictureCanvas from "./Compononets/PictureCanvas.svelte";
	import Tool from "./Compononets/Tool.svelte";
	import File from "./Compononets/File.svelte";
	import PropPanel from "./Compononets/PropPanel.svelte";
	import { onMount } from 'svelte';
	import { config } from "./lib/stores/appStore";

	onMount(() => {
		console.log('Current tool:', $config.tool);
	});
</script>

<main>

	<PropPanel />

	<div class="main-panel">
		<div class="toolbox">
			<Tool />
		</div>
		<div class="canvas">
			<PictureCanvas />
		</div>
		<div class="action-buttons">
			<File />
		</div>
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
		position: relative; /* Needed for absolute positioning of children */
	}


	.main-panel {
		display: flex;
		flex-direction: row; /* Horizontal alignment for elements inside main-panel */
		align-items: center;
		justify-content: center;
		gap: 1em;
		padding: 1em;
		flex-grow: 1; /* Allow main-panel to take up remaining space */
	}

	.toolbox, .canvas, .action-buttons {
		padding: 0.5em;
	}

	.toolbox, .action-buttons {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
</style>
