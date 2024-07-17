import { createApp } from "vue";

import App from "./App.vue";
import { createPinia } from "pinia";
import { Tooltip } from "@programic/vue3-tooltip";

const pinia = createPinia();
createApp(App).use(pinia).use(Tooltip).mount("#app");
