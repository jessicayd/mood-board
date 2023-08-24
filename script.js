function createBoard() {
    const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const date = new Date();
    document.getElementById("date").innerHTML = `${monthNames[date.getMonth()]} ${date.getDay()}, ${date.getFullYear()}`;

    const daysContainer = document.getElementById("days");
    for (let i = 1; i <= 31; i++) {
        let day = document.createElement('div');
        day.className = "day";
        day.innerHTML = i;
        daysContainer.append(day);
    }

    const monthsContainer = document.getElementById("months");
    for (let i = 0; i < 12; i++) {
        let month = document.createElement('div');
        month.className = "month";
        month.innerHTML = monthNames[i];
        monthsContainer.append(month);
    }

    const boxesContainer = document.getElementById("boxes");
    for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 31; j++) {
            let box = document.createElement('div');
            if (j == 0) box.classList.add("firstCol");
            if (j == 30) box.classList.add("lastCol");
            if (i == 0) box.classList.add("firstRow");
            if (i == 11) box.classList.add("lastRow");
            box.classList.add("box");
            box.id = `${i}${j}`;
            boxesContainer.append(box);
        }
    }
}

function getHex() {
    const form = document.getElementById('numberForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        const hexInput = document.getElementById('hexInput');
        const dateInput = document.getElementById('dateInput');
        const date = dateInput.value.split(',');
        
        const currBox = document.getElementById(`${date[0]}${date[1]}`);
        currBox.style.backgroundColor = `#${hexInput.value}`;
        console.log("hi")
    });
}

document.addEventListener('DOMContentLoaded', function() {
    createBoard();
    getHex();
})