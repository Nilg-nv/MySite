'use strict';

async function Init() {
  
  // константы
  const canvas = document.getElementById("appCanvas")
  // const ctx = await canvas.getContext("2d", {alpha: false})
  const ctx = await canvas.getContext("2d")
  // инициализация эвентов
  async function resizeCanvas() {
    canvas.width = document.documentElement.clientWidth
    canvas.height = document.documentElement.clientHeight
    ctx.imageSmoothingEnabled = false // отключение размытия
    Wasm.SetSizeCanvas(canvas.width, canvas.height)
  }

  addEventListener("resize", resizeCanvas)

  // async function clickHandler(event) {
  //   const rect = canvas.getBoundingClientRect()
  //       const x = event.clientX - rect.left
  //       const y = event.clientY - rect.top
  //   Wasm.PaintPoint(x, y)
  //   Wasm.CalcCoordsImage()
  //   let bitmap = await createImageBitmap(imageData)
  //   ctx.drawImage(
  //     bitmap, 
  //     coordsImage[0], coordsImage[1], coordsImage[2], coordsImage[3], 
  //     coordsImage[4], coordsImage[5], coordsImage[6], coordsImage[7]
  //   )
  // } 

  // canvas.addEventListener("click", clickHandler) 

  // для удобной разработки 
  // проверка что обновился файл  
  async function checkUpdate() {
    try {
      const urlServer = window.location.href

      const research = await fetch(urlServer + "/api/update")

      const researchText = await research.text()

      if(researchText === "true") {
        location.reload()
      } else if (researchText === "false") {
      } else {
        console.log("не корректный ответ: ", researchText)        
      }

    }  catch (error) {
      throw Error("ошибка обновления данных: ", error)
    }
  }

  setInterval(checkUpdate, 1000)

  await initWasm()
  
  resizeCanvas()

  function drawLine(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  ctx.fillStyle = "black"

  var startTime = 0
  var count = 0
  var text = 0 
  function loop(time) {
    Wasm.Loop(time)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const amountLine = Wasm.TempAmountLine()
    for(var i = 0; i < amountLine; i++) {
      const x1 = Wasm.TempX1(i)
      const y1 = Wasm.TempY1(i)
      const x2 = Wasm.TempX2(i)
      const y2 = Wasm.TempY2(i)
      drawLine(x1, y1, x2, y2) 
    }

    var delta = time - startTime
    ++count
    if(delta > 1000) {
      startTime = time
      text = count
      count = 0
    }
    ctx.fillText(text, 10, 10)


    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop) 

}

Init()
