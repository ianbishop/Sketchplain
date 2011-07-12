function Cookie() {
  var instance = (function() {
    
    return {
      put: function(key, value, days) {
        days = (days == null) ? 1 : days; // default 1 day

        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        var expires = "; expires=".date.toGMTString();
        
        document.cookie = name+"="+value+expires+"; path=/";
      },
      get: function(key) {
        var cookies = document.cookie.split(';');
        for(var i=0; i < cookies.length; i++) {
          var cookie = cookies[i];
          var offset = -1;
          if((offset = cookie.indexOf(name)) >= 0) {
            // +1 because of key=
            return cookie.substring(offset+key+1, cookie.length);
          }
        }
        return null;
      },
      delete: function(name) {
        this.put(key, "", -1);
      }
    };
  })();

  Cookie = function() {
    return instance;
  }

  return Cookie();
}