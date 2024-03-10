<script setup>
import { db } from '../firebase/firebase.js'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, inject } from 'vue'

const { user, userSignOut } = inject('userInfo')
const plan = ref('')
const gender = ref('')
const weight = ref(null)
const growth = ref(null)
const age = ref(null)
const allergenics = ref([])
const recomendedCalories = ref(0)
const recomendedCarbs = ref(0)
const recomendedProteins = ref(0)
const recomendedFats = ref(0)

const validateWeigth = (event) => {
  if (!event.target.value) {
    return
  }
  if (event.target.value > 300) {
    weight.value = 300
  }
  if (event.target.value < 20) {
    weight.value = 20
  }
}

const validateGrowth = (event) => {
  if (!event.target.value) {
    return
  }
  if (event.target.value > 250) {
    growth.value = 250
  }
  if (event.target.value < 100) {
    growth.value = 100
  }
}

const validateAge = (event) => {
  if (!event.target.value) {
    return
  }
  if (event.target.value > 100) {
    age.value = 100
  }
  if (event.target.value < 5) {
    age.value = 5
  }
}

const calculateCalories = async () => {
  recomendedCalories.value = weight.value * 10 + growth.value * 6.25 - age.value * 5
  if (gender.value === 'male') {
    recomendedCalories.value += 5
  } else {
    recomendedCalories.value -= 161
  }
  if (plan.value == 'high') {
    recomendedCalories.value *= 1.2
  }
  if (plan.value == 'low') {
    recomendedCalories.value *= 0.85
  }
  recomendedCalories.value = Math.ceil(recomendedCalories.value * 1.35)

  if (plan.value === 'low') {
    recomendedCarbs.value = Math.ceil((recomendedCalories.value * 0.45) / 4)
    recomendedProteins.value = Math.ceil((recomendedCalories.value * 0.3) / 4)
    recomendedFats.value = Math.ceil((recomendedCalories.value * 0.25) / 9)
  } else {
    recomendedCarbs.value = Math.ceil((recomendedCalories.value * 0.62) / 4)
    recomendedProteins.value = Math.ceil((recomendedCalories.value * 0.23) / 4)
    recomendedFats.value = Math.ceil((recomendedCalories.value * 0.15) / 9)
  }

  await updateDoc(doc(db, 'users', user.value.uid), {
    calories: recomendedCalories.value,
    carbs: recomendedCarbs.value,
    proteins: recomendedProteins.value,
    fats: recomendedFats.value,
    allergenics: allergenics.value
  })
}
</script>

<template>
  <h1 class="text-3xl font-bold mb-4">Профиль</h1>
  <div class="flex items-baseline justify-between mb-8">
    <span class="text-xl border-b-amber-500 border-b-2">{{ user.email }}</span>
    <button
      @click="userSignOut"
      class="text-xl py-2 px-4 rounded-xl bg-slate-300 transition hover:bg-slate-400"
    >
      Выйти
    </button>
  </div>
  <div class="flex flex-col">
    <h2 class="mx-auto text-xl font-bold mb-4">Выберите план питания</h2>
    <div class="flex flex-col items-center sm:flex-row gap-4 justify-evenly mb-8">
      <div
        @click="() => (plan = 'high')"
        :class="plan === 'high' ? 'bg-red-400' : 'bg-red-100'"
        class="flex flex-col items-center justify-center cursor-pointer w-52 aspect-square rounded-3xl transition hover:-translate-y-2 hover:shadow-red-300 hover:shadow-xl"
      >
        <img class="w-3/5" src="/dumbell.svg" />
        <span class="text-xl font-bold">Набрать вес</span>
      </div>
      <div
        @click="() => (plan = 'medium')"
        :class="plan === 'medium' ? 'bg-amber-400' : 'bg-amber-100'"
        class="flex flex-col items-center justify-center cursor-pointer w-52 aspect-square rounded-3xl transition hover:-translate-y-2 hover:shadow-amber-300 hover:shadow-xl"
      >
        <img class="w-3/5" src="/balance.svg" /><span class="text-xl font-bold">Удержать вес</span>
      </div>
      <div
        :class="plan === 'low' ? 'bg-green-400' : 'bg-green-100'"
        @click="() => (plan = 'low')"
        class="flex flex-col items-center justify-center cursor-pointer w-52 aspect-square rounded-3xl transition hover:-translate-y-2 hover:shadow-green-300 hover:shadow-xl"
      >
        <img class="w-3/5" src="/feather.svg" /><span class="text-xl font-bold">Похудеть</span>
      </div>
    </div>
    <h2 class="mx-auto text-xl font-bold mb-4">Выберите ваш пол</h2>
    <div class="flex flex-col items-center sm:flex-row gap-4 justify-evenly mb-8">
      <div
        :class="gender === 'male' ? 'bg-teal-400' : 'bg-teal-100'"
        @click="() => (gender = 'male')"
        class="flex flex-col items-center justify-center cursor-pointer w-52 aspect-square rounded-3xl text-center transition hover:-translate-y-2 hover:shadow-teal-300 hover:shadow-xl"
      >
        <img class="w-3/5" src="/male.svg" />
        <span class="text-xl font-bold">Мужской</span>
      </div>
      <div
        @click="() => (gender = 'female')"
        :class="gender === 'female' ? 'bg-fuchsia-400' : 'bg-fuchsia-100'"
        class="flex flex-col items-center justify-center cursor-pointer w-52 aspect-square rounded-3xl text-center transition hover:-translate-y-2 hover:shadow-fuchsia-300 hover:shadow-xl"
      >
        <img class="w-3/5" src="/female.svg" />
        <span class="text-xl font-bold">Женский</span>
      </div>
    </div>

    <div class="flex flex-col items-center gap-4 mb-8">
      <input
        v-model="weight"
        @focusout="validateWeigth"
        class="w-full sm:w-1/2 border-2 text-center p-6 bg-slate-100 transition hover:bg-slate-200 rounded-3xl text-lg"
        type="number"
        placeholder="Вес..."
        required
      />
      <input
        v-model="growth"
        @focusout="validateGrowth"
        class="w-full sm:w-1/2 border-2 p-6 text-center bg-slate-100 transition hover:bg-slate-200 rounded-3xl text-lg"
        type="number"
        placeholder="Рост..."
        required
      />
      <input
        v-model="age"
        @focusout="validateAge"
        class="w-full sm:w-1/2 border-2 p-6 text-center bg-slate-100 transition hover:bg-slate-200 rounded-3xl text-lg"
        type="number"
        placeholder="Возраст..."
        min="0"
        max="100"
        required
      />

      <h2 class="mx-auto text-xl font-bold mb-2 mt-6">Аллергены:</h2>
      <div class="mb-8 flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <input
            class="w-5 h-5"
            type="checkbox"
            id="glutenCheckBox"
            value="Глютен"
            v-model="allergenics"
          />
          <label class="text-lg" for="glutenCheckBox">🍞 Глютен </label>
        </div>
        <div class="flex items-center gap-2">
          <input
            class="w-5 h-5"
            type="checkbox"
            id="milkCheckBox"
            value="Молочный белок"
            v-model="allergenics"
          />
          <label class="text-lg" for="milkCheckBox">🥛 Молочный белок </label>
        </div>
        <div class="flex items-center gap-2">
          <input
            class="w-5 h-5"
            type="checkbox"
            id="milkCheckBox"
            value="Сахар"
            v-model="allergenics"
          />
          <label class="text-lg" for="milkCheckBox">🍭 Сахар </label>
        </div>
        <div class="flex items-center gap-2">
          <input
            class="w-5 h-5"
            type="checkbox"
            id="eggCheckbox"
            value="Яичный белок"
            v-model="allergenics"
          />
          <label class="text-lg" for="eggCheckbox">🥚 Яичный белок</label>
        </div>
        <div class="flex items-center gap-2">
          <input
            class="w-5 h-5"
            type="checkbox"
            id="soyCheckbox"
            value="Соевый белок"
            v-model="allergenics"
          />
          <label class="text-lg" for="soyCheckbox">🌱 Соевый белок</label>
        </div>
        <div class="flex items-center gap-2">
          <input
            class="w-5 h-5"
            type="checkbox"
            id="nutCheckbox"
            value="Орехи"
            v-model="allergenics"
          />
          <label class="text-lg" for="nutCheckbox">🥜 Орехи</label>
        </div>
        <div class="flex items-center gap-2">
          <input
            class="w-5 h-5"
            type="checkbox"
            id="seaCheckbox"
            value="Рыба и морепродукты"
            v-model="allergenics"
          />
          <label class="text-lg" for="seaCheckbox">🐟 Рыба и морепродукты</label>
        </div>
      </div>
      <div class="mb-6">
        <button
          :disabled="!weight || !growth || !age || !plan || !gender"
          type="submit"
          @click="calculateCalories"
          class="p-6 rounded-3xl text-lg bg-amber-400 border-amber-500 border-2 hover:bg-amber-300 hover:border-amber-300 hover:shadow-amber-400 hover:shadow-xl hover:-translate-y-2 transition disabled:bg-gray-400 disabled:shadow-gray-300 disabled:border-gray-400"
        >
          Расчитать дневную норму калорий
        </button>
      </div>
      <div class="flex flex-col items-center w-full">
        <span class="text-lg text-center w-full sm:w-1/2">
          Ваша дневная норма:
          {{ recomendedCalories || '____' }} Ккал</span
        >
        <span class="text-lg text-center w-full sm:w-1/2">
          Белки:
          {{ recomendedProteins || '____' }} грамм</span
        >
        <span class="text-lg text-center w-full sm:w-1/2">
          Углеводы:
          {{ recomendedCarbs || '____' }} грамм</span
        >
        <span class="text-lg text-center w-full sm:w-1/2">
          Жиры:
          {{ recomendedFats || '____' }} грамм</span
        >
      </div>
    </div>
  </div>
</template>
