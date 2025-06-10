import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./routes";
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


//Font awesome
import {library} from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';

//Agregar Icono Especifico a la biblioteca
library.add(faMinus);

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia)

app.mount('#app')
