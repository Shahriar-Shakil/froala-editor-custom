import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import $ from "jquery";

window.$ = window.jQuery = $;
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
