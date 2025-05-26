import { createApp } from "vue";

import App from "./App.vue";
import { IntersectDirective } from "../src/intersect-directive";

const app = createApp(App);

app.directive("intersect", IntersectDirective);
app.mount("#app");
