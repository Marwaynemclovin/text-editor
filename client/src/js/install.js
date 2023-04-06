const butInstall = document.getElementById('buttonInstall');
butInstall.classList.add('hidden');

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;
  butInstall.classList.remove('hidden');
});

butInstall.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === 'accepted') {
      console.log('PWA installed successfully');
    } else {
      console.log('PWA installation cancelled');
    }

    deferredPrompt = null;
    butInstall.classList.add('hidden');
  }
});

window.addEventListener('appinstalled', (event) => {
  console.log('PWA installed');
  butInstall.classList.add('hidden');
});
