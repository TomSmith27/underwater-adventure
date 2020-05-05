import * as express from 'express';
import * as socketIo from 'socket.io';
import { ChatEvent } from '../../shared/constants';
import { ChatMessage } from './types';
import { createServer, Server } from 'http';
import { Room, Player } from './Room';
var cors = require('cors');

export class ChatServer {
  public static readonly PORT: number = 8080;
  private _app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;
  private allMessages: ChatMessage[] = [{ author: 'Tom', message: 'test' }];
  private rooms: Room[] = [new Room('XAJ8')];

  constructor() {
    this._app = express();
    this.port = process.env.PORT || ChatServer.PORT;
    this._app.use(cors());
    this._app.options('*', cors());
    this.server = createServer(this._app);
    this.initSocket();
    this.listen();
  }

  private initSocket(): void {
    this.io = socketIo(this.server);
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });
    this.io.on(ChatEvent.CONNECT, (socket: SocketIO.Socket) => {
      console.log('Connected client on port %s.', this.port);
      socket.emit(ChatEvent.CONNECTED, this.rooms);
      socket.on(ChatEvent.DISCONNECT, () => {
        console.log('Client disconnected');
        //Someone left this room
        var room = this.rooms.find((r) => r.players.some((s) => s.id == socket.id));
        room.players.splice(room.players.findIndex((p) => p.id == socket.id));
        if (room.players.length == 0) {
          this.rooms = this.rooms.filter((r) => r.code != room.code);
        }
        this.io.emit(ChatEvent.ROOM_UPDATED, this.rooms);
      });

      socket.on(ChatEvent.CREATE_ROOM, ({ name }: { name: string }) => {
        console.log(name);
        var newRoom = new Room('okda');
        newRoom.players = [{ id: socket.id, name }];
        this.rooms.push(newRoom);
        this.io.emit(ChatEvent.ROOM_UPDATED, this.rooms);
      });

      socket.on(ChatEvent.JOIN_ROOM, ({ code, name }: { code: string; name: string }) => {
        let room = this.rooms.find((r) => r.code == code);
        if (room.players.some((p) => p.id == socket.id)) {
          return;
        }
        room.players.push(new Player(socket.id, name));
        this.io.emit(ChatEvent.ROOM_UPDATED, this.rooms);
      });
    });
  }

  get app(): express.Application {
    return this._app;
  }
}
