export class Room {
  constructor(code: string) {
    this.code = code;
    this.players = [];
  }
  public code: string;
  public players: Player[];
}

export class Player {
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
  public id: string;
  public name: string;
}
