<script>
    import { selectedShape } from '../lib/stores/stores.js';
    import { config } from '../stores';
    import { TOOLENUM } from '../types';

    let showMenu = false;

    function handleContextMenu(event) {
        event.preventDefault();
        showMenu = !showMenu;
    }

    function selectShape(shape) {
        selectedShape.set(shape);
        config.update(n => ({ ...n, tool: TOOLENUM.SHAPE }));
        showMenu = false;
    }

</script>

<div class="tool" on:contextmenu={handleContextMenu} data-tooltip="shape">
    <img src={$selectedShape === 'rect' ? '../../icons-ex/rect.png' : '../../icons-ex/circle.png'} alt="Shape Tool" width="42px" class="shape img"/>
    {#if showMenu}
        <div class="context-menu">
            <div class="shape img" on:click={() => selectShape('rect')}>Rectangle</div>
            <div class="shape img" on:click={() => selectShape('circle')}>Circle</div>
        </div>
    {/if}
</div>

<style>
    .tool {
        position: relative;
        cursor: pointer;
    }

    .img {
        border-width: 0px;
        border: solid;
        border-radius: 10%;
        border-color: white;
        border-width: 0px;
        margin-right: 7px;
        margin-left: 7px;
        margin-top: 1em;
    }
    .context-menu {
        position: absolute;
        top: 100%;
        left: 0;
        background-color: white;
        border: 1px solid #ccc;
        z-index: 10;
    }
    .tool:hover::after {
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
    .context-menu div {
        padding: 5px;
        cursor: pointer;
    }
    .context-menu div:hover {
        background-color: #eee;
    }
</style>
