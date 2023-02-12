<script>
    export let status;
    export let error;

    const dev = process.env.NODE_ENV === 'development';
</script>

<style>
    span {
        margin: 0 auto;
        color: black;
        font-family: 'e-Ukraine';
        font-weight: 700;
    }
</style>

<svelte:head>
    <title>{status}</title>
</svelte:head>

<div style="text-align: center">
    <span style="font-size: 68px">{status}</span><br>

    <span style="font-size: 38px">{error.message}</span>

    {#if dev && error.stack}
        <pre>{error.stack}</pre>
    {/if}
</div>
