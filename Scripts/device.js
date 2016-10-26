(function(){
    'use strict';
    var readCookie, _find;

    _find = function(needle) {
        return navigator.userAgent.indexOf(needle) !== -1;
    };

    window.isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry|bb10|rim/i);
        },
        iOS: function(r) {
            r = navigator.userAgent.match(/iPhone|iPad|iPod/i);
            if(!!r) return ['iOS', r[0]];
            else return null;
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (this.Android()
                || this.BlackBerry()
                || this.iOS()
                || this.Opera()
                || this.Windows()
                || false);
        }
    };

    window.isTablet = {
        Android: function() {
            if(_find('Mobile')) return false;
            return window.isMobile.Android();
        },
        BlackBerry: function() {
            if(!_find('tablet')) return false;
            return window.isMobile.BlackBerry();
        },
        iOS: function(r) {
            if(!_find('iPad')) return false;
            return window.isMobile.iOS();
        },
        Windows: function() {
            if(!_find('touch') || _find('phone')) return false;
            return window.isMobile.Windows();
        },
        any: function() {
            return (this.Android()
                || this.BlackBerry()
                || this.iOS()
                || this.Windows()
                || false);
        }
    };


    readCookie = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    };

    function createCookie(name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        else {
            expires = "";
        }
        document.cookie = name+"="+value+expires+"; path=/;domain=." + location.hostname.split('.').slice(-2).join('.') + ";";
    }

    if(!!window.isMobile.any() && !window.isTablet.any() && readCookie("prefer_platform") !== "desktop"){
        window.location.href = window.location.href.replace(/\/\/{1}/,'//m.');
        createCookie("prefer_platform",'mobile', 365);
    }
})();