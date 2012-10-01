H.pages.startPage = function() {
    alert(1)
    var startButton = H.ge("startGame");
    startButton.addEventListener("click", function(){
        H.popup.show({title: "Start Game"});
    });
}