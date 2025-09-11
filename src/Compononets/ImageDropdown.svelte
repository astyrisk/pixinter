<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let options: { value: string; label: string; image: string }[];
    export let selectedValue: string;

    let isOpen = false;
    const dispatch = createEventDispatcher();

    function toggleDropdown() {
        isOpen = !isOpen;
    }

    function selectOption(optionValue: string) {
        selectedValue = optionValue;
        dispatch('select', optionValue);
        isOpen = false;
    }

    // Svelte action to close dropdown when clicking outside
    function clickOutside(node: HTMLElement) {
        const handleClick = (event: MouseEvent) => {
            if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
                isOpen = false;
            }
        };

        document.addEventListener('click', handleClick, true);

        return {
            destroy() {
                document.removeEventListener('click', handleClick, true);
            }
        };
    }
</script>

<div class="image-dropdown" use:clickOutside>
    <div class="selected-option" on:click={toggleDropdown}>
        {#if selectedValue}
            {@const selectedOption = options.find(o => o.value === selectedValue)}
            {#if selectedOption}
                <img src={selectedOption.image} alt={selectedOption.label} class="option-image" />
                <span>{selectedOption.label}</span>
            {:else}
                <span>Select an option</span>
            {/if}
        {:else}
            <span>Select an option</span>
        {/if}
        <span class="dropdown-arrow" class:open={isOpen}>&#9660;</span>
    </div>

    {#if isOpen}
        <ul class="options-list">
            {#each options as option}
                <li class="option-item" class:selected={option.value === selectedValue} on:click={() => selectOption(option.value)}>
                    <img src={option.image} alt={option.label} class="option-image" />
                    <span>{option.label}</span>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .image-dropdown {
        position: relative;
        width: 150px; /* Adjust as needed */
        cursor: pointer;
        font-size: 0.8em;
        color: #eceff4;
        background-color: #434c5e;
        border: 1px solid #4c566a;
        border-radius: 5px;
    }

    .selected-option {
        display: flex;
        align-items: center;
        padding: 5px 10px;
        justify-content: space-between;
    }

    .option-image {
        width: 20px; /* Adjust image size */
        height: 20px;
        margin-right: 8px;
        vertical-align: middle;
    }

    .dropdown-arrow {
        margin-left: auto;
        transition: transform 0.2s;
    }

    .dropdown-arrow.open {
        transform: rotate(180deg);
    }

    .options-list {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: #434c5e;
        border: 1px solid #4c566a;
        border-top: none;
        border-radius: 0 0 5px 5px;
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: 200px; /* Scrollable if many options */
        overflow-y: auto;
        z-index: 100;
    }

    .option-item {
        display: flex;
        align-items: center;
        padding: 8px 10px;
    }

    .option-item:hover {
        background-color: #4c566a;
    }

    .option-item.selected {
        background-color: #5e81ac; /* Highlight selected item */
    }
</style>