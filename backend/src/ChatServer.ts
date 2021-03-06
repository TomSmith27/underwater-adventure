import * as express from 'express';
import * as socketIo from 'socket.io';
import { ChatEvent } from '../../shared/constants';
import { ChatMessage } from './types';
import { createServer, Server } from 'http';
import { Room } from './Room';
import { Player } from './Player';
var cors = require('cors');

export class ChatServer {
  public static readonly PORT: number = 8080;
  private _app: express.Application;
  private server: Server;
  private io: SocketIO.Server;
  private port: string | number;
  private allMessages: ChatMessage[] = [{ author: 'Tom', message: 'test' }];
  private rooms: Room[] = [new Room('dev')];

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
        if (room) {
          if (room.players) {
            room.players.splice(room.players.findIndex((p) => p.id == socket.id));
            if (room.players.length == 0) {
              // this.rooms = this.rooms.filter((r) => r.code != room.code && room.code != 'dev');
            }
          }
          this.io.emit(ChatEvent.ROOM_UPDATED, this.rooms);
        }
      });

      socket.on(ChatEvent.CREATE_ROOM, ({ name }: { name: string }) => {
        var newRoom = new Room('okda');
        newRoom.players = [new Player(socket, socket.id, name, true)];
        this.rooms.push(newRoom);
        this.io.emit(ChatEvent.ROOM_UPDATED, this.rooms);
      });

      socket.on(ChatEvent.JOIN_ROOM, ({ code, name }: { code: string; name: string }) => {
        if (this.rooms.some((r) => r.players.some((p) => p.id == socket.id))) {
          return;
        }
        let room = this.rooms.find((r) => r.code == code);

        room.players.push(new Player(socket, socket.id, name, false));
        this.io.emit(
          ChatEvent.ROOM_UPDATED,
          this.rooms.map((m) => ({
            code: m.code,
            players: m.players.map((p) => ({
              name: p.name,
              id: p.id,
              isAdmin: p.isAdmin,
            })),
          }))
        );
        room.startGame();
        // console.log(room);
        // console.log(room.round1.playersInRound);
        console.table(room.round1.tiles);
      });

      socket.on(ChatEvent.BEGIN_GAME, (code: string) => {
        console.log(ChatEvent.BEGIN_GAME);
        let room = this.rooms.find((r) => r.code == code);
        room.startGame();
        this.io.emit(ChatEvent.GAME_BEGIN, room);
      });

      socket.on(ChatEvent.ROLL, (code: string) => {
        let room = this.rooms.find((r) => r.code == code);
        room.roll();
        this.io.emit(ChatEvent.GAME_BEGIN, room);
      });
    });
  }

  get app(): express.Application {
    return this._app;
  }
}
