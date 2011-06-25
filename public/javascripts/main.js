var Cookie;

var player;

$(document).ready(function() {
  Cookie = new Cookie();
  authenticate();
});

function authenticate() {
  var token = Cookie.readCookie('userToken');
  var createNewCookie = (token == null);
  
  $.post('/authenticate', { token: token },
    function(data) {
      player = jQuery.parseJSON(data);
      if(createNewCookie)
        Cookie.createCookie('userToken', player.token, 365);
    });
}