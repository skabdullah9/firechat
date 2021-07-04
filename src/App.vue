<template>
  <div class="container  h-screen bg-gray-900 relative">
    <div v-if="isLoggedIn" class="chat min-h-screen">
      <header class="flex justify-between py-5 text-gray-600">
        <h1 class="font-mono md:text-4xl text-xl ml-2">
          Welcome,<span class="text-indigo-700">{{ state.userName }}</span>
        </h1>
        <button
          @click="logOut"
          class="font-mono text-sm md:text-2xl rounded-xl px-2 flex items-center hover:text-gray-500 mr-2"
        >
          <img class="block mr-1" src="./assets/logout.svg" alt="" />
          Logout
        </button>
      </header>
      <div
        id="wrapper"
        class="wrapper bg-gray-800 rounded-lg md:rounded-xl text-gray-100 pr-px relative"
      >
        <div
          class="absolute p-1 pb-1.5 -right-1 -top-1 bg-gray-900 rounded-3xl z-10"
        ></div>
        <section
          ref="chatbox"
          :class="{ 'overflow-y-auto': !isLoading }"
          class="relative"
          :style="{ height: vh + 'px' }"
        >
          <div
            v-if="isLoading"
            class="loading h-full flex items-center justify-center "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-1/6 w-1/6 animate-spin "
              viewBox="0 0 20 20"
              fill="#6D28D9"
            >
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div v-else class="chatbox px-4">
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
                  class="username text-xs md:text-base font-mono mt-2 mb-1 text-gray-300 px-1"
                >
                  {{ message.username }}
                </div>
                <div
                  :class="[
                    state.userName === message.username
                      ? 'bg-indigo-800'
                      : 'bg-gray-700',
                  ]"
                  class="content pt-1 pb-1 md:pb-2 px-3 text-base md:text-xl inline-block rounded-3xl font-sans"
                >
                  {{ message.content }}
                </div>
              </div>
            </div>
          </div>

          <footer class="sticky  left-0 bottom-0 right-0 mx-3 md:mx-4">
            <div class="gradient pt-10 bg-gradient-to-t from-gray-800"></div>
            <form @submit.prevent="sendMsg" class=" bg-gray-800 pb-3 md:pb-8">
              <div class="relative text-gray-700 ">
                <input
                  class="w-full h-10 pl-3 pr-8 text-base placeholder-gray-600 border rounded-md focus:outline-none focus:ring-2 font-sans ring-indigo-600"
                  type="text"
                  v-model="inputMsg"
                  placeholder="Enter message here..."
                />
                <button
                  type="submit"
                  class="absolute inset-y-0 right-0 flex items-center px-4 font-semibold text-white bg-indigo-600 rounded-r-md hover:bg-indigo-500 focus:outline-none"
                >
                  Send <img class="ml-2" src="./assets/send.svg" alt="" />
                </button>
              </div>
            </form>
          </footer>
        </section>
      </div>
    </div>
    <div v-else class="login overflow-hidden  ">
      <form @submit.prevent="login">
        <section class="text-blueGray-700 overflow-hidden">
          <div
            class="container items-center px-5 py-12 lg:px-20 h-screen flex flex-col justify-center"
          >
            <div
              v-if="Alert"
              class="alert bg-red-100 text-red-600 px-4 py-1 mb-5 rounded-md border-2 border-red-500 font-mono text-sm md:text-base"
            >
              ❌ '{{ inputUsername }}' {{ AlertMsg }}
            </div>
            <div
              class="flex flex-col w-full py-10 px-5 md:px-10 mx-auto transition duration-500 ease-in-out transform bg-gray-800  rounded-lg lg:w-3/6 md:w-1/2 md:mt-0 max-w-sm"
            >
              <div class="relative">
                <h1
                  class="mb-4 text-gray-100 font-bold text-xl font-mono uppercase tracking-widest"
                >
                  🔥Firechat
                </h1>
                <input
                  type="text"
                  v-model="inputUsername"
                  v-on:keyup.backspace="Alert = false"
                  id="username"
                  name="username"
                  placeholder=" Enter your username"
                  class="w-full px-4 py-2 mt-2 text-base text-black transition duration-500 ease-in-out transform border border-indigo-300 rounded-md bg-blueGray-100  focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 mb-2 font-sans ring-indigo-500"
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
                Register or Login without password
              </p>
            </div>
          </div>
        </section>
      </form>
      <p
        class="absolute bottom-14 md:bottom-3 left-1/2 transform -translate-x-1/2 text-gray-500 whitespace-nowrap font-mono"
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
  </div>
</template>

<script>
import { reactive, ref, onMounted, onBeforeMount, watchEffect } from "vue";
import db from "./db.js";
export default {
  setup() {
    const inputUsername = ref("");
    const inputMsg = ref("");
    const state = reactive({
      userName: "",
      messages: [],
    });
    let allMsgs = null;
    const isLoggedIn = ref(false);
    const isLoading = ref(true);
    let registerdUsernames = reactive([]);
    let vh = window.innerHeight * 0.01;
    vh = vh * 100 - 68;
    const Alert = ref(false);
    const AlertMsg = ref("username already exists");
    const chatbox = ref(null);
    let sound1 = null;
    let sound2 = null;
    const login = () => {
      if (
        inputUsername.value !== "" &&
        inputUsername.value !== null &&
        inputUsername.value !== undefined
      ) {
        if (inputUsername.value.length < 4) {
          localStorage.isLoggedIn = false;
          isLoggedIn.value = false;
          AlertMsg.value = "username atleast 4 characters";
          Alert.value = true;
          return;
        }
        let matchUsername = state.messages.find(
          (msg) => msg.username == inputUsername.value
        );
        if (localStorage.username) {
          registerdUsernames = JSON.parse(localStorage.username);
        }
        if (matchUsername) {
          let existingUser = registerdUsernames.find(
            (name) => name == matchUsername.username
          );
          if (existingUser) {
            state.userName = inputUsername.value;
            inputUsername.value = "";
            registerdUsernames.splice(
              registerdUsernames.indexOf(state.userName),
              1
            );
            registerdUsernames[registerdUsernames.length] = state.userName;
            localStorage.username = JSON.stringify(registerdUsernames);
            localStorage.isLoggedIn = true;
            isLoggedIn.value = true;
            setTimeout(() => {
              scrollToBottom();
            }, 1);
          } else {
            localStorage.isLoggedIn = false;
            isLoggedIn.value = false;
            AlertMsg.value = "username already exists";
            Alert.value = true;
          }
        } else {
          state.userName = inputUsername.value;
          inputUsername.value = "";
          registerdUsernames.push(state.userName);
          localStorage.username = JSON.stringify(registerdUsernames);
          localStorage.isLoggedIn = true;
          isLoggedIn.value = true;
        }
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
      scrollToBottom();
      inputMsg.value = "";

      sound2.play();
    };
    const logOut = () => {
      state.userName = "";
      localStorage.isLoggedIn = false;
      isLoggedIn.value = false;
    };
    onBeforeMount(() => {
      if (localStorage.isLoggedIn) {
        isLoggedIn.value = JSON.parse(localStorage.isLoggedIn);
      } else {
        isLoggedIn.value = false;
      }
      if (isLoggedIn.value == true) {
        if (localStorage.username) {
          let currentUser =
            JSON.parse(localStorage.username.split(",")) ||
            localStorage.username[0];
          currentUser = currentUser[currentUser.length - 1];
          state.userName = currentUser;
        } else {
          state.userName = "";
        }
      }
    });

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

        setTimeout(() => {
          scrollToBottom();
        }, 1);
        isLoading.value = false;
      });

      sound1 = new Audio(require("@/assets/messenger.mp3"));
      sound2 = new Audio(require("@/assets/sent.mp3"));

      watchEffect(() => {
        let obj = Object.assign({}, state.messages[state.messages.length - 1]);

        if (obj.username !== state.userName && isLoggedIn.value) {
          sound1.play();
        }
      });
    });
    const scrollToBottom = () => {
      if (chatbox.value) {
        chatbox.value.scrollTop = chatbox.value.scrollHeight;
      }
    };
    window.addEventListener("resize", () => {
      if (chatbox.value) {
        let vh = window.innerHeight * 0.01;
        vh = vh * 100 - 68;
        chatbox.value.style.height = vh + "px";
      }
    });

    return {
      vh,
      isLoggedIn,
      inputUsername,
      state,
      login,
      inputMsg,
      sendMsg,
      logOut,
      isLoading,
      Alert,
      AlertMsg,
      chatbox,
    };
  },
};
</script>

<style>
html {
  overflow: hidden;
  width: 100%;
}
body {
  height: 100%;
  width: 100vw;
  position: fixed;
  /* prevent overscroll bounce*/
}
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
  height: calc(100vh - 80px);
}
</style>
