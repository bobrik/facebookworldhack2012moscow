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

            overlay.style.height = window.innerHeight + "px";
            overlay.height = window.innerHeight + "px";

            overlay.style.display = "block";

            var documentWidth = window.innerWidth / 2 + window.pageXOffset - (block.offsetWidth / 2);
            var documentHeight = window.innerHeight / 2 + window.pageYOffset - (block.offsetHeight / 2);

            overlay.style.height = document.bodyoffsetHeight + "px";

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
        if (elm && elm.nodeName.toLowerCase() != nodeName.toLowerCase()) {
            if (elm && elm.parentNode) {
                 return H.closest(nodeName, elm.parentNode);
            }
            return null;
        } else {
            return elm;
        }

    },

    ajaxPost: function (url, data, callback) {
        var xmlhttp = false;
        var t = this;

        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }

        if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
            xmlhttp = new XMLHttpRequest();
        }

        var requestData = H.serialize(data, null);

        xmlhttp.open('POST', url, true);

        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.setRequestHeader("Content-length", requestData.length);
        xmlhttp.setRequestHeader("Connection", "close");

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    try {
                        var response = JSON.parse(xmlhttp.responseText);
                        callback && callback(response);
                    } catch (e) {
                        if (!window.JSON) {
                            // Подгрузить browser.js
                        }
                    }

                }
            }
        };

        xmlhttp.send(requestData);
    },

    /**
     * Сериализация данных для отправки через POST запрос
     *
     * @private
     * @param {Object} obj
     *                  сереализуемый объект
     * @param {String} prefix
     *                  префикс имени
     */
    serialize: function(obj, prefix) {
        var str = [];
        for (var p in obj) {
            var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
            str.push(typeof v == "object" ?
                H.serialize(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
        return str.join("&");
    },

    words: ["Variables","Persistance","LuaLearners","Method","Function","Arguments","Script","Condition","Return","Break","if","do","for","until","end","error","GUI","Position","Instance","Size","TweenSize","Remove","Destroy","Instance","Debris","Backpack","Workspace","ScreenGui","Players","Character","Teams","Debris","GetService","String","Integer","Connect","Button1Down","Button2Down","Touched","MouseClick"],

    shuffle: function (arr) {
        return arr.sort(function() {return 0.5 - Math.random()});
    },

    getWords: function(){
        return this.shuffle(this.words).slice(0,3);
    },

    initFbAPI: function(cb){
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '226112007518642', // App ID
                cookie     : true, // enable cookies to allow the server to access the session
                frictionlessRequests:true
            });
            if (cb) cb();
        };

        // Load the SDK Asynchronously
        (function(d){
            var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement('script'); js.id = id; js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            ref.parentNode.insertBefore(js, ref);
        }(document));
    }
}