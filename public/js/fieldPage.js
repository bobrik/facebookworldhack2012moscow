H.pages.fieldPage = function() {
    alert(1)
    var list = document.querySelector(".keyboard .letter"),
        gameId = document.querySelector("#field").dataset.gameid;
    list.addEventListener("click", function(event) {
        H.ajaxPost("/move", {
            gameId: event.target.html(),
            letter: gameId
        });
    });
};