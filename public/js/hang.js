var H = {
    init: function(pageName) {
        if (H.pages[pageName]) {
            this.page = new H.pages[pageName]();
        }
    },

    ge: function(id) {
        return document.getElementById(id);
    },

    /**
     * @namespace
     */
    pages:{},

    popup: {
        el: null,

        show: function(props) {
            var block = this.getEl();
            var title = block.querySelector(".title");
            var overlay = H.ge("overlay");
            var content = block.querySelector(".content");
            title.innerText = props.title;
            content.innerHTML = props.content;

            block.style.display = "block";
            overlay.style.display = "block";

            var documentWidth = window.innerWidth / 2 + window.pageXOffset - (block.offsetWidth / 2);
            var documentHeight = window.innerHeight / 2 + window.pageYOffset - (block.offsetHeight / 2);

            block.style.left = documentWidth + "px";
            block.style.top = documentHeight + 50 + "px";

            var close = block.querySelector(".close")
            close.removeEventListener("click");
            close.addEventListener("click", function(){
                H.popup.hide(); //!!!!!
            });
        },

        hide: function() {
            this.getEl().style.display = "none";
            H.ge("overlay").style.display = "none";
        },

        getEl: function(){
            if (!this.el) {
                this.el = H.ge("popup");
            }
            return this.el;
        }
    },


    closest: function(nodeName, elm) {

        if (elm.nodeName.toLocaleLowerCase() != nodeName.toLowerCase()) {
            if (elm.parentNode) {
                 return H.closest(elm.parentNode);
            }
            return null;
        } else {
            return elm;
        }

    }
}