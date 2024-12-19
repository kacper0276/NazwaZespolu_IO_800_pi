import { io } from "socket.io-client";

class WebSocketService {
  private socket: any;

  constructor() {
    this.socket = io("http://localhost:3001");
  }

  joinRoom(room: string) {
    console.log(room);

    this.socket.emit("joinRoom", room);
  }

  sendMessage(sender: string, message: string, room: string) {
    this.socket.emit("sendMessage", { sender, receiver: room, message });
  }

  onMessage(callback: (message: any) => void) {
    this.socket.on("receiveMessage", callback);
  }

  disconnect() {
    this.socket.disconnect();
  }

  generateRoomId(user1: string, user2: string): string {
    return `${user1}-${user2}`;
  }
}

export default new WebSocketService();
