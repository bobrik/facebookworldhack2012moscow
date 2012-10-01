H.pages.startPage = function() {
    var startButton = H.ge("startGame");
    startButton.addEventListener("click", function(){
        H.popup.show({title: "Start Game", conetnt: "<a id='123'>Buttton!!!</a>"});
    });
}