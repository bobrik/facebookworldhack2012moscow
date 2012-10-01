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
            title.innerText = props.title;
            block.style.display = "block";

            var documentWidth = self.innerWidth / 2 + window.pageXOffset - (block.width / 2);
            var documentHeight = self.innerHeight /2 + window.pageYOffset - (block.height / 2);

            block.left = documentWidth + "px";
            block.top = documentHeight + "px";

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