<script>
    import { appStore } from '../lib/stores/appStore';
    const { selectedShape, config } = appStore;
    import { TOOLENUM } from '../types';
    import { onMount, onDestroy } from 'svelte';

    let showMenu = false;
    let toolNode;

    onMount(() => {
        window.addEventListener('click', handleClickOutside);
    });

    onDestroy(() => {
        window.removeEventListener('click', handleClickOutside);
    });

    function handleClickOutside(event) {
        if (toolNode && !toolNode.contains(event.target)) {
            showMenu = false;
        }
    }
    function handleContextMenu(event) {
        event.preventDefault();
        showMenu = true;
    }

    function selectShape(shape) {
        selectedShape.set(shape);
        config.update(n => ({ ...n, tool: TOOLENUM.SHAPE }));
        showMenu = false;
    }

</script>

<div class="tool" on:contextmenu={handleContextMenu} on:keydown={(e) => e.key === 'Enter' && handleContextMenu(e)} data-tooltip="shape" bind:this={toolNode} class:menu-open={showMenu} role="button" tabindex="0">
    <img src={$selectedShape === 'rect' ? '../../icons-ex/rect.png' : $selectedShape === 'circle' ? '../../icons-ex/circle.png' : '../../icons-ex/line.png'} alt="Shape Tool" width="42px" class="shape img"/>
    {#if showMenu}
        <div class="context-menu">
            <button class="shape img" on:click={() => selectShape('rect')}> Rectangle </button>
            <button class="shape img" on:click={() => selectShape('circle')}>Circle </button>
            <button class="shape img" on:click={() => selectShape('line')}>Line </button>
        </div>
    {/if}
</div>

<style>
    .tool {
        position: relative;
        cursor: pointer;
    }

    img {
        margin-top: 1em;
    }

    .img {
        border-width: 0px;
        border: solid;
        border-radius: 10%;
        border-color: white;
        border-width: 0px;
        margin-right: 7px;
        margin-left: 7px;
    }
    .context-menu {
        position: absolute;
        top: 0;
        left: 100%;
        background-color: #2e3440;
        border: 1px solid #E1E4EA;
        color: #E1E4EA;
        z-index: 10;
        display: flex;
        flex-direction: row;
    }
    .tool:not(.menu-open):hover::after {
        content: attr(data-tooltip);
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 10px;
        padding: 5px;
        background-color: #2e3440;
        color: white;
        border: 1px solid #E1E4EA;
        border-radius: 5px;
        white-space: nowrap;
        z-index: 1;
    }
    .context-menu button {
        background: none;
        border: none;
        padding: 5px;
        cursor: pointer;
        color: #E1E4EA;
        font-family: inherit;
        font-size: inherit;
    }
    .context-menu button:hover {
        background-color: #434c5e;
    }
</style>
