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
            var title = block.querySelectorAll(".title");
            var content = block.querySelectorAll(".content");
            title.innerText = props.title;
            content.innerHTML = props.content;

            var documentWidth = window.innerWidth / 2 + window.pageXOffset - (block.offsetWidth / 2);
            var documentHeight = window.innerHeight /2 + window.pageYOffset - (block.offsetHeight / 2);

            console.log(documentWidth, documentHeight, block.width, title);

            block.style.left = documentWidth + "px";
            block.style.top = documentHeight + "px";


            block.style.display = "block";



        },

        hide: function() {
            this.getEl().style.display = "none";
        },

        getEl: function(){
            if (!this.el) {
                this.el = H.ge("popup");
            }
            return this.el;
        }
    }
}