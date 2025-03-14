const socket = io();

const input = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messagesList = document.getElementById("messages");

//#region Canvas elements

const reqCanvas = document.getElementById("request");
const resCanvas = document.getElementById("response");
const reqCtx = reqCanvas.getContext("2d");
const resCtx = resCanvas.getContext("2d");
const reportButton = document.getElementById("report");

let isDrawing = false;
let isProcessing = false;

let pixelsSent = 0; // Delete later
let pixelsReceived = 0; // Delete later

reportButton.onclick = () => {
  console.log(`Client sent ${pixelsSent} pixels`);
  console.log(`Client received ${pixelsReceived} pixels`);
  socket.emit('report');
}

reqCanvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  reqCtx.moveTo(e.offsetX, e.offsetY);
});

// Sends coordinates to the server
reqCanvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    reqCtx.lineTo(e.offsetX, e.offsetY);
    reqCtx.stroke();
    // Emits one pixel change to the server
    socket.emit("change", {
      x: e.offsetX,
      y: e.offsetY,
    });
    pixelsSent++;
    // console.log({ x: e.offsetX, y: e.offsetY });
  }
});

// Changes pixels of the response canvas (reqCanvas)
socket.on("change", (pixel) => {
  pixelsReceived++;
  // Arguments are x offset, y offset, x-size, y-size
  resCtx.fillRect(pixel.x, pixel.y, 1, 1);
});

reqCanvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

reqCanvas.addEventListener("mouseout", () => {
  isDrawing = false;
});

//#endregion
