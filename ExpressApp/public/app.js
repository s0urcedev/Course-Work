fetch(`${window.location.origin}/test`)
    .then((res) => 
    {
        return res.json();
    })
    .then((data) =>
    {
        console.log(data);
    });