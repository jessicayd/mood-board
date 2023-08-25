const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const currDate = new Date();
const year = currDate.getFullYear();

const popup = document.getElementById('popup');
const overlay = document.getElementById('overlay');

function createBoard() {
    document.getElementById("date").innerHTML = `${monthNames[currDate.getMonth()]} ${currDate.getDate()}, ${year}`;
    document.getElementById("datePopup").valueAsDate = currDate;
    

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
    popup.addEventListener('submit', function(event) {
        event.preventDefault(); 

        // const hexInput = document.getElementById('picker');
        const hexInput = "c9ae61"; // temp
        const dateInput = document.getElementById('datePopup');
        const date = dateInput.value.split("-");

        if (date[0] != year || date[1] > currDate.getMonth()+1 || (date[1] == currDate.getMonth()+1 && date[2] > currDate.getDate())) {
            document.getElementById('error').style.display = "block";
            dateInput.style.marginBottom = "0px";
            return;
        }

        dateInput.style.marginBottom = "10px";
        document.getElementById('error').style.display = "none";
        
        const currBox = document.getElementById(`${date[1] - 1}${date[2] - 1}`);
        currBox.style.backgroundColor = `#${hexInput}`;

        exitPopup();
    });
}

function exitPopup() {
    popup.style.animation = "fadeout 0.15s linear forwards";
    overlay.style.animation = "fadeout 0.15s linear forwards";
    setTimeout(function() {
        popup.style.display = "none";
        overlay.style.display = "none";
    }, 200);
}

function pickColor() {
    
}

document.addEventListener('DOMContentLoaded', function() {
    createBoard();
    getHex();

    document.getElementById('addEntry').addEventListener('click', function() {
        popup.style.display = "block";
        overlay.style.display = "block";
        popup.style.animation = "fadein 0.15s linear forwards";
        overlay.style.animation = "fadein 0.15s linear forwards";
    })

    document.getElementById('exit').addEventListener('click', exitPopup);

    document.getElementById('overlay').addEventListener('click', exitPopup);
})