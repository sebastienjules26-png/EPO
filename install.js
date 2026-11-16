/* No automatic reload: a running evaluation must never be interrupted. */
(() => {
  const button = document.getElementById('installEpo');
  const help = document.getElementById('installHelp');
  let pendingPrompt = null;
  const installed = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const paint = () => {button.textContent = installed() ? 'Application installée' : 'Installer EPO';button.disabled=!!installed();};
  paint();
  window.addEventListener('beforeinstallprompt', event => {event.preventDefault();pendingPrompt=event;paint();});
  window.addEventListener('appinstalled', () => {pendingPrompt=null;button.textContent='Application installée';button.disabled=true;});
  button.addEventListener('click', async () => {
    if (!pendingPrompt) {help.showModal();return;}
    const prompt=pendingPrompt;pendingPrompt=null;
    try {await prompt.prompt();await prompt.userChoice;} catch {help.showModal();}
  });
  if ('serviceWorker' in navigator && ['https:','http:'].includes(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').then(reg => {
      const notifyUpdate = () => {if(reg.waiting && navigator.serviceWorker.controller && typeof toast === 'function') toast('Mise à jour disponible : terminez votre évaluation, puis fermez toutes les fenêtres EPO et rouvrez l’application.','info',12000);};
      notifyUpdate();
      reg.addEventListener('updatefound', () => {const worker=reg.installing;if(worker)worker.addEventListener('statechange',notifyUpdate);});
    }).catch(() => {if(typeof toast === 'function') toast('Installation hors ligne indisponible. Vous pouvez continuer en ligne.','warning');}));
  }
})();
