async function user(){
    let res = await fetch(`${window.location.origin}/api/user`);
    console.log(res);
    if (res.status == 200) {
        let data = await res.json();
        console.log(data);
        document.getElementById('userSpan').innerHTML = `Name: ${data.displayName}\nMail: ${data.mail}`;
    } else {
        let data = res.statusText;
        console.log(data);
        document.getElementById('userSpan').innerHTML = data;
    }
}

async function inbox(){
    let res = await fetch(`${window.location.origin}/api/inbox`);
    if (res.status == 200) {
        let data = await res.json();
        console.log(data);
        let text = "";
        if (data.length == 0) {
            text = "Your inbox is empty";
        } else {
            for (const message of data) {
                text += `Message: ${message.subject ?? 'NO SUBJECT'}\n`;
                text += `  From: ${message.from.emailAddress.name ?? 'UNKNOWN'}\n`;
                text += `  Status: ${message.isRead ? 'Read' : 'Unread'}\n`;
                text += `  Received: ${message.receivedDateTime}\n`;
                text += `\n`;
            }
        }
        document.getElementById('inboxSpan').innerHTML = text;
    } else {
        let data = res.statusText;
        console.log(data);
        document.getElementById('inboxSpan').innerHTML = data;
    }
}

async function users(){
    let res = await fetch(`${window.location.origin}/api/users`);
    if (res.status == 200) {
        let data = await res.json();
        console.log(data);
        let text = "";
        for (const user of data) {
            text += `User: ${user.displayName ?? 'NO NAME'}\n`;
            text += `  ID: ${user.id}\n`;
            text += `  Email: ${user.mail ?? 'NO EMAIL'}\n`;
            text += `\n`;
        }
        document.getElementById('usersSpan').innerHTML = text;
    } else {
        let data = res.statusText;
        console.log(data);
        document.getElementById('usersSpan').innerHTML = data;
    }
}

async function joinedTeams(){
    let res = await fetch(`${window.location.origin}/api/joinedTeams`)
    if (res.status == 200) {
        let data = await res.json();
        console.log(data);
        let text = "";
        for (const team of data) {
            text += `Team: ${team.displayName ?? 'NO NAME'}\n`;
            text += `  ID: ${team.id}\n`;
            text += `  Description: ${team.description ?? 'NO DESCRIPTION'}\n`;
            text += `\n`;
        }
        document.getElementById('joinedTeamsSpan').innerHTML = text;
    } else {
        let data = res.statusText;
        console.log(data);
        document.getElementById('joinedTeamsSpan').innerHTML = data;
    }
}