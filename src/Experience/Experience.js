import * as THREE from "three";
import Time from "./Utils/Time.js";
import Sizes from "./Utils/Sizes.js";
import Stats from "./Utils/Stats.js";

import Resources from "./Resources.js";
import Renderer from "./Renderer.js";
import Camera from "./Camera.js";
import World from "./World.js";

import assets from "./assets.js";

export default class Experience {
  static instance;

  // [+] Constructor
  constructor(_options = {}) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;

    // [-] Options
    this.targetElement = _options.targetElement;

    if (!this.targetElement) {
      console.warn("Missing 'targetElement' property");
      return;
    }

    this.time = new Time();
    this.sizes = new Sizes();
    this.setConfig();
    this.setStats();
    this.setScene();
    this.setCamera();
    this.setRenderer();
    this.setResources();
    this.setWorld();

    this.sizes.on("resize", () => {
      this.resize();
    });

    this.update();
  }

  // [+] setConfig
  setConfig() {
    this.config = {};

    // [-] Debug
    this.config.debug = window.location.hash === "#debug";

    // [-] Pixel ratio
    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

    // [-] Width and height
    const boundings = this.targetElement.getBoundingClientRect();
    this.config.width = boundings.width;
    this.config.height = boundings.height || window.innerHeight;
  }

  // [+] setStats
  setStats() {
    if (this.config.debug) {
      this.stats = new Stats(true);
    }
  }

  // [+] setScene
  setScene() {
    this.scene = new THREE.Scene();
  }

  // [+] setCamera
  setCamera() {
    this.camera = new Camera();
  }

  // [+] setRenderer
  setRenderer() {
    this.renderer = new Renderer({ rendererInstance: this.rendererInstance });

    this.targetElement.appendChild(this.renderer.instance.domElement);
  }

  // [+] setResources
  setResources() {
    this.resources = new Resources(assets);
  }

  // [+] setWorld
  setWorld() {
    this.world = new World();
  }

  // [+] update
  update() {
    if (this.stats) this.stats.update();

    this.camera.update();

    if (this.world) this.world.update();

    if (this.renderer) this.renderer.update();

    window.requestAnimationFrame(() => {
      this.update();
    });
  }

  // [+] resize
  resize() {
    // [-] Config
    const boundings = this.targetElement.getBoundingClientRect();
    this.config.width = boundings.width;
    this.config.height = boundings.height;

    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

    if (this.camera) this.camera.resize();

    if (this.renderer) this.renderer.resize();

    if (this.world) this.world.resize();
  }

  // [+] destroy
  destroy() {}
}
