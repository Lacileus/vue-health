<script setup>
import { db, auth } from './firebase/firebase.js'
import { setDoc, doc } from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { useRouter } from 'vue-router'
import { ref, provide, computed } from 'vue'
import Header from './components/Header.vue'

// Корзина START //
const cart = ref([])
const totalPrice = computed(() => cart.value.reduce((acc, item) => (acc += item.price), 0))

const router = useRouter()
const user = ref(null)
const isAuthReady = ref(false)
const email = ref('')
const password = ref('')
const error = ref(null)

const userSignUp = async () => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email.value, password.value)
    if (res) {
      user.value = res.user
      router.push('/profile')
      email.value = ''
      password.value = ''
      await setDoc(doc(db, 'users', user.value.uid), {
        calories: 0,
        carbs: 0,
        proteins: 0,
        fats: 0,
        favorites: [],
        ownRecipes: [],
        allergenics: []
      })
    }
    error.value = null
  } catch (e) {
    if (e.toString() === 'FirebaseError: Firebase: Error (auth/invalid-email).') {
      console.log(2)
      error.value = 'Неверный email'
    } else if (e.toString() === 'FirebaseError: Firebase: Error (auth/missing-password).') {
      error.value = 'Отсутствует пароль'
    } else if (e.toString() === 'FirebaseError: Firebase: Error (auth/invalid-credential).') {
      error.value = 'Неверный пароль'
    } else if (e.toString() === 'FirebaseError: Firebase: Error (auth/email-already-in-use).') {
      error.value = 'Пользователь с таким email уже зарегестрирован'
    } else if (
      e.toString() ===
      'FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).'
    ) {
      error.value = 'Пароль должен быть как минимум 6 символов'
    } else {
      error.value = e
    }
  }
}

const userSignIn = async () => {
  try {
    const res = await signInWithEmailAndPassword(auth, email.value, password.value)
    if (res) {
      user.value = res.user
      error.value = null
      email.value = ''
      password.value = ''
    }
  } catch (e) {
    if (e.toString() === 'FirebaseError: Firebase: Error (auth/invalid-email).') {
      console.log(2)
      error.value = 'Неверный email'
    } else if (e.toString() === 'FirebaseError: Firebase: Error (auth/missing-password).') {
      error.value = 'Отсутствует пароль'
    } else if (e.toString() === 'FirebaseError: Firebase: Error (auth/invalid-credential).') {
      error.value = 'Неверный пароль'
    } else if (e.toString() === 'FirebaseError: Firebase: Error (auth/email-already-in-use).') {
      error.value = 'Пользователь с таким email уже зарегестрирован'
    } else if (
      e.toString() ===
      'FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).'
    ) {
      error.value = 'Пароль должен быть как минимум 6 символов'
    } else {
      error.value = e
    }
  }
}

const userSignOut = async () => {
  await signOut(auth)
  user.value = null
  error.value = null
}

const unSub = onAuthStateChanged(auth, (userResponse) => {
  isAuthReady.value = true
  user.value = userResponse
  unSub()
})

provide('userInfo', {
  user,
  userSignOut
})
</script>

<template>
  <div v-if="user">
    <div class="bg-white w-full sm:w-4/5 2xl:w-[1280px] m-auto sm:rounded-xl shadow-xl sm:my-14">
      <Header :total-price="totalPrice" />
      <div class="p-2 sm:p-8">
        <router-view></router-view>
      </div>
    </div>
  </div>

  <div
    v-if="!user"
    class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-fit bg-white w-full sm:w-3/4 md:w-1/2 px-8 py-12 sm:rounded-xl shadow-xl"
  >
    <div class="flex flex-col items-center gap-4">
      <input
        class="w-full border-b-2 text-center outline-none"
        v-model="email"
        placeholder="Email..."
        type="text"
        id="email"
      />
      <input
        class="w-full border-b-2 text-center outline-none"
        v-model="password"
        placeholder="Пароль..."
        type="password"
        id="password"
      />
      <div class="flex gap-4 mt-4">
        <button
          class="w-fit border-2 p-2 rounded-xl bg-green-200 border-green-300 transition hover:bg-green-100 hover:border-green-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-200"
          @click="userSignUp"
        >
          Зарегистрироваться
        </button>
        <button
          class="w-fit px-8 border-2 p-2 rounded-xl bg-slate-200 border-slate-300 transition hover:bg-slate-100 hover:border-slate-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200"
          @click="userSignIn"
        >
          Войти
        </button>
      </div>
      <div v-if="error">
        <span class="text-red-400">{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
