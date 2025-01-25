const net = require("net");
const fs = require("fs/promises");

const server = net.createServer(() => {});
let fileHandle, fileWriteStream;
server.on("connection", (socket) => {
  console.log("New Connection");
  socket.on("data", async (data) => {
    if (!fileHandle) {
      socket.pause(); // don't receive the data until fiel is created

      // TCP is ordered and packets are arranged sequentially and hence first packet will have fileName
      const indexOfDivider = data.indexOf("-------");
      const fileName = data.subarray(10, indexOfDivider).toString("utf-8");
      fileHandle = await fs.open(`storage/${fileName}`, "w");
      fileWriteStream = fileHandle.createWriteStream();
      fileWriteStream.write(data.subarray(indexOfDivider + 7)); // discarding the headers

      socket.resume(); // resume receiving the data
      fileWriteStream.on("drain", () => {
        socket.resume();
      });
    } else {
      if (!fileWriteStream.write(data)) {
        socket.pause();
      }
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
