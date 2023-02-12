<script>
    import { onMount } from 'svelte';

    export let isLoggedin = false;
    export let gotName = '', gotEmail = '', gotPassword = '';
    export let doNotTry = false;

    onMount(async () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
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
        } else if (doNotTry !== true) {
            microsoftTeams.initialize(); // eslint-disable-line no-undef
            setTimeout(async () => {
                if (microsoftTeams.app.isInitialized()) { // eslint-disable-line no-undef
                    let context = await microsoftTeams.app.getContext(); // eslint-disable-line no-undef
                    try {    
                        let res = await fetch('/api/authorization/authorize-for-teams', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: context.user.id,
                                organization: context.sharePointSite.teamSiteDomain.slice(0, context.sharePointSite.teamSiteDomain.indexOf('.'))
                            })
                        });
                        if (res.status === 200) {
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
                            } else {
                                doNotTry = true;
                            }
                        } else {
                            doNotTry = true;
                        }
                    } catch (err) {
                        doNotTry = true;
                    }
                }
            }, 500);
        }
    });
</script>

<style>
    /* en */
    .header {
        position: relative;
        display: inline-block;
        margin: auto;
        margin-top: 15px;
        background-color: #FFFFFF;
        padding: 15px;
        border-radius: 25px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    }

    main {
        position: relative;
        display: block;
        margin: auto;
        margin-top: 20px;
        background-color: #FFFFFF;
        padding: 10px;
        width: 435px;
        border-radius: 25px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    }

    button {
        font-family: "e-Ukraine", sans-serif;
        text-transform: uppercase;
        display: inline-block;
        outline: 0;
        background: #009075;
        width: 425px;
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

    span {
        font-family: "e-Ukraine", sans-serif;
        color: #009075;
        font-size: 28px;
        display: block;
        text-align: center;
        margin-top: 5px;
    }
</style>

<svelte:head>
    <title>Home page</title>
</svelte:head>

{#if isLoggedin === true}
    <div style="margin: auto; text-align: center;">
        <span class="header">Hello, <b>{gotName} ({gotEmail})</b></span>
    </div>
{/if}

<main>
    <div style="margin: auto; text-align: center;">
        <a href="/en/testing/start-session">
            <button>Take a test</button>
        </a>
    </div>
    {#if isLoggedin === true}
        <div style="margin: auto; text-align: center;">
            <a href="/api/testing/create-test">
                <button>Create a test</button>
            </a>
        </div>
        <div style="margin: auto; text-align: center;">
            <a href="/en/testing/choose-test?link=edit-test">
                <button>Edit a test</button>
            </a>
        </div>
        <div style="margin: auto; text-align: center;">
            <a href="/en/testing/choose-test?link=view-tests-results">
                <button>View results</button>
            </a>
        </div>
        <div style="margin: auto; text-align: center;">
            <a href="/en/authorization">
                <button>Change an account</button>
            </a>
        </div>
        <div style="margin: auto; text-align: center;">
            <a href="/api/authorization/sign-out">
                <button>Sign out</button>
            </a>
        </div>
    {:else}
        <div style="margin: auto; text-align: center;">
            <a href="/en/authorization">
                <button>Authorize</button>
            </a>
        </div>
    {/if}
</main>