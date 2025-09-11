<script lang="ts">
	import { onMount } from 'svelte';
	import { appStore } from "../../lib/stores/appStore";
	import { width, height, backgroundColor } from "../../lib/config";
	import DrawingLayer from './DrawingLayer.svelte';
	import GridLayer from './GridLayer.svelte';

	const { config } = appStore;
</script>

<div style="position: relative; width: {width}px; height: {height}px; border:1px solid #000; background-color: {backgroundColor}">
	<DrawingLayer />
	{#if $config.showGrid}
		<GridLayer />
	{/if}
</div>