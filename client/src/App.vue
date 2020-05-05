<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <h3>Lobbies</h3>
    <label for="">Name</label>
    <input type="text" v-model="name" />
    <div :key="room.code" v-for="room in rooms">
      {{ room.code }}
      {{ room.players }}

      <button @click="joinRoom(room.code)">Join</button>
    </div>
    <div>
      <button class="btn btn-primary" @click="createRoom">Create Room</button>
      <button class="btn btn-primary" v-if="roomCode" @click="beginGame">Begin Game</button>
    </div>
    <div v-if="game" class="container">
      {{ game.round1.playersInRound[game.round1.currentPlayerIndex].player.name }}'s Turn
      <div class="btn btn-info">THE SHIP Air = {{ game.round1.air }}</div>
      <div :key="tile" v-for="(tile, index) in game.round1.tiles" class="btn-block btn btn-primary">
        {{ tile }}
        <span v-if="game.round1.playersInRound.find((f) => f.position == index)">
          {{ game.round1.playersInRound.find((f) => f.position == index).player.name }}
        </span>
      </div>
    </div>
    {{ game }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import io from 'socket.io-client';
import { ChatEvent } from '../../shared/constants';
import { Room } from '../../backend/src/Room';
export default Vue.extend({
  name: 'App',
  components: {
    HelloWorld,
  },
  data() {
    return {
      name: '',
      socket: {} as SocketIOClient.Socket,
      rooms: [] as Room[],
      roomCode: null,
      game: null as Room,
    };
  },
  created() {
    this.socket = io('http://localhost:8080');
    this.socket.on(ChatEvent.CONNECT, (data: Room[]) => {
      this.rooms = data;
    });
    this.socket.on(ChatEvent.CONNECTED, (data: Room[]) => {
      this.rooms = data;
    });
    this.socket.on(ChatEvent.ROOM_UPDATED, (rooms: Room[]) => {
      this.rooms = rooms;
    });
    this.socket.on(ChatEvent.GAME_BEGIN, (game) => {
      this.game = game;
    });
  },
  methods: {
    joinRoom(code: string) {
      this.roomCode = code;
      this.socket.emit(ChatEvent.JOIN_ROOM, { code, name: this.name });
    },
    createRoom() {
      this.socket.emit(ChatEvent.CREATE_ROOM, { name: this.name });
    },
    beginGame() {
      this.socket.emit(ChatEvent.BEGIN_GAME, this.roomCode);
    },
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
