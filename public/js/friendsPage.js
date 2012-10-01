H.pages.friendsPage = function() {
    var list = document.querySelector("ul.itemList");
    list.addEventListener("click", function(event){
        console.log(JSON.stringify(event))
    });
}