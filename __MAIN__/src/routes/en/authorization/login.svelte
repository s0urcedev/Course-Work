<script>
    import { onMount } from 'svelte';
    export let message = undefined;
    onMount(async () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        message = urlParams.get('message');
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
        width: 300px;
        border-radius: 25px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    }

    .login-form span.title {
        font-family: "e-Ukraine", sans-serif;
        color: #009075;
        font-weight: 500;
        font-size: 28px;
        display: block;
        text-align: center;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .login-form span {
        font-family: "e-Ukraine", sans-serif;
        color: #009075;
        font-size: 16px;
        display: block;
        text-align: center;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .login-form a {
        font-weight: 800;
    }

    .login-form input {
        font-family: "e-Ukraine", sans-serif;
        outline: 0;
        background: #EDEDED;
        width: 100%;
        border: 0;
        margin: auto;
        margin-top: 10px;
        padding: 10px;
        color: #009075;
        font-weight: 500;
        box-sizing: border-box;
        font-size: 18px;
        border-radius: 15px;
        text-align: center;
    }

    .login-form button {
        font-family: "e-Ukraine", sans-serif;
        text-transform: uppercase;
        text-align: center;
        display: block;
        outline: 0;
        background: #009075;
        width: 50%;
        margin: auto;
        margin-top: 20px;
        margin-bottom: 20px;
        border: 0;
        padding: 15px;
        color: #FFFFFF;
        font-weight: 400;
        font-size: 24px;
        -webkit-transition: all 0.3 ease;
        transition: all 0.3 ease;
        cursor: pointer;
        border-radius: 15px;
    }

    .login-form button:hover {
        opacity: 0.85;
    }

    .login-form a:hover {
        opacity: 0.85;
    }

    .login-form input::placeholder {
        color: #009075;
        font-weight: 200;
    }

</style>

<svelte:head>
    <title>Login</title>
</svelte:head>

<main>
    <form action="/api/authorization/login" method="post" class="login-form">
        <span class="title">Login:</span>
        <input type="email" name="email" placeholder="email" required>
        <input type="password" name="password" placeholder="password" required>
        {#if message !== null}
            <span style="color: red; margin-top: 10px; margin-bottom: -5px;">{message}</span>
        {/if}
        <button>login</button>
        <span style="margin-top: -5px;">Don't have an account? <a href="en/authorization/register">Register</a></span>
    </form>
</main>