<script>
    import { afterUpdate } from 'svelte';

    export let screenWidth, newLocation;

    afterUpdate(() => {
        screenWidth = screen.width;
        if (screenWidth < 600) {
            document.getElementsByTagName('body')[0].style.zoom = screenWidth / 600;
        }
        newLocation = window.location.pathname.replace('/uk', '/en');
    });
</script>

<style>
    /* uk */
    :global(body) {
        zoom: 1;
        background-color: #009075;
    }

    main {
        position: relative;
        padding: 10px;
        margin: 0 auto;
        box-sizing: border-box;
    }

    button {
        font-family: "e-Ukraine", sans-serif;
        position: fixed;
        text-transform: uppercase;
        display: block;
        outline: 0;
        background: #FFFFFF;
        width: 120px;
        margin-top: 10px;
        margin-left: 10px;
        border: 0;
        padding: 5px;
        color: #009075;
        font-weight: 400;
        font-size: 28px;
        -webkit-transition: all 0.3 ease;
        transition: all 0.3 ease;
        cursor: pointer;
        border-radius: 15px;
    }

    button:hover {
        opacity: 0.85;
    }
</style>

<main>
    {#if newLocation !== undefined && screenWidth !== undefined && screenWidth >= 1300}
        <a href="/uk"><button>Дім</button></a>
        <a href={newLocation}><button style="margin-top: 65px;">En</button></a>
    {/if}
    <slot></slot>
</main>