const { Server } = require("socket.io");

var io;
let connectedClients = 0;
let serverTimeOut;

const initiateSocket = (server) => {
  io = new Server(server);

  //initial table
  let table = [
    { index: 0, text: "" },
    { index: 1, text: "" },
    { index: 2, text: "" },
    { index: 3, text: "" },
    { index: 4, text: "" },
    { index: 5, text: "" },
    { index: 6, text: "" },
    { index: 7, text: "" },
    { index: 8, text: "" },
    { index: 9, text: "" },
  ];

  io.on("connection", (socket) => {
    console.log("client connected", socket.id);
    socket.join("room");
    connectedClients++;

    if (connectedClients === 1) {
      restartServerTimeOut();
    }

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
      connectedClients--;

      if (connectedClients === 0) {
        restartServerTimeOut();
      }
    });
  });

  const restartServerTimeOut = () => {
    const SERVER_RESTART_TIMEOUT = 1000 * 60 * 5;

    if (serverTimeOut) {
      clearTimeout(serverTimeOut);
    }

    serverTimeOut = setTimeout(() => {
      console.log("No clients connected. Restarting the server.");
      table = [
        { index: 0, text: "" },
        { index: 1, text: "" },
        { index: 2, text: "" },
        { index: 3, text: "" },
        { index: 4, text: "" },
        { index: 5, text: "" },
        { index: 6, text: "" },
        { index: 7, text: "" },
        { index: 8, text: "" },
        { index: 9, text: "" },
      ];
    }, SERVER_RESTART_TIMEOUT);
  };
};

module.exports = { initiateSocket };
