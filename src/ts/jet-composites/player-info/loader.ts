import Composite = require("ojs/ojcomposite");
import * as view from "text!./player-info-view.html";
import viewModel from "./player-info-viewModel";
import * as metadata from "text!./component.json";
import "css!./player-info-styles.css";

Composite.register("player-info", {
  view: view,
  viewModel: viewModel,
  metadata: JSON.parse(metadata)
});

declare global {
  namespace preact.JSX {
    interface IntrinsicElements {
      "player-info": any;
    }
  }
}