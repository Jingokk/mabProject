const { Server } = require("socket.io");

var io;

const initiateSocket = (server) => {
  io = new Server(server);

  //initial table
  let table = [
    { index: 0, text: "" },
    { index: 1, text: "" },
    { index: 2, text: "" },
    { index: 3, text: "" },
    { index: 4, text: "" },
  ];

  io.on("connection", (socket) => {
    console.log("client connected", socket.id);
    socket.join("room");

    socket.emit("initialTable", table);

    socket.on("index", (index) => {
      for (let i = 0; i < table.length; i++) {
        if (table[i].index >= index) {
          table[i].index += 1;
        }
      }
      table.push({ index: index, text: "" });

      io.to("room").emit(
        "room",
        table.sort((a, b) => a.index - b.index)
      );
    });

    socket.on("message", (message) => {
      for (let i = 0; table.length > i; i++) {
        for (let j = 0; message.length > j; j++) {
          if (message[j].index === table[i].index) {
            if (message[i].text != table[i].text) {
              table[i].text = message[j].text;
              io.to("room").emit(
                "room",
                table.sort((a, b) => a.index - b.index)
              );
              break;
            }
          }
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("client disconnected", socket.id);
    });
  });
};

module.exports = { initiateSocket };
