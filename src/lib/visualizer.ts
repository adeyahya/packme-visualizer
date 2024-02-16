import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { AlgoInput, init } from "packme-wasm";

const setupPacker = async () => {
  const res = await fetch("/packme.wasm");
  const buffer = await res.arrayBuffer();
  const { pack } = await init(buffer);

  const data: AlgoInput = {
    containers: [
      {
        id: "container 1",
        qty: 1,
        dim: [20, 20, 30],
      },
    ],
    items: [
      {
        id: "item 1",
        qty: 5,
        dim: [10, 10, 30],
      },
    ],
  };

  const result = pack(data);
  console.log(result);
};

const setupLighting = (scene: THREE.Scene) => {
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
};

const setupCamera = () => {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  return camera;
};

export const visualizer = (canvas: HTMLCanvasElement) => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe5e5e5);

  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  setupPacker();
  setupLighting(scene);
  const camera = setupCamera();
  const controls = new OrbitControls(camera, renderer.domElement);

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

  const handler = requestAnimationFrame(animate);
  const dispose = () => {
    cancelAnimationFrame(handler);
  };

  return { dispose };
};
