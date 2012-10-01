H.pages.fieldPage = function() {
    var list = document.querySelector(".keyboard .letter"),
        gameId = document.querySelector("#field").dataset.gameid;
    list.addEventListener("click", function(event) {
        H.ajaxPost("/move", {
            letter: event.target.innerHTML,
            game_id: gameId
        }, function(){
            location.href = location.href;
        });
    });
};