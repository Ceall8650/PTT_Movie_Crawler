function search(e) {
    e.preventDefault();
    const keyword = document.querySelector("#keyword").value || "";
    const payload = { keyword };
    if (!keyword) alert(`Invalid keyword ${keyword}`)
    fetch("/search", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(payload),
    }).then(rs => rs.json())
        .then(rs => {
            const data = classify(rs);
            showStats(data);
            showArticls(data);
        })

}

function classify(data) {
    const rs = {good: [], normal: [], bad: []};

    data.forEach(item => {
        if(/好|爽|佳/.test(item.category)) rs.good.push(item);
        else if(/無|普/.test(item.category)) rs.bad.push(item);
        else rs.normal.push(item);
    })

    return rs
}

function showStats(data) {
    const goodCnt = data.good.length;
    const nroamlCnt = data.normal.length;
    const badCnt = data.bad.length;

    document.querySelector('.total .num').innerHTML = goodCnt + badCnt + nroamlCnt;
    document.querySelector('#stats .good .num').innerHTML = goodCnt;
    document.querySelector('#stats .normal .num').innerHTML = nroamlCnt;
    document.querySelector('#stats .bad .num').innerHTML = badCnt;
}

function showArticls(data) {
    let goodList = [];
    let badList = [];
    let normalList = [];
    goodList = data.good.map(item => `
        <tr>
            <td>${item.nrec}</td>
            <td><a href="https://www.ptt.cc${item.link}" target="_blank">${item.title}</a></td>
            <td>${item.author}</td>
            <td>${item.date}</td>
        </tr>
    `).join('')
    normalList = data.normal.map(item => `
        <tr>
            <td>${item.nrec}</td>
            <td><a href="https://www.ptt.cc${item.link}" target="_blank">${item.title}</a></td>
            <td>${item.author}</td>
            <td>${item.date}</td>
        </tr>
    `).join('')
    badList = data.bad.map(item => `
        <tr>
            <td>${item.nrec}</td>
            <td><a href="https://www.ptt.cc${item.link}" target="_blank">${item.title}</a></td>
            <td>${item.author}</td>
            <td>${item.date}</td>
        </tr>
    `).join('')
    document.querySelector('#list .good tbody').innerHTML = goodList;
    document.querySelector('#list .normal tbody').innerHTML = normalList;
    document.querySelector('#list .bad tbody').innerHTML = badList;
}