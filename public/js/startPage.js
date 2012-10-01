H.pages.startPage = function() {
    var startButton = H.ge("startGame");
    startButton.addEventListener("click", function(){
        alert("pressed")
        H.popup.show({title: "Start Game"});
    });
}