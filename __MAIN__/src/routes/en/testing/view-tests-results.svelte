<script>
    import { onMount } from 'svelte';
    import xlsx from 'json-as-xlsx';

    export let testId, test, testsResults, isLoggedin = false, gotName, gotEmail, gotPassword;

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
            isLoggedin = true;
            if (testId !== undefined && testId !== '') {
                testsResults = await (await fetch(`/api/testing/get-tests-results?id=${testId}`)).json();
                test = await (await fetch(`/api/testing/get-test?id=${testId}`)).json();
            }
            if (test['authorsEmail'] !== gotEmail) {
                window.location.href = '/en?message=You are not owner of that test';
            }
        } else {
            window.location.href = '/en/authorization/login?message=Login please';
        }
    });

    function exportTable() {
        xlsx([
            {
                sheet: 'Results',
                columns: [
                    { label: 'Name', value: 'userName' },
                    { label: 'Start date', value: (row) => (new Date(row['startDate'])).toUTCString() },
                    { label: 'End date', value: (row) => (new Date(row['endDate'])).toUTCString() },
                    { label: 'Score', value: 'score' },
                    { label: 'Max score', value: () => test['numberOfMaxPoints'] },
                    { label: 'Ratio', value: (row) => row['score'] / test['numberOfMaxPoints'] },
                    { label: 'Percentage', value: (row) => row['score'] / test['numberOfMaxPoints'] * 100 }
                ],
                content: testsResults
            }
        ], {
            fileName: test['name'] + ' results'
        });
    }
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

    span {
        font-family: "e-Ukraine", sans-serif;
        color: #009075;
        display: block;
        margin-top: 5px;
    }

    button {
        font-family: "e-Ukraine", sans-serif;
        text-transform: uppercase;
        display: block;
        outline: 0;
        background: #009075;
        width: 200px;
        margin: auto;
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

    button:hover {
        opacity: 0.85;
    }

    td {
        font-size: 24px;
        padding: 5px;
        vertical-align: top;
        border: 2px solid #009075;
        border-collapse: collapse;
    }

</style>

<svelte:head>
    <title>View test's results</title>
</svelte:head>

<main>
    {#if testsResults !== undefined && testsResults !== null && test !== undefined && test !== null}
        {#if testsResults.length > 0}
            <span style="font-size: 28px; text-align: center"><b>{test['name']}</b> results:</span>
            <table style="margin-top: 10px; width: 100%; border: 2px solid #009075; border-collapse: collapse">
                <tr>
                    <td style="background-color: #009075; color: #FFFFFF; text-align: center"><b>Name</b></td>
                    <td style="background-color: #009075; color: #FFFFFF; text-align: center"><b>Start date</b></td>
                    <td style="background-color: #009075; color: #FFFFFF; text-align: center"><b>End date</b></td>
                    <td style="background-color: #009075; color: #FFFFFF; text-align: center"><b>Score</b></td>
                </tr>
                {#each testsResults as result}
                    <tr>
                        <td>{result['userName']}</td>
                        <td>{new Date(result['startDate']).toUTCString()}</td>
                        <td>{new Date(result['endDate']).toUTCString()}</td>
                        <td>{result['score']}/{test['numberOfMaxPoints']}</td>
                    </tr>
                {/each}
            </table>
        {:else}
            <span style="font-size: 28px; text-align: center"><b>{test['name']}</b> hasn't got any results</span>
        {/if}
        <button on:click={exportTable}>Export</button>
    {/if}
</main>