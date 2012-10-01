H.pages.friendsPage = function() {
    var list = document.querySelector("ul.itemList");
    console.log(list)
    list.addEventListener("click", function(event){
        var elm = H.closest("li", event.target);
        if (elm && elm.dataset.installed) {
            H.ajaxPost("/create", {
                id: elm.dataset.fbid,
                word: "test"
            })
        }
    });
}