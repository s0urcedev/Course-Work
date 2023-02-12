<script>
    import { onMount } from 'svelte';

    export let usersTests, link;
    export let gotName = '', gotEmail = '', gotPassword = '';

    onMount(async () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.get('link') !== null) {
            link = urlParams.get('link');
        } else {
            link = 'edit-test';
        }
        if (urlParams.get('message') !== null) {
            alert(urlParams.get('message'));
        }
        try {
            let res = await (await fetch('/api/users/get-user')).json();
            gotName = res['name'];
            gotEmail = res['email'];
            gotPassword = res['password'];
        } catch (err) {
            gotName = '';
            gotEmail = '';
            gotPassword = '';
        }
        if (gotEmail !== undefined && gotEmail !== null && gotEmail !== '') {
            usersTests = await (await fetch(`/api/testing/get-users-tests?authorsEmail=${gotEmail}`)).json();
        } else {
            window.location.href = '/en/authorization/login?message=Login please';
        }
    });
</script>

<style>
    /* en */
    main {
        position: relative;
        display: block;
        margin: auto;
        margin-top: 20px;
        background-color: #FFFFFF;
        padding: 10px;
        width: 500px;
        border-radius: 25px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    }

    span {
        font-family: "e-Ukraine", sans-serif;
        color: #009075;
        display: block;
        text-align: center;
        margin-top: 5px;
    }

</style>

<svelte:head>
    <title>Choose a test</title>
</svelte:head>

<main>
    {#if usersTests !== undefined && usersTests !== null}
        {#if usersTests.length > 0}
            <span style="font-size: 28px">Choose a test:</span>
            {#each usersTests as test}
                <a style="color: #009075" href="/en/testing/{link}?id={test['_id']}">
                    <div style="margin-top: 10px; border: 2px solid #009075; border-radius: 15px; width:99%">
                        <span style="font-size: 22px">{test['name']} ({test['_id']})</span>
                    </div>
                </a>
            {/each}
        {:else}
            <span style="font-size: 28px">You don't have tests</span>
        {/if}
    {/if}
</main>