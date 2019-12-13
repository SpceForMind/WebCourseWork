document.addEventListener('DOMContentLoaded', () => {
    localStorage["mode"] = document.getElementById("select").value;
    getName();
});

//отслеживает изменение введённого имени игрока
function haveChanges() {
    localStorage["nameGamer"] = document.getElementById("Name").value;
    checkName();
}

//проверка на пустое имя
function checkName() {
    document.getElementById("Button").disabled = localStorage["nameGamer"] === "";
}

//получение имени игрока
function getName() {
    document.getElementById("Name").value = localStorage["nameGamer"];
    checkName();
}

function changeSelect() {
    localStorage["mode"] = document.getElementById("select").value;
}
