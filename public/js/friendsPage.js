H.pages.friendsPage = function() {
    var list = document.querySelector("ul.itemList");
    console.log(list)
    list.addEventListener("click", function(event){
        var elm = H.closest("li", event.target);
        console.log(elm);

    });
}