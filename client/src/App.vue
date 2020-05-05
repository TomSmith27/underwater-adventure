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
      <button @click="createRoom">Create Room</button>
    </div>
    {{ socket.id }}
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
  },
  methods: {
    joinRoom(code: string) {
      this.socket.emit(ChatEvent.JOIN_ROOM, { code, name: this.name });
    },
    createRoom() {
      this.socket.emit(ChatEvent.CREATE_ROOM, { name: this.name });
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
