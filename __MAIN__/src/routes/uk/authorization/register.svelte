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
    /* uk */
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

    .register-form span.title {
        font-family: "e-Ukraine", sans-serif;
        color: #009075;
        font-weight: 500;
        font-size: 28px;
        display: block;
        text-align: center;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .register-form span {
        font-family: "e-Ukraine", sans-serif;
        color: #009075;
        font-size: 16px;
        display: block;
        text-align: center;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .register-form a {
        font-weight: 800;
    }

    .register-form input {
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

    .register-form button {
        font-family: "e-Ukraine", sans-serif;
        text-transform: uppercase;
        text-align: center;
        display: block;
        outline: 0;
        background: #009075;
        width: 95%;
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

    .register-form button:hover {
        opacity: 0.85;
    }

    .register-form a:hover {
        opacity: 0.85;
    }

    .register-form input::placeholder {
        color: #009075;
        font-weight: 200;
    }

</style>

<svelte:head>
    <title>Реєстрація</title>
</svelte:head>

<main>
    <form action="/api/authorization/register" method="post" class="register-form">
        <span class="title">Реєстрація:</span>
        <input type="text" name="name" placeholder="ім'я" required>
        <input type="email" name="email" placeholder="пошта" required>
        <input type="password" name="password" placeholder="пароль" required>
        <input type="password" name="confirmPassword" placeholder="пароль-підтвердження" required>
        {#if message !== null}
            <span style="color: red; margin-top: 10px; margin-bottom: -5px;">{message}</span>
        {/if}
        <button type="submit">Зареєструвати</button>
        <span style="margin-top: -5px;">Вже маєте акаунт? <a href="uk/authorization/login">Вхід</a></span>
    </form>
</main>