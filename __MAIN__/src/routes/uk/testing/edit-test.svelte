<script>
    import { onMount } from 'svelte';
    import { calculateLevels } from '../../../tools/calculations';

    export let numberOfQuestionsForStudent = 1, numberOfQuestionsForTeacher, numberOfMaxPoints, levelsOfQuestions;
    $: numberOfQuestionsForTeacher = (numberOfQuestionsForStudent * (1 + numberOfQuestionsForStudent)) / 2;
    $: numberOfMaxPoints = ((numberOfQuestionsForStudent * (3 * numberOfQuestionsForStudent - 1)) / 2);
    $: levelsOfQuestions = calculateLevels(numberOfQuestionsForStudent);

    export let gotTestFields = {}, testId = '', isLoggedin = false, gotName, gotEmail, gotPassword, shareLink = '', numberOfAnswers = Array(78).fill(2), screenWidth;

    onMount(async () => {
        screenWidth = screen.width;
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        testId = urlParams.get('id');
        shareLink = `${window.location.origin}/uk/testing/start-session?id=${testId}`;
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
            gotTestFields = await (await fetch(`/api/testing/get-test?id=${testId}`)).json();
            if (gotTestFields['authorsEmail'] !== gotEmail) {
                gotTestFields = undefined;
                window.location.href = '/uk?message=Ви не власник цього тесту';
            } else {
                numberOfQuestionsForStudent = Number(gotTestFields['numberOfQuestionsForStudent']);
            }
            for (let i = 0; i < gotTestFields['questions'].length; i ++) {
                numberOfAnswers[i] = gotTestFields['questions'][i]['numberOfAnswers'];
            }
        } else {
            window.location.href = '/uk/authorization/login?message=Login please';
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
        width: 1000px;
        background-color: #FFFFFF;
        padding: 10px;
        border-radius: 25px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    }

    @media screen and (max-width: 1050px) {
        main {
            width: 500px;
        }
    }

    .edit-test-form span {
        font-family: "e-Ukraine", sans-serif;
        color: #009075;
        font-size: 22px;
        display: block;
        text-align: center;
        margin-top: 5px;
    }

    .edit-test-form div span {
        display: inline-block;
        width: 32.7%;
        vertical-align: top;
    }

    .edit-test-form input {
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

    .edit-test-form div input {
        display: inline-block;
        width: 32.7%;
        vertical-align: top;
    }

    .edit-test-form textarea {
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

    .edit-test-form input::placeholder {
        color: #009075;
        font-weight: 200;
    }

    .edit-test-form textarea::placeholder {
        color: #009075;
        font-weight: 200;
    }

    .edit-test-form button {
        font-family: "e-Ukraine", sans-serif;
        text-transform: uppercase;
        display: inline-block;
        outline: 0;
        background: #009075;
        width: 225px;
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

    .edit-test-form button:hover {
        opacity: 0.85;
    }
</style>

<svelte:head>
    <title>Редагувати тест</title>
</svelte:head>

<main>
    <form id="editTestForm" on:submit={(event) => { event.preventDefault(); }} action="/api/testing/edit-test" method="post" class="edit-test-form">
        <div style="text-align: center;">
            <span><b>ІД тесту:</b></span>
            <span><b>Пошта автора:</b></span>
            <span><b>Ім'я тесту:</b></span>
        </div>
        <div style="text-align: center;">
            <input type="text" readonly="true" value={gotTestFields['_id']} name="id" placeholder="ІД тесту">
            <input type="text" readonly="true" value={gotTestFields['authorsEmail']} name="authorsEmail" placeholder="Пошта автора">
            <input type="text" value={gotTestFields['name']} name="name" placeholder="Ім'я тесту">
        </div>
        <div style="text-align: center;">
            <span><b>Кількість питань для учня (від 1 до 12):</b></span>
            <span><b>Кількість питань для вчителя:</b></span>
            <span><b>Максимальна кількість балів:</b></span>
        </div>
        <div style="text-align: center;">
            <input type="number" min=1 max=12 bind:value={numberOfQuestionsForStudent} name="numberOfQuestionsForStudent" placeholder="Кількість питань для учня">
            <input type="number" min=1 max=12 readonly="true" value={numberOfQuestionsForTeacher} name="numberOfQuestionsForTeacher" placeholder="Кількість питань для вчителя">
            <input type="number" min=1 max=78 readonly="true" value={numberOfMaxPoints} name="numberOfMaxPoints" placeholder="Максимальна кількість балів">
        </div>
        <span><b>Посилання для поширення:</b></span>
        <input type="text" min=2 max=10 readonly="true" value={shareLink} name="shereLink" placeholder=''>
        {#if gotTestFields !== undefined && gotTestFields !== null}
            {#each levelsOfQuestions as level, index}
                <span><b>{index + 1}. Питання рівня {level}:</b></span>
                <textarea type="text" value={gotTestFields['questions'] !== undefined ? (gotTestFields['questions'][index] !== undefined ? gotTestFields['questions'][index]['text'] : '') : ''} name="question{index + 1}Level{level}Text" placeholder="Текст для питання рівня {level}"></textarea>
                <span>Кількість відповідей (від 2 до 10):</span>
                <input type="number" style="width: 400px; display: block; margin: auto;" min=2 max=10 bind:value={numberOfAnswers[index]} name="numberOfAnswers{index + 1}" placeholder=''>
                <textarea style="color: green;" value={gotTestFields['questions'] !== undefined ? (gotTestFields['questions'][index] !== undefined ? gotTestFields['questions'][index]['rightAnswer'] : '') : ''} name="question{index + 1}Level{level}RightAnswer" placeholder="Правильна відповідь для питання рівня {level}"></textarea>
                {#each Array((numberOfAnswers[index] ?? 2) - 1) as _, iindex}
                    <textarea style="color: red;" value={gotTestFields['questions'] !== undefined ? (gotTestFields['questions'][index] !== undefined ? gotTestFields['questions'][index]['wrongAnswers'][iindex] ?? '' : '') : ''} name="question{index + 1}Level{level}WrongAnswer{iindex + 1}" placeholder="Неправильна відповідь для питання рівня {level}"></textarea>
                {/each}
            {/each}
        {/if}
        <div style="margin: auto; text-align: center;">
            <button type="button" on:click={() => { document.getElementById('editTestForm').submit(); }}>Зберегти</button>
            <button type="button" style="background-color: red; margin-left:5px;" on:click={() => {
                if (confirm('Ви впевнені, що хочете видалити цей тест?')) {
                    fetch(`/api/testing/delete-test?id=${testId}`).then((res) => res.json()).then((data) => window.location.href = `/uk/${data.url}`);
                }
            }}>Видалити</button>
        </div>
    </form>
</main>