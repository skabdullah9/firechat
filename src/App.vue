<template>
  <div class="container  h-screen bg-gray-900 relative">
    <div v-if="isLoggedIn" class="chat min-h-screen">
      <header class="flex justify-between py-5 text-gray-600">
        <h1 class="font-mono md:text-4xl text-xl ml-4">
          Welcome,<span :class="`text-${theme}-700`">{{ state.userName }}</span>
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
          class="relative pb-0"
          :style="{ height: vh + 'px' }"
        >
          <div
            v-if="isLoading"
            class="loading h-full flex items-center justify-center "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-1/6 w-1/6 animate-spin"
              :class="`text-${theme}-700`"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div v-else class="chatbox px-4 pb-24 ">
            <div v-for="date in dates" :key="date">
              <h1
                v-if="date"
                class="date border-dashed border-b border-gray-700 mb-4 text-gray-400 font-mono text-2xl pb-4 pt-6"
              >
                {{ date }}
              </h1>
              <div
                v-for="(message, index) in state.messages"
                :key="message.key"
                class="flex items-end"
              >
                <div
                  v-if="message.date == date"
                  :class="[
                    state.userName === message.username
                      ? 'inline-block text-right ml-auto'
                      : 'inline-block text-left',
                  ]"
                >
                  <div
                    v-if="
                      index !== 0
                        ? state.messages[index - 1].username != message.username
                        : true
                    "
                    class="username text-xs md:text-base font-mono mt-2 text-gray-300 px-1"
                  >
                    {{ message.username }}
                  </div>
                  <span
                    v-if="
                      state.userName === message.username &&
                        message.date &&
                        showInfo
                    "
                    class="font-mono text-xs mr-3 text-gray-400"
                    >{{ message.time }}
                  </span>
                  <div
                    :class="[
                      state.userName === message.username
                        ? `bg-${theme}-700`
                        : 'bg-gray-700',
                    ]"
                    class="content pt-1 pb-1 md:pb-2 px-4 text-base md:text-xl inline-block rounded-3xl font-sans my-1"
                    @click.self="showInfo = !showInfo"
                  >
                    {{ message.content }}
                  </div>
                  <span
                    v-if="
                      state.userName !== message.username &&
                        message.date &&
                        showInfo
                    "
                    class="font-mono text-xs ml-2 inline-block text-gray-400 -mb-6 "
                    >{{ message.time }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <footer
            class="fixed bottom-0  px-3 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg md:max-w-screen-md sm:max-w-screen-sm"
            style="width:100%;"
          >
            <div class="gradient pt-10 bg-gradient-to-t from-gray-800"></div>
            <form @submit.prevent="sendMsg" class=" bg-gray-800 pb-3 md:pb-5">
              <div class="relative text-gray-700 ">
                <input
                  class="w-full h-10 pl-3 pr-8 text-base placeholder-gray-600 border rounded-md focus:outline-none focus:ring-2 font-sans"
                  :class="`ring-${theme}-600`"
                  type="text"
                  v-model="inputMsg"
                  placeholder="Enter message here..."
                  @keyup.prevent.enter="scroll"
                  v-focus
                />
                <button
                  type="submit"
                  class="absolute inset-y-0 right-0 flex items-center px-4 font-semibold text-white  focus:outline-none"
                  :class="`bg-${theme}-700 rounded-r-md hover:bg-${theme}-800`"
                >
                  Send <img class="ml-2" src="./assets/send.svg" alt="" />
                </button>
              </div>
            </form>
          </footer>
        </section>
      </div>
    </div>
    <div v-else class="login overflow-hidden">
      <div class="theme  fixed top-4 right-6  flex flex-row-reverse md:block">
        <div
          class="colors-wrap bg-gray-800 pt-2 pb-2 md:pt-0 md:pb-1 flex md:flex-col h-auto md:h-14 w-14 md:w-auto overflow-hidden rounded-full  transition duration-500 ease-in-out"
          :class="{ 'w-auto md:h-auto': showColors }"
        >
          <div
            @click="changeColor('indigo')"
            class="h-9 w-9 bg-indigo-500 rounded-full mx-2.5 md:mt-2.5 flex-shrink-0 cursor-pointer "
            :class="{
              'border-2 border-gray-300 ': theme === 'indigo',
              'order-first': !showColors && theme === 'indigo',
            }"
          ></div>
          <div
            @click="changeColor('green')"
            class="h-9 w-9 bg-green-500 rounded-full mx-2.5 md:mt-2.5 flex-shrink-0  cursor-pointer  "
            :class="{
              'border-2 border-gray-300': theme === 'green',
              'order-first': !showColors && theme === 'green',
            }"
          ></div>
          <div
            @click="changeColor('blue')"
            class="h-9 w-9 bg-blue-500 rounded-full mx-2.5 md:mt-2.5 flex-shrink-0  cursor-pointer "
            :class="{
              'border-2 border-gray-300': theme === 'blue',
              'order-first': !showColors && theme === 'blue',
            }"
          ></div>

          <div
            @click="changeColor('amber')"
            class="h-9 w-9 bg-amber-500 rounded-full mx-2.5 md:my-2.5 flex-shrink-0   cursor-pointer  "
            :class="{
              'border-2 border-gray-300': theme === 'amber',
              'order-first': !showColors && theme === 'amber',
            }"
          ></div>
        </div>
        <button
          class="showColors focus:outline-none"
          @click="showColors = !showColors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 transform rotate-90 md:rotate-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <form @submit.prevent="login">
        <section class="text-blueGray-700 overflow-hidden ">
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
                  class="w-full px-4 py-2 mt-2 text-base text-black transition duration-500 ease-in-out transform border  rounded-md bg-blueGray-100  focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 mb-2 font-sans "
                  :class="`ring-${theme}-500`"
                  v-focus
                />
              </div>
              <button
                type="submit"
                value="Login"
                :class="`bg-${theme}-600 hover:bg-${theme}-800`"
                class="w-full text-center py-2 my-2 mr-2 text-base text-white transition duration-500 ease-in-out transform rounded-md focus:shadow-outline focus:outline-none  cursor-pointer flex items-center justify-center"
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
          :class="`text-${theme}-600`"
          viewBox="0 0 20 20"
          fill="currentColor"
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
  directives: {
    focus: {
      mounted(el) {
        // Focus the element
        el.focus();
      },
    },
  },
  setup() {
    const inputUsername = ref("");
    const inputMsg = ref("");
    const input = ref(null);
    const state = reactive({
      userName: "",
      messages: [],
      date: "",
      time: "",
    });
    const dates = ref([]);
    const isLoggedIn = ref(false);
    const isLoading = ref(true);
    let registerdUsernames = reactive([]);
    let vh = window.innerHeight * 0.01;
    vh = vh * 100 - 68;
    const Alert = ref(false);
    const AlertMsg = ref("username already exists");
    const chatbox = ref(null);
    const showDate = ref(false);
    let lastMsgUser = ref(false);
    let sound1 = null;
    let sound2 = null;
    let theme = ref(null);
    let showColors = ref(false);
    const login = () => {
      if (
        inputUsername.value !== "" &&
        inputUsername.value !== null &&
        inputUsername.value !== undefined
      ) {
        inputUsername.value = inputUsername.value
          .replace(/\s+/g, "")
          .toLowerCase();
        if (inputUsername.value.length < 4) {
          localStorage.isLoggedIn = false;
          isLoggedIn.value = false;
          AlertMsg.value = "username atleast 4 characters";
          Alert.value = true;
          return;
        }
        if (!usernameValidation(inputUsername.value)) {
          isLoggedIn.value = false;
          AlertMsg.value = "username is not valid";
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
            showColors.value = false;
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
          showColors.value = false;
        }
      }
    };
    const usernameValidation = (username) => {
      const res = /^[a-z0-9_\.]+$/.exec(username);
      const valid = !!res;
      return valid;
    };
    const sendMsg = () => {
      const msgref = db.database().ref("messages");
      if (
        inputMsg.value == "" ||
        inputMsg.value === null ||
        inputMsg.value == " "
      )
        return;
      const message = {
        username: state.userName,
        content: inputMsg.value,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
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
      if (localStorage.themeColor) {
        theme.value = localStorage.themeColor;
      } else {
        theme.value = "indigo";
        localStorage.themeColor = "indigo";
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
            date: data[key].date,
            time: data[key].time,
          });
        });

        state.messages = messages;
        dates.value = state.messages.map((message) => {
          return message.date;
        });
        dates.value = [...new Set(dates.value)];
        console.log(dates);
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
        scrollToBottom();
      }
    });

    const scroll = () => {
      scrollToBottom();
    };
    const showInfo = ref(false);
    const changeColor = (color) => {
      theme.value = color;
      showColors.value = false;
      localStorage.themeColor = color;
      console.log(theme.value);
    };
    return {
      vh,
      isLoggedIn,
      inputUsername,
      state,
      login,
      inputMsg,
      input,
      sendMsg,
      logOut,
      isLoading,
      lastMsgUser,
      Alert,
      AlertMsg,
      chatbox,
      dates,
      scroll,
      showDate,
      theme,
      showColors,
      changeColor,
      showInfo,
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
  user-select: none;
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
  width: 4px;
  cursor: pointer;
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
.theme div,
.showColors {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>
