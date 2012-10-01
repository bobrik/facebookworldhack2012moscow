H.pages.startPage = function() {
    var startButton = H.ge("startGame");
    startButton.addEventListener("click", function(){
        H.popup.show({title: "Start Game", content: "<a class='button' id='friends'>With Friends</a><a class='button'  id='random'>With Random User</a>"});
    });
}