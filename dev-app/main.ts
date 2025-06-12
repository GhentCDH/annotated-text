import { createApp } from "vue";

import App from "./App.vue";
import { IntersectDirective } from "../src/intersect-directive";
import "./styles.scss";

const app = createApp(App);

app.directive("intersect", IntersectDirective);
app.mount("#app");
