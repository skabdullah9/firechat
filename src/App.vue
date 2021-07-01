<template>
  <div class="container h-screen bg-gray-900 ">
    <div v-if="state.userName === '' || state.userName === null" class="login">
      <form @submit.prevent="login">
        <section class="text-blueGray-700 overflow-hidden">
          <div class="container items-center px-5 py-12 lg:px-20 h-screen flex">
            <div
              class="flex flex-col w-full p-10 mx-auto transition duration-500 ease-in-out transform bg-gray-800  rounded-lg lg:w-2/6 md:w-1/2 md:mt-0"
            >
              <div class="relative ">
                <h1
                  class="mb-4 text-gray-100 font-bold text-xl font-mono uppercase tracking-widest"
                >
                  🔥Firechat
                </h1>
                <input
                  type="text"
                  v-model="inputUsername"
                  id="username"
                  name="username"
                  placeholder=" Enter your username"
                  class="w-full px-4 py-2 mt-2 text-base text-black transition duration-500 ease-in-out transform border border-indigo-300 rounded-md bg-blueGray-100  focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 mb-2"
                />
              </div>
              <button
                type="submit"
                value="Login"
                class="w-full text-center py-2 my-2 mr-2 text-base text-white transition duration-500 ease-in-out transform bg-indigo-600 rounded-md focus:shadow-outline focus:outline-none hover:bg-indigo-800 cursor-pointer flex items-center justify-center"
              >
                Login <img class="ml-2" src="./assets/send.svg" alt="" />
              </button>
              <p class="mx-auto mt-3 text-sm text-gray-500">
                Not have an account? <a href="#" class="underline">Register</a>
              </p>
            </div>
          </div>
        </section>
      </form>
      <p
        class="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-gray-500 whitespace-nowrap font-mono"
      >
        Made with
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 inline-block"
          viewBox="0 0 20 20"
          fill="#4F46E5"
        >
          <path
            fill-rule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clip-rule="evenodd"
          />
        </svg>
        by Abdullah
      </p>
    </div>
    <div v-else class="chat min-h-screen">
      <header class="flex justify-between py-5 text-gray-600">
        <h1 class="font-mono md:text-4xl text-xl">
          Welcome,<span class="text-indigo-700">{{ state.userName }}</span>
        </h1>
        <button
          @click="logOut"
          class="font-mono text-sm md:text-2xl rounded-xl px-2 flex items-center hover:text-gray-500"
        >
          <img class="block mr-1" src="./assets/logout.svg" alt="" />
          Logout
        </button>
      </header>
      <section class="flex-grow bg-gray-800 rounded-lg text-gray-100 relative ">
        <div class="chatbox px-4 ">
          <div
            v-for="message in state.messages"
            :key="message.key"
            class="flex"
          >
            <div
              :class="[
                state.userName === message.username
                  ? 'inline-block text-right ml-auto'
                  : 'inline-block text-left',
              ]"
            >
              <div
                class="username text-xs md:text-base font-mono my-2 text-gray-300 px-1"
              >
                {{ message.username }}
              </div>
              <div
                :class="[
                  state.userName === message.username
                    ? 'bg-indigo-800'
                    : 'bg-gray-700',
                ]"
                class="content p-2 px-3 text-base md:text-xl inline-block rounded-lg"
              >
                {{ message.content }}
              </div>
            </div>
          </div>
        </div>

        <footer class="sticky  left-0 bottom-0 right-0  mx-2">
          <div class="gradient pt-10 bg-gradient-to-t from-gray-800"></div>
          <form @submit.prevent="sendMsg" class=" bg-gray-800 pb-3">
            <div class="relative text-gray-700 ">
              <input
                class="w-full h-10 pl-3 pr-8 text-base placeholder-gray-600 border rounded-md focus:outline-none "
                type="text"
                v-model="inputMsg"
                placeholder="Enter message here..."
              />
              <button
                type="submit"
                class="absolute inset-y-0 right-0 flex items-center px-4 font-semibold text-white bg-indigo-600 rounded-r-md hover:bg-indigo-500 focus:bg-indigo-700"
              >
                Send <img class="ml-2" src="./assets/send.svg" alt="" />
              </button>
            </div>
          </form>
        </footer>
      </section>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import db from "./db.js";
export default {
  setup() {
    const inputUsername = ref("");
    const inputMsg = ref("");
    const state = reactive({
      userName: "",
      messages: [],
    });
    const login = () => {
      if (inputUsername.value !== "") {
        state.userName = inputUsername.value;
        inputUsername.value = "";
      }
    };
    const sendMsg = () => {
      const msgref = db.database().ref("messages");
      if (inputMsg.value === "" || inputMsg.value === null) return;

      const message = {
        username: state.userName,
        content: inputMsg.value,
      };
      msgref.push(message);
      inputMsg.value = "";
    };
    const logOut = () => {
      state.userName = "";
    };
    onMounted(() => {
      const msgsref = db.database().ref("messages");

      msgsref.on("value", (snapshot) => {
        const data = snapshot.val();
        const messages = [];

        Object.keys(data).forEach((key) => {
          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content,
          });
        });
        state.messages = messages;
      });
    });
    return { inputUsername, state, login, inputMsg, sendMsg, logOut };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #111827;
  overflow: hidden;
}
::-webkit-scrollbar {
  width: 3px;
  /* border-radius: 10%; */
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #1f2937;
  border-radius: 25px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  background-color: #4b5563;
  border-radius: 25px;
}
section {
  height: calc(100vh - 130px);
  overflow-y: auto;
}

@media screen and (min-width: 640px) {
  section {
    height: calc(100vh - 80px);
  }
}
</style>
