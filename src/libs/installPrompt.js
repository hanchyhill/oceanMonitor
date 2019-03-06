window.addEventListener('beforeinstallprompt', function(e) {
  // beforeinstallprompt Event fired

  // e.userChoice will return a Promise. 
  // For more details read: https://developers.google.com/web/fundamentals/getting-started/primers/promises
  e.userChoice.then(function(choiceResult) {

    console.log(choiceResult.outcome);

    if(choiceResult.outcome == 'dismissed') {
      console.log('User cancelled home screen install');
    }
    else {
      console.log('User added to home screen');
    }
  });
});
var deferredPrompt;
window.addEventListener('beforeinstallprompt', function(e) {
  console.log('beforeinstallprompt Event fired');

  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  return false;
});

btnSave.addEventListener('click', function() {
  if(deferredPrompt !== undefined) {

    // The user has had a postive interaction with our app and Chrome
    // has tried to prompt previously, so let's show the prompt.
    deferredPrompt.prompt();
    // Follow what the user has done with the prompt.
    deferredPrompt.userChoice.then(function(choiceResult) {

      console.log(choiceResult.outcome);
      if(choiceResult.outcome == 'dismissed') {

        console.log('User cancelled home screen install');

      }
      else {
        console.log('User added to home screen');
      }
      // We no longer need the prompt.  Clear it up.
      deferredPrompt = null;
    });
  }
});
////////////

window.addEventListener('beforeinstallprompt',(evt)=>{
  app.promptEvent = evt;
  evt.preventDefault();
  showInstallButton(true);
})

function showA2HSPrompt(){
  showInstallButton(false);
  app.promptEvent.prompt();
  app.promptEvent.userChoice.then(handleA2HSResponse);
}
//https://gist.github.com/jeffposnick/4f7ff3106884fb8530ec8512aaf23810