import { io } from "socket.io-client";

const socket = new io("http://localhost:1313", {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("connected", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("connect_error", err);
});

export default socket;
