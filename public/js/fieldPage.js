H.pages.fieldPage = function() {
    var list = document.querySelectorAll(".keyboard .letter"),
        gameId = document.querySelector("#field").dataset.gameid;

    for (var i in list) {
        var key = list[i];
        key.addEventListener("click", function(event) {
            H.ajaxPost("/move", {
                letter: event.target.innerHTML,
                game_id: gameId
            }, function(response){
                if (!response.fineshed) {

                } else {
                    location.href = location.href;
                }
            });
        });
    }

};