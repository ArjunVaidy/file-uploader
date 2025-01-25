const net = require("net");
const fs = require("fs/promises");

const socket = net.createConnection(
  {
    host: "::1",
    port: 5050,
  },
  async () => {
    const filePath = "./text.txt";
    const fileHandle = await fs.open(filePath, "r");
    const fileReadStream = fileHandle.createReadStream();

    // Reading from the source file
    fileReadStream.on("data", (data) => {
      socket.write(data);
    });

    fileReadStream.on("end", () => {
      console.log("The file was successfully uploaded!");
      socket.end();
    });
  }
);
