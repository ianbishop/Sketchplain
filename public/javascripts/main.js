// singletons
var Cookie;

// globals
var player;
var game;

// states
var isAuthenticating = false;

$(document).ready(function() {
  Cookie = new Cookie();
  authenticate(displayStartup);
});

function authenticate(callback) {
  if(!isAuthenticating) {
    isAuthenticating = true;
    var token = Cookie.readCookie('userToken');
    var createNewCookie = (token == null);
  
    $.post('/authenticate', { token: token },
      function(data) {
        response = jQuery.parseJSON(data);

        player = response[0];
        if(createNewCookie)
          Cookie.createCookie('userToken', player.token, 365);
        
        if(response[1].length > 0)
          displayNotifications(response.notifications());
        
        callback();
      });
  }
}

function displayStartup() {
  $('#submit').click(function() {
    $.get('/game/' + player.token, 
      function(data) {
        response = jQuery.parseJSON(data);
        
        game = response[0];
        
        if(response[1].length > 0)
          displayNotifications(response.notifications());
      });
  });
}

function displayNotifications(notifications) {
  
}

