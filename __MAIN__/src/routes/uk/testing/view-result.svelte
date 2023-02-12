<script>
    import { onMount } from 'svelte';

    export let result, id;

    onMount(async () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.get('id') !== null) {
            id = urlParams.get('id');
        }
        if (urlParams.get('message') !== null) {
            alert(urlParams.get('message'));
        }
        if (id !== undefined && id !== '') {
            result = await (await fetch(`/api/testing/get-result?id=${id}`)).json();
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
        width: 600px;
        border-radius: 25px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    }

    @media screen and (max-width: 1050px) {
        main {
            width: 500px;
        }
    }

    span {
        font-family: "e-Ukraine", sans-serif;
        color: #009075;
        display: block;
        margin-top: 5px;
    }

    button {
        font-family: "e-Ukraine", sans-serif;
        text-transform: uppercase;
        display: inline-block;
        outline: 0;
        background: #009075;
        width: 455px;
        margin-top: 5px;
        margin-bottom: 5px;
        border: 0;
        padding: 15px;
        color: #FFFFFF;
        font-weight: 400;
        font-size: 28px;
        -webkit-transition: all 0.3 ease;
        transition: all 0.3 ease;
        cursor: pointer;
        border-radius: 15px;
        border: 2px solid #009075;
    }

    button:hover {
        opacity: 0.85;
    }

</style>

<svelte:head>
    <title>Перегляд результату</title>
</svelte:head>

<main>
    <span style="font-size: 28px; text-align: center;">Ваш результат:</span>
    {#if result !== undefined && result !== null}
        <span style="font-size: 24px; margin-left: 5px">ІД тесту: <b>{result['testId']}</b></span>
        <span style="font-size: 24px; margin-left: 5px">Ім'я тесту: <b>{result['testName']}</b></span>
        <span style="font-size: 24px; margin-left: 5px">Ім'я користувача: <b>{result['userName']}</b></span>
        <span style="font-size: 24px; margin-left: 5px">Дата початку: <b>{new Date(result['startDate']).toUTCString()}</b></span>
        <span style="font-size: 24px; margin-left: 5px">Дата кінця: <b>{new Date(result['endDate']).toUTCString()}</b></span>
        <span style="font-size: 24px; margin-left: 5px">Рахунок: <b>{result['score']}/{result['maxScore']}</b></span>
    {/if}
    <div style="margin: auto; text-align: center;">
        <a href="/uk/testing/start-session">
            <button>Пройти інший тест</button>
        </a>
    </div>
    <div style="margin: auto; text-align: center;">
        <a href="/uk/">
            <button>На домашню сторінку</button>
        </a>
    </div>
</main>