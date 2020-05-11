<template>
  <div id="app" class="container">
    <h1>Underwater Adventure</h1>
    <div v-if="!roomCode">
      <label for>Name</label>
      <input type="text" v-model="name" />

      <button class="btn btn-primary" @click="createRoom">Create Room</button>

      <h3>Open Games</h3>

      <p class="border shadow-sm" :key="room.code" v-for="room in rooms">
        <b-btn @click="joinRoom(room.code)" variant="link">{{room.code}}</b-btn>
        <span>Players :</span>
        <span :key="player.id" v-for="player in room.players">{{player.name}}</span>
      </p>
    </div>
    <div v-if="roomCode">
      <h4>You are in game {{roomCode}}</h4>
      <b-card :key="player.id" v-for="player in currentRoom.players">{{player.name}}</b-card>
      <button class="btn btn-primary" v-if="roomCode" @click="beginGame">Begin Game</button>
    </div>
    <div v-if="room">
      <button @click="roll">Roll</button>
      {{ room.round1.playersInRound[room.round1.currentPlayerIndex].player.name }}'s Turn
      <div class="btn btn-info">THE SHIP Air = {{ room.round1.air }}</div>
      <div :key="tile" v-for="(tile, index) in room.round1.tiles" class="d-flex py-2">
        <tile :tile="tile" />
        {{ tile }}
        <span v-if="room.round1.playersInRound.find((f) => f.position == index)">{{ room.round1.playersInRound.filter((f) => f.position == index).map(p => p.player.name) }}</span>
      </div>
    </div>
    {{ room }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import io from 'socket.io-client';
import { ChatEvent } from '../../shared/constants';
import { Room } from '../../backend/src/Room';
import Tile from '@/components/Tile.vue';
export default Vue.extend({
    name: 'App',
    components: {
        Tile
    },
    data() {
        return {
            name: 'Tim',
            socket: {} as SocketIOClient.Socket,
            rooms: [] as Room[],
            roomCode: '',
            room: null as Room | null
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
        this.socket.on(ChatEvent.GAME_BEGIN, room => {
            this.room = room;
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
        roll() {
            this.socket.emit(ChatEvent.ROLL, this.roomCode);
        }
    },
    computed: {
        currentRoom(): Room | null {
            return this.rooms.find(r => r.code == this.roomCode) ?? null;
        }
    }
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
