const socket = io();

const input = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messagesList = document.getElementById("messages");

//#region Canvas elements

const reqCanvas = document.getElementById("request");
const resCanvas = document.getElementById("response");
const brushSize = document.getElementById("brush-size");
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

brushSize.onchange = (e) => {
  let size = e.target.value;
  reqCtx.lineWidth = size;
  socket.emit('brush-size', size || 1);
}

reqCanvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  reqCtx.moveTo(e.offsetX, e.offsetY);
});

// Sends coordinates to the server
reqCanvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  reqCtx.lineTo(e.offsetX, e.offsetY);
  reqCtx.stroke();
  // Emits one pixel change to the server
  socket.emit("change", {
    x: e.offsetX,
    y: e.offsetY,
  });
  pixelsSent++;
});

// Changes pixels of the response canvas (reqCanvas)
socket.on("change", (pixel) => {
  pixelsReceived++;
  // We draw a smooth line
  // BUG: does not work with multiple client connections
  resCtx.lineTo(pixel.x, pixel.y);
  resCtx.stroke();
});

socket.on('brush-size', (size) => {
  resCtx.lineWidth = size;
})

reqCanvas.addEventListener("mouseup", () => {
  // should tell the server that the line is done
  // as of now, the client will connect previous line endings to new line beginnings
  isDrawing = false;
});

reqCanvas.addEventListener("mouseout", () => {
  isDrawing = false;
});

//#endregion
