<script>
    import { onMount } from 'svelte';

    export let testId, testName, userName;

    function getTestName(id) {
        if (id !== undefined && id !== '' && id.length === 24) {
            testName = fetch(`/api/testing/check-test?id=${id}`).then(res => res.json()).then(data => testName = data['name']);
            if (typeof testName !== 'string') testName = undefined;
        } else {
            testName = undefined;
        }
    }

    $: getTestName(testId);

    export let gotName = '', gotEmail = '', gotPassword = '';

    onMount(async () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.get('id') !== null) {
            testId = urlParams.get('id');
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
            userName = gotName;
        }
    });
</script>

<style>
    /* uk */
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

    .start-session-form span {
        font-family: "e-Ukraine", sans-serif;
        color: #009075;
        font-size: 22px;
        display: block;
        text-align: center;
        margin-top: 5px;
    }

    .start-session-form input::placeholder {
        color: #009075;
        font-weight: 200;
    }

    .start-session-form input {
        font-family: "e-Ukraine", sans-serif;
        outline: 0;
        background: #EDEDED;
        width: 100%;
        border: 0;
        margin-top: 5px;
        padding: 10px;
        color: #009075;
        font-weight: 500;
        box-sizing: border-box;
        font-size: 18px;
        border-radius: 15px;
        text-align: center;
    }

    .start-session-form button {
        font-family: "e-Ukraine", sans-serif;
        text-transform: uppercase;
        display: inline-block;
        outline: 0;
        background: #009075;
        width: 200px;
        margin-top: 10px;
        border: 0;
        padding: 15px;
        color: #FFFFFF;
        font-weight: 400;
        font-size: 28px;
        -webkit-transition: all 0.3 ease;
        transition: all 0.3 ease;
        cursor: pointer;
        border-radius: 15px;
    }

    .start-session-form button:hover {
        opacity: 0.85;
    }

</style>

<svelte:head>
    <title>Почати сесію</title>
</svelte:head>

<main>
    <form id="startSessionForm" on:submit={(event) => { event.preventDefault(); }} action="/api/testing/start-session" method="post" class="start-session-form">
        <span>ІД тесту:</span>
        <input type="text" name="id" bind:value={testId} placeholder="ІД тесту">
        <span>Ім'я тесту:</span>
        <span>{testName ?? '*Неправильний ІД*'}</span>
        <span>Ім'я користувача:</span>
        <input type="text" name="userName" bind:value={userName} placeholder="Ім'я користувача">
        {#if testId !== undefined && testId !== '' && userName !== undefined && userName !== '' && testName !== undefined && testName !== ''}
            <div style="margin: auto; text-align: center;">
                <button type="button" on:click={() => { document.getElementById('startSessionForm').submit(); }}>Почати</button>
            </div>
        {/if}
    </form>
</main>