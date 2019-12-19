document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("LastName").innerHTML = localStorage["nameGamer"];
    document.getElementById("LastScore").innerHTML = localStorage["score"];
    document.getElementById("Gamer1").innerHTML = localStorage["gamer1"];
    document.getElementById("Score1").innerHTML = localStorage["result1"];
    document.getElementById("Gamer2").innerHTML = localStorage["gamer2"];
    document.getElementById("Score2").innerHTML = localStorage["result2"];
    document.getElementById("Gamer3").innerHTML = localStorage["gamer3"];
    document.getElementById("Score3").innerHTML = localStorage["result3"];
    document.getElementById("Gamer4").innerHTML = localStorage["gamer4"];
    document.getElementById("Score4").innerHTML = localStorage["result4"];
    document.getElementById("Gamer5").innerHTML = localStorage["gamer5"];
    document.getElementById("Score5").innerHTML = localStorage["result5"];
});
