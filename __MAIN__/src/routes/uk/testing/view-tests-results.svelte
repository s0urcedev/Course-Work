<script>
    import { onMount } from "svelte";

    export let testId, test, testsResults, isLoggedin = false, gotName, gotEmail, gotPassword;

    onMount(async () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.get("id") !== null) {
            testId = urlParams.get("id");
        }
        if (urlParams.get("message") !== null) {
            alert(urlParams.get("message"));
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
            isLoggedin = true;
            if (testId !== undefined && testId !== '') {
                testsResults = await (await fetch(`/api/testing/get-tests-results?id=${testId}`)).json();
                test = await (await fetch(`/api/testing/get-test?id=${testId}`)).json();
            }
            if (test['authorsEmail'] !== gotEmail) {
                window.location.href = "/uk?message=You are not owner of that test";
            }
        } else {
            window.location.href = "/uk/authorization/login?message=Login please";
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

</style>

<svelte:head>
    <title>Перегляд результатів тесту</title>
</svelte:head>

<main>
    {#if testsResults !== undefined && testsResults !== null && test !== undefined && test !== null}
        {#if testsResults.length > 0}
            <span style="font-size: 28px; text-align: center"><b>{test['name']}</b> результати:</span>
            {#each testsResults as result}
                <div style="margin-top: 10px; border: 2px solid #009075; border-radius: 15px; width:99%">
                    <span style="font-size: 24px; margin-left: 5px">Ім'я користувача: <b>{result['userName']}</b></span>
                    <span style="font-size: 24px; margin-left: 5px">Дата початку: <b>{new Date(result['startDate']).toUTCString()}</b></span>
                    <span style="font-size: 24px; margin-left: 5px">Дата кінця: <b>{new Date(result['endDate']).toUTCString()}</b></span>
                    <span style="font-size: 24px; margin-left: 5px">Рахунок: <b>{result['score']}/{test['numberOfMaxPoints']}</b></span>
                </div>
            {/each}
        {:else}
            <span style="font-size: 28px; text-align: center"><b>{test['name']}</b> не отримав жодного результату</span>
        {/if}
    {/if}
</main>