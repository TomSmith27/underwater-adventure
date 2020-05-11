export class Player {
  constructor(socket: SocketIO.Socket, id: string, name: string, isAdmin: boolean) {
    //this.socket = socket;
    this.id = id;
    this.name = name;
    this.isAdmin = isAdmin;
  }
  // public socket: SocketIO.Socket;
  public id: string;
  public name: string;
  public isAdmin: boolean;
}
