H.pages.startPage = function() {
//    var startButton = H.ge("startGame");
//    startButton.addEventListener("click", function(){
//        H.popup.show({title: "Start Game", content: "<a class='button' href='/friends' id='friends'>With Friends</a>" +
//            "<a class='button'  href='/random'   id='random'>With Random User</a>"});
//    });

    var list = document.querySelector("ul.itemList");
    list.addEventListener("click", function(event){
        list.removeEventListener("click");
        var elm = H.closest("li", event.target);
        if (elm.dataset.incoming == 1) {
            if (elm.dataset.opponent_word) {
                location = "/field/?id=" + elm.dataset.game_id;
            } else {
                var words = H.getWords();
                var elm = H.closest("li", event.target);
                var cnt = "";

                for (var i in words) {
                    cnt +=  "<a class='button word' href='javascript:;'>" + words[i] + "</a>";
                }

                H.popup.show({
                    title: "Choose the word",
                    content: cnt
                });

                var elms = document.querySelectorAll(".word");

                for (var j in elms) {
                   elms[j].addEventListener && elms[j].addEventListener("click", function(event){
                        H.popup.hide();

                        H.ajaxPost("/reply", {
                            game_id: elm.dataset.game_id,
                            word: event.target.innerHTML
                        }, function(resp){
                            if (resp.game)
                                location.href = "/field/?id=" + elm.dataset.game_id;
                        });
                    });
                }
            }
        } else {
            if (elm.dataset.opponent_word) {
                location = "/field/?id=" + elm.dataset.game_id;
            }
        }
    });
}