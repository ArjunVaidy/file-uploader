const net = require("net");
const fs = require("fs/promises");

const server = net.createServer(() => {});
let fileHandle, fileWriteStream;
server.on("connection", (socket) => {
  console.log("New Connection");
  socket.on("data", async (data) => {
    if (!fileHandle) {
      fileHandle = await fs.open(`storage/test.txt`, "w");
      fileWriteStream = fileHandle.createWriteStream();
      fileWriteStream.write(data);
    } else {
      fileWriteStream.write(data);
    }
  });

  socket.on("end", () => {
    console.log("Connection ended");
    fileHandle.close();
  });
});

server.listen(5050, "::1", () => {
  console.log("Uploader server opened on", server.address());
});
