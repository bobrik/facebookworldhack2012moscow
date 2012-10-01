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
                if (response.fineshed) {
                    if (response.game.i_won || response.game.i_hang_up) {
                        H.popup.show({
                            title: "You win!",
                            content: ""
                        });
                        response.game.i_hang_u && H.oghang(response.game.partner);
                        H.og_word(response.game.word);
                    } else {
                        H.popup.show({
                            title: "You loose!",
                            content: ""
                        });
                    }


                } else {
                    location.href = location.href;
                }
            });
        });
    }

};