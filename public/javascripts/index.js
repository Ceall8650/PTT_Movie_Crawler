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
    })
    .then(rs => rs.json())
    .then(rs => {
        const data = classify(rs);
        showStats(data);
        showArticls(data);
    })

}

function classify(data) {
    const rs = {good: [], normal: [], bad: [], other: []};

    data.forEach(item => {
        if(/好|爽|佳/.test(item.category)) {
            rs.good.push(item);
            return false;
        }
        else if(/爛|負/.test(item.category)) {
            rs.bad.push(item);
            return false;
        }
        else if(/普/.test(item.category)) {
            rs.normal.push(item);
            return false;
        }
        else {
            rs.other.push(item);
        }
    })

    return rs
}

function showStats(data) {
    const goodCnt = data.good.length;
    const nroamlCnt = data.normal.length;
    const badCnt = data.bad.length;
    const otherCnt = data.other.length;
    const total = goodCnt + badCnt + nroamlCnt;

    document.querySelector('.total .num').innerHTML = total;
    document.querySelector('#stats .good .num').innerHTML = goodCnt;
    document.querySelector('#stats .normal .num').innerHTML = nroamlCnt;
    document.querySelector('#stats .bad .num').innerHTML = badCnt;
    document.querySelector('#stats .other .num').innerHTML = badCnt;
    document.querySelector('#result .temperature').innerHTML = `推薦指數: ${Math.round((goodCnt / total)*100)}％`;
    document.querySelector('#result').classList.remove('hide');
    if(total === 0) document.querySelector('#result').classList.add('hide');
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
    otherList = data.other.map(item => `
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
    document.querySelector('#list .other tbody').innerHTML = otherList;
}