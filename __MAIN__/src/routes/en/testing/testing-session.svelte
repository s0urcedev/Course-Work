<script>
    import { onMount } from 'svelte';
    let sessionId = '';
    export let gotQuestion, screenWidth;
    export async function sendAnswer(answer) {
        let res = await (await fetch('/api/testing/check-answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                answer: answer
            })
        })).json();
        if (res['status'] === 'ongoing') {
            window.location.reload();
        } else if (res['status'] === 'finished') {
            window.location.href = `/en/testing/view-result?id=${res['id']}`;
        }
    }
    onMount(async () => {
        screenWidth = screen.width;
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let cookies = {};
        let cookiesArray = document.cookie.split(';');
        cookiesArray.forEach((cookie) => {
            cookies[cookie.trim().split('=')[0]] = cookie.trim().split('=')[1];
        });
        sessionId = cookies['currentSessionId'];
        if (sessionId === undefined || sessionId === null || sessionId === '') {
            window.location.href = '/';
        }
        if (urlParams.get('message') !== null) {
            alert(urlParams.get('message'));
        }
        gotQuestion = await (await fetch('/api/testing/get-question')).json();
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
        width: 1000px;
        border-radius: 25px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    }

    @media screen and (max-width: 1050px) {
        main {
            width: 500px;
        }
    }

    pre#question {
        font-family: "e-Ukraine", sans-serif;
        color: #009075;
        font-size: 32px;
        display: block;
        text-align: center;
        margin: 0;
        padding: 10px;
        white-space: pre-wrap;
    }

    pre.answer {
        font-family: "e-Ukraine", sans-serif;
        display: block;
        margin: 0;
        font-weight: 400;
        font-size: 28px;
        white-space: pre-wrap;
    }

    button {
        display: inline-block;
        outline: 0;
        background: #FFFFFF;
        margin-top: 10px;
        margin-left: 5px;
        margin-right: 5px;
        width: 49%;
        border: 2px solid #009075;
        padding: 15px;
        color: #009075;
        -webkit-transition: all 0.3 ease;
        transition: all 0.3 ease;
        cursor: pointer;
        border-radius: 15px;
    }

    @media screen and (max-width: 1050px) {
        button {
            width: 99%;
            margin-left: 0px;
            margin-right: 0px;
        }
    }

    button:hover {
        background-color: #009075;
        color: #FFFFFF;
    }
</style>

<svelte:head>
    <title>Test session</title>
</svelte:head>

<main>
    {#if gotQuestion !== undefined && gotQuestion !== null}
        <div style="margin: auto; border: 2px solid #009075; border-radius: 15px; width:99%"><pre id="question">{gotQuestion['text']}</pre></div>
        <div style="margin: auto; text-align: center;">
            {#each gotQuestion['answers'].map(x => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map(x => x[1]) as answer}
                <button on:click={() => sendAnswer(answer)}><pre class="answer">{answer}</pre></button>
            {/each}
        </div>
    {/if}
</main>