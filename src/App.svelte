<script lang="ts">
	import PictureCanvas from "./Compononets/PictureCanvas.svelte";
	import Tool from "./Compononets/Tool.svelte";
	import File from "./Compononets/File.svelte"

</script>

<main>
	<div class="toolbox">
		<Tool />
	</div>
	<div class="canvas">
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
</style>
