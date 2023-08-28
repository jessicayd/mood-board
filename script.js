const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const smolMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sept", "oct", "nov", "dec"];
const tiniMonths = ["j", "f", "m", "a", "m", "j", "j", "a", "s", "o", "n", "d"];

const currDate = new Date();
const year = currDate.getFullYear();
const month = currDate.getMonth();
const day = currDate.getDate();

const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');

let totalColorValue = 0;
let totalColors = 0;

let colorStorage = {};
let avgColor = "rgb(238, 238, 238)";

if (localStorage.getItem('colorStorage') != null) {
    colorStorage = JSON.parse(localStorage.getItem('colorStorage'));
}
if (localStorage.getItem('avgColor') != null) {
    avgColor = localStorage.getItem('avgColor');
}

let noteStorage = {};
if (localStorage.getItem('noteStorage') != null) {
    noteStorage = JSON.parse(localStorage.getItem('noteStorage'));
}

function createBoard() {
    document.getElementById("date").innerHTML = `${monthNames[month]} ${day}, ${year}`;
    document.getElementById("datePopup").valueAsDate = new Date(Date.UTC(year, month, day));

    const daysContainer = document.getElementById("days");
    for (let i = 1; i <= 31; i++) {
        let day = document.createElement('div');
        day.className = "day";
        day.innerHTML = i;
        daysContainer.append(day);
    }

    const monthsContainer = document.getElementById("fullMonths");
    for (let i = 0; i < 12; i++) {
        let month = document.createElement('div');
        month.className = "month";
        month.innerHTML = monthNames[i];
        monthsContainer.append(month);
    }

    const smolMonthsContainer = document.getElementById("smolMonths");
    for (let i = 0; i < 12; i++) {
        let month = document.createElement('div');
        month.className = "month";
        month.innerHTML = smolMonths[i];
        smolMonthsContainer.append(month);
    }

    const tiniMonthsContainer = document.getElementById("tiniMonths");
    for (let i = 0; i < 12; i++) {
        let month = document.createElement('div');
        month.className = "month";
        month.innerHTML = tiniMonths[i];
        tiniMonthsContainer.append(month);
    }

    const boxesContainer = document.getElementById("boxes");
    for (let i = 0; i < 12; i++) {
        let boxMonth = document.createElement('div');
        boxMonth.className = "boxMonth";
        for (let j = 0; j < 31; j++) {
            let box = document.createElement('div');
            if (j == 0) box.classList.add("firstCol");
            if (j == 30) box.classList.add("lastCol");
            if (i == 0) box.classList.add("firstRow");
            if (i == 11) box.classList.add("lastRow");
            box.classList.add("box");
            box.id = `${i},${j}`;
            box.id = `${i},${j}`;


            const boxDate = new Date(Date.UTC(year, i, j + 1));
            let isValidDate = (i == boxDate.getMonth());
            if (!isValidDate) box.style.backgroundColor = "#cbc8c860";

            box.addEventListener('click', function() {
                if (isValidDate) document.getElementById("datePopup").valueAsDate = boxDate;
                else return;
                console.log(boxDate);
                enterPopup();
            });

            boxMonth.append(box);

            if (colorStorage[box.id]) {
                box.style.backgroundColor = colorStorage[box.id];
                let split = colorStorage[box.id].substring(4, colorStorage[box.id].length - 1).split(", ");
                totalColorValue += getColorValue(split[0], split[1], split[2])
                totalColors += 1;
            }

        }
        boxesContainer.append(boxMonth);
    }

    updateAverage();

    const todayBox = document.getElementById(`${month},${day - 1}`);
    todayBox.classList.add('highlighted');
}

function updateAverage() {
    if (totalColors === 0) {
        document.getElementById("average").style.backgroundColor = "rgb(238, 238, 238)";
        localStorage.setItem('avgColor', "rgb(238, 238, 238)");
    } else {
        let averageColorValue = totalColorValue / totalColors;
        let averageRGB = getRGB(averageColorValue);

        document.getElementById("average").style.backgroundColor = `${averageRGB}`;
        localStorage.setItem('avgColor', `${averageRGB}`);
    }
}

function getRGB(colorValue) {
    let red;
    let green;
    let blue;

    if (colorValue <= 50) {
        red = 138+Math.floor(99*colorValue/50);
        green = 186+Math.floor(8*colorValue/50);
        blue = 211+Math.floor(5*colorValue/50);
        return `rgb(${red}, ${green}, ${blue})`;
    } else {
        red = 237+Math.floor(15*(colorValue-50)/50);
        green = 194+Math.floor(52*(colorValue-50)/50);
        blue = 216+Math.floor(19*(colorValue-50)/50);
        return `rgb(${red}, ${green}, ${blue})`;
    }
}

function getColorValue(red, green, blue) {
    let fromRedElse = (red-237) *50/15 + 50
    let fromGreenElse = (green-194) *50/52 + 50
    let fromBlueElse = (blue-216) *50/19 + 50
    let fromElse = (fromRedElse + fromGreenElse + fromBlueElse) / 3

    let fromRed = (red-138) *50/99
    let fromGreen = (green-186) *50/8
    let fromBlue = (blue-211) *50/5
    let from = (fromRed + fromGreen + fromBlue) / 3

    if (from <= 50) return from;
    return fromElse;
}

function exitPopup() {
    popup.style.animation = "fadeout 0.15s linear forwards";
    overlay.style.animation = "fadeout 0.15s linear forwards";
    setTimeout(function() {
        popup.style.display = "none";
        overlay.style.display = "none";
        document.getElementById("datePopup").valueAsDate = new Date(year, month, day);
        document.getElementById('datePopup').style.marginBottom = "10px";
        document.getElementById('error').style.display = "none";
    }, 200);
}

function enterPopup() {
    popup.style.display = "block";
    overlay.style.display = "block";
    popup.style.animation = "fadein 0.15s linear forwards";
    overlay.style.animation = "fadein 0.15s linear forwards";

    const dateInput = document.getElementById('datePopup');
    const date = dateInput.value.split("-");

    const id = `${date[1] - 1},${date[2] - 1}`;
    if (colorStorage[id]) {
        let rgb = colorStorage[id].substring(4, colorStorage[id].length - 1).split(", ");
        let colorValue = getColorValue(rgb[0], rgb[1], rgb[2]);
        document.getElementById("picker").value = colorValue;
    }
    else document.getElementById("picker").value = 50;

    const storedNote = noteStorage[id];
    if (storedNote) {
        document.getElementById('note').value = storedNote;
    }
    else document.getElementById('note').value = "";
}


document.addEventListener('DOMContentLoaded', function() {
    createBoard();

    document.getElementById('addEntry').addEventListener('click',enterPopup);
    document.getElementById('exit').addEventListener('click', exitPopup);
    document.getElementById('overlay').addEventListener('click', exitPopup);

    document.getElementById('reset').addEventListener('click', function() {
        const dateInput = document.getElementById('datePopup');
        const date = dateInput.value.split("-");
        const currBox = document.getElementById(`${date[1] - 1},${date[2] - 1}`);

        const storedColor = colorStorage[`${date[1] - 1},${date[2] - 1}`];

        if (storedColor) {
            let split = storedColor.substring(4, storedColor.length - 1).split(", ");

            totalColorValue -= getColorValue(split[0], split[1], split[2]);
            totalColors -= 1

            updateAverage();
        }
        currBox.style.backgroundColor = "rgb(238, 238, 238)";
        
        delete colorStorage[`${date[1] - 1},${date[2] - 1}`];
        delete noteStorage[`${date[1] - 1},${date[2] - 1}`];
        localStorage.setItem('colorStorage', JSON.stringify(colorStorage));
        localStorage.setItem('noteStorage', JSON.stringify(noteStorage));

        exitPopup();
    })
    popup.addEventListener('submit', function(event) {
        event.preventDefault(); 

        // get value of picker
        const colorValue = document.getElementById("picker").value;
        let rgbColor = getRGB(colorValue);

        const dateInput = document.getElementById('datePopup');
        const date = dateInput.value.split("-");

        if (date[0] != year || date[1] > currDate.getMonth()+1 || (date[1] == currDate.getMonth()+1 && date[2] > currDate.getDate())) {
            document.getElementById('error').style.display = "block";
            dateInput.style.marginBottom = "0px";
            return;
        }

        dateInput.style.marginBottom = "10px";
        document.getElementById('error').style.display = "none";
        
        const currBox = document.getElementById(`${date[1] - 1},${date[2] - 1}`);
        currBox.style.backgroundColor = rgbColor;

        const storedColor = colorStorage[`${date[1] - 1},${date[2] - 1}`];
        if (storedColor) {
            let split = storedColor.substring(4, storedColor.length - 1).split(", ");

            totalColorValue -= getColorValue(split[0], split[1], split[2]);
            totalColors -= 1
        }

        let split = rgbColor.substring(4, rgbColor.length - 1).split(", ");

        totalColorValue += getColorValue(split[0], split[1], split[2]);
        totalColors += 1
        updateAverage();

        // store color
        colorStorage[`${date[1] - 1},${date[2] - 1}`] = currBox.style.backgroundColor;
        noteStorage[`${date[1] - 1},${date[2] - 1}`] = document.getElementById('note').value;
        localStorage.setItem('colorStorage', JSON.stringify(colorStorage));
        localStorage.setItem('noteStorage', JSON.stringify(noteStorage));
        exitPopup();
    });

})

