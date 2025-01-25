const net = require("net");
const fs = require("fs/promises");

const server = net.createServer(() => {});
let fileHandle, fileWriteStream;
server.on("connection", (socket) => {
  console.log("New Connection");
  socket.on("data", async (data) => {
    if (!fileHandle) {
      socket.pause(); // don't receive the data until fiel is created
      fileHandle = await fs.open(`storage/test.txt`, "w");
      fileWriteStream = fileHandle.createWriteStream();
      fileWriteStream.write(data);

      socket.resume(); // resume receiving the data
    } else {
      fileWriteStream.write(data);
    }
  });

  socket.on("end", () => {
    fileHandle.close();
    fileHandle = undefined;
    fileWriteStream = undefined;
    console.log("Connection ended");
  });
});

server.listen(5050, "::1", () => {
  console.log("Uploader server opened on", server.address());
});
