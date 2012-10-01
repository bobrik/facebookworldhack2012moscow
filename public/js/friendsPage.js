H.pages.friendsPage = function() {
    var list = document.querySelector("ul.itemList");
    H.initFbAPI();
    list.addEventListener("click", function(event){

        var cnt = "";
        var words = H.getWords();
        var elm = H.closest("li", event.target);

        for (var i in words) {
            cnt +=  "<a class='button word' href='javascript:;'>" + words[i] + "</a>";
        }

        H.popup.show({
            title: "Choose the word",
            content: cnt
        });

        var elms = document.querySelectorAll(".word");

        for (var j in elms) {
            elms[j].addEventListener("click", function(event){
                H.popup.hide();
                if (elm && elm.dataset.installed == 1) {
                    H.ajaxPost("/create", {
                        id: elm.dataset.fbid,
                        word: event.target.innerTextf
                    });

                } else {
                    FB.ui({method: 'apprequests',
                        message: 'Hey! Play with me!',
                        to: elm.dataset.fbid
                    }, function(resp){
                        if (resp && resp.to) {
                            H.ajaxPost("/create", {
                                id: elm.dataset.fbid,
                                word: event.target.innerHTML
                            }, function(resp){
                                if (resp.game)
                                   location.href = "/field/?id=" + resp.game.game_id;
                            });
                        }
                    });
                }
            });
        }



    });
}