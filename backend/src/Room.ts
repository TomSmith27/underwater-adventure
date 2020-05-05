import { Player } from './Player';

export class Room {
  constructor(code: string) {
    this.code = code;
    this.players = [];
  }
  public code: string;
  public players: Player[];
}
