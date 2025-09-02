'use strict';

async function Init() {

  document.getElementById("loadingScreen").style.display = "flex"
  // document.getElementById("startButton").style.display = "none"
  // константы
  const canvas = document.getElementById("appCanvas")
  const ctx = await canvas.getContext("2d")

  // инициализация эвентов
  async function resizeCanvas() {
    canvas.width = document.documentElement.clientWidth
    canvas.height = document.documentElement.clientHeight
    ctx.imageSmoothingEnabled = false // отключение размытия
    Wasm.SetSizeCanvas(canvas.width, canvas.height)
    Wasm.CalcCoordsImage()

    let bitmap = await createImageBitmap(imageData)
    ctx.drawImage(
      bitmap, 
      coordsImage[0], coordsImage[1], coordsImage[2], coordsImage[3], 
      coordsImage[4], coordsImage[5], coordsImage[6], coordsImage[7]
    )
  }

  addEventListener("resize", resizeCanvas)

  async function clickHandler(event) {
    const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
    Wasm.PaintPoint(x, y)
    Wasm.CalcCoordsImage()
    let bitmap = await createImageBitmap(imageData)
    ctx.drawImage(
    bitmap, 
    coordsImage[0], coordsImage[1], coordsImage[2], coordsImage[3], 
    coordsImage[4], coordsImage[5], coordsImage[6], coordsImage[7]
  )
  } 

  canvas.addEventListener("click", clickHandler)

  const element = document.documentElement
  // element.requestFullscreen()

  await initWasm()

  // дальше код


  // отрисовать матрицу по данным из go 
  // также передать и размеры 

  // const arr = new Uint8ClampedArray(Wasm.memory.buffer, Wasm.Reference(), Wasm.Size())

  // console.log("in js")
  // for(let i = 0; i < arr.length; ++i)
  // {
  //   console.log(i, ": ", arr[i])
  // }

  // arr[2] = 77

  // Wasm.Print()

  // const imgData = ctx.createImageData(2, 2)
  
  // const sizeBuffer = Wasm.Init(2, 2)

  const widthBuffer = 10
  const heightBuffer = 10
  const sizeBuffer = Wasm.Init(widthBuffer, heightBuffer)
  const arrImageData = new Uint8ClampedArray(Wasm.memory.buffer, Wasm.GetRefBuffer(), sizeBuffer)
  const imageData = new ImageData(arrImageData, widthBuffer, heightBuffer)

  const sizeDimensionImage = Wasm.SizeSizeImage()
  const coordsImage = new Float64Array(Wasm.memory.buffer, Wasm.GetRefSize(), sizeDimensionImage)

  Wasm.Paint()
  // Wasm.SetSizeCanvas(canvas.width, canvas.height)
  
  // Wasm.CalcCoordsImage()

  // let bitmap = await createImageBitmap(imageData)
  // ctx.drawImage(
  //   bitmap, 
  //   coordsImage[0], coordsImage[1], coordsImage[2], coordsImage[3], 
  //   coordsImage[4], coordsImage[5], coordsImage[6], coordsImage[7]
  // )

  resizeCanvas()

  
  // const imgData = new ImageData(arr8, 2, 2)


  // Wasm.FixPixel()

  // const bitmap = await createImageBitmap(imgData)
  
  
  // let x = Math.round((canvas.width - canvas.height) / 2) 
  // ctx.drawImage(bitmap, 0,0, 1.5, 2, x, 10.3, canvas.height, canvas.height)

  // отправить данные в go 
  // забрать данные 
  // отрисовать матрицу по этим данным

  // Wasm.MakeText()
  

  // const array = new Uint8Array(Wasm.memory.buffer, Wasm.Text(), Wasm.Size())
  // const text = new TextDecoder("utf-8").decode(array)
  // console.log(text)

  // const text2 = "Текст в JS"
  // const textBinary = new TextEncoder("utf-8").encode(text2)
  // Wasm.SetSize(textBinary.length)
  // const array2 = new Uint8Array(Wasm.memory.buffer, Wasm.Text(), textBinary.length)
  // array2.set(textBinary, 0)
  // Wasm.Print()

}

Init()
