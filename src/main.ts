import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import OneSignal, { NotificationClickEvent, NotificationWillDisplayEvent } from 'onesignal-cordova-plugin';
import { alertController } from '@ionic/vue';

import { IonicVue } from '@ionic/vue';


/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

let isEventListenersAdded = false;

const app = createApp(App)
  .use(IonicVue)
  .use(router);

router.isReady().then(() => {
  app.mount('#app');

  OneSignal.initialize("dfb830b3-cb27-448a-88df-08c765aaef8b");
  OneSignal.Notifications.requestPermission();

  // Obtener el ID del usuario cada 60s hasta que esté disponible
  const interval = setInterval(async () => {
    const id = await OneSignal.User.getOnesignalId();
    console.log("OneSignal ID:", id);

    if (id) {
      clearInterval(interval);
    }
  }, 60000);

  // Mostrar notificación en la app cuando esté en primer plano
  const displayNotification = async (event: NotificationWillDisplayEvent) => {
    const notification = event.getNotification();
    event.getNotification().display(); // Asegurar que la notificación se muestre

    console.log("Notificación recibida:", notification);

    // Crear alerta con Ionic para mostrar la notificación en primer plano
    const alert = await alertController.create({
      header: notification.title, //Literalmente era poner el notification.title
      message: `${notification.body}`, //De igual forma en el notification.body
      buttons: ["OK"],
    });

    await alert.present();
  };

OneSignal.Notifications.addEventListener("foregroundWillDisplay", displayNotification);

// Esto maneja el evento de clic en la notificación
const openNotification = async (event: NotificationClickEvent) => {
  const notification = event.notification;
  console.log("Notificación clickeada:", notification);

  // Crear alerta con Ionic para cuando el usuario haga clic en la notificación
  const alert = await alertController.create({
    header: "Notificación Abierta",
    message: `${notification.body}`, 
    buttons: ["OK"],
    });

await alert.present();
  };

OneSignal.Notifications.addEventListener("click", openNotification);
});
