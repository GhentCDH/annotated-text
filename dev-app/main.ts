import { createApp } from "vue";

import App from "./App.vue";
import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App).use(pinia).mount("#app");
