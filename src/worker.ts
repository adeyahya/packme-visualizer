import { init } from "packme-wasm";

const res = await fetch("/packme.wasm");
const buffer = await res.arrayBuffer();
const packer = await init(buffer);
self.postMessage("ready");

self.onmessage = (e) => {
  const data = e.data;
  if (data.type === "pack") {
    const start = performance.now();
    const result = packer.pack(data.input);
    const end = performance.now();
    self.postMessage({ type: "timing", data: end - start });
    self.postMessage({ type: "pack_result", data: result });
  }
};
