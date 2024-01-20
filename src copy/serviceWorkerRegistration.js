// serviceWorkerRegistration.js
export const register = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered with scope:', registration.scope);
    } catch (error) {
      console.error('Error registering Service Worker:', error);
    }
  }
};
