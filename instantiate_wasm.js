// ининциализация wasm 

'use strict';

// Переменная для хранения экземпляра WASM-модуля
let Wasm;

// инициализация wasm
async function initWasm() {
  // URL-адрес WASM-модуля, который будет загружаться
  const wasmUrl = 'wasm.wasm';

  const loadingScreen = document.getElementById('loadingScreen');
  const errorLoadingScreen = document.getElementById('errorLoadingScreen');


  try {
    // полифил если нет wasm
    if (!WebAssembly.instantiateStreaming) {
      async function altInstantiateStreaming(resp, importObject) {
        const source = await (await resp).arrayBuffer();
        return await WebAssembly.instantiate(source, importObject);
      }
      WebAssembly.instantiateStreaming = altInstantiateStreaming
    }

    const go = new Go();

    // Загружаем и инициализируем WebAssembly модуль
    const result = await WebAssembly.instantiateStreaming(fetch(wasmUrl), go.importObject)

    const wasmInstance = result.instance;

    await go.run(wasmInstance);

    Wasm = wasmInstance.exports

    loadingScreen.style.display = 'none'

  } catch (error) {
    loadingScreen.style.display = 'none'
    errorLoadingScreen.style.display = 'flex'
    throw new Error("Ошибка загрузки")
  }
}