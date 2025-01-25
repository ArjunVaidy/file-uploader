const net = require("net");
const fs = require("fs/promises");
const path = require("path");
const socket = net.createConnection(
  {
    host: "::1",
    port: 5050,
  },
  async () => {
    const filePath = process.argv[2]; // getting the file path from command-line
    const fileName = path.basename(filePath);
    const fileHandle = await fs.open(filePath, "r");
    const fileReadStream = fileHandle.createReadStream();
    socket.write(`fileName: ${fileName}-------`); // we are implementing our own header like fileName and dashes
    // Reading from the source file
    fileReadStream.on("data", (data) => {
      // in client socket is writable stream(sends data) so it will have back pressure
      if (!socket.write(data)) {
        fileReadStream.pause(); // pass the source read
      }
      socket.write(data);
    });

    socket.on("drain", () => {
      fileReadStream.resume(); // resume the source read
    });

    fileReadStream.on("end", () => {
      console.log("The file was successfully uploaded!");
      socket.end();
    });
  }
);
