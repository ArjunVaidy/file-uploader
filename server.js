const net = require("net");
const fs = require("fs/promises");

const server = net.createServer(() => {});

server.on("connection", (socket) => {
  console.log("New Connection");
  let fileHandle, fileWriteStream;
  socket.on("data", async (data) => {
    fileHandle = await fs.open(`storage/test.txt`, "w");
    fileWriteStream = fileHandle.createWriteStream();
    fileWriteStream.write(data);
  });

  socket.on("end", () => {
    console.log("Connection ended");
    fileHandle.close();
  });
});

server.listen(5050, "::1", () => {
  console.log("Uploader server opened on", server.address());
});
