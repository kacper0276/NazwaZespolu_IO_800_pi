import { io, Socket } from "socket.io-client";

class WebSocketService {
  private socket: Socket | null = null;
  private currentRoom: string | null = null;

  constructor() {
    if (!this.socket) {
      this.socket = io("http://localhost:3001");
    }
  }

  joinRoom(room: string) {
    if (this.socket && room !== this.currentRoom) {
      this.socket.emit("joinRoom", room);
      this.currentRoom = room;
    }
  }

  leaveRoom(room: string) {
    if (this.socket && this.currentRoom === room) {
      this.socket.emit("leaveRoom", room);
      this.currentRoom = null;
    }
  }

  sendMessage(sender: string, receiver: string, message: string, room: string) {
    if (this.socket) {
      this.socket.emit("sendMessage", { sender, receiver, message, room });
    }
  }

  onMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on("receiveMessage", callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentRoom = null;
    }
  }

  generateRoomId(user1: string, user2: string): string {
    const sortedUsers = [user1, user2].sort();
    return sortedUsers.join("-");
  }
}

export default new WebSocketService();
