<script>
</script>

<style>
    main {
        position: relative;
        display: block;
        margin: auto;
        margin-top: 20px;
        background-color: #FFFFFF;
        padding: 10px;
        width: 315px;
        border-radius: 25px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    }

    button {
        font-family: "e-Ukraine", sans-serif;
        text-transform: uppercase;
        display: inline-block;
        outline: 0;
        background: #009075;
        width: 305px;
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
    <title>Мова / Language</title>
</svelte:head>

<main>
    <div style="margin: auto; text-align: center;">
        <span>Оберіть мову:</span>
        <a href="/uk">
            <button>Українська</button>
        </a>
        <span>Choose a language:</span>
        <a href="/en">
            <button>English</button>
        </a>
    </div>
</main>