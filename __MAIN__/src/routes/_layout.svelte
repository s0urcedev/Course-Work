<script>
    import { onMount } from 'svelte';

    export let screenWidth;

    onMount(() => {
        screenWidth = screen.width;
        if (screenWidth < 600) {
            document.getElementsByTagName('body')[0].style.zoom = screenWidth / 600;
        }
    });
</script>

<style>
    :global(body) {
        zoom: 1;
        background-color: #009075;
    }

    main {
        position: relative;
        margin: 0 auto;
        box-sizing: border-box;
    }
</style>

<main>
    <slot></slot>
</main>