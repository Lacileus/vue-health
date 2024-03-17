<script setup>
import { db } from '../firebase/firebase.js'
import { doc, getDoc, setDoc, updateDoc, deleteField } from 'firebase/firestore'
import debounce from 'lodash.debounce'
import Meal from '@/components/Meal.vue'
import { ref, reactive, inject, onMounted } from 'vue'
const { user } = inject('userInfo')

const userData = reactive({
  calories: 0,
  carbs: 0,
  proteins: 0,
  fats: 0,
  allergenics: []
})

const caloriesWidth = ref(0)
const carbsWidth = ref(0)
const proteinsWidth = ref(0)
const fatsWidth = ref(0)

const sumOfCals = ref(0)
const sumOfProteins = ref(0)
const sumOfCarbs = ref(0)
const sumOfFats = ref(0)

const date = new Date()
const today = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`
const selectedDate = ref(
  `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`
)

const mealsRecord = reactive({
  currentWeight: null,
  breakfast: [],
  lunch: [],
  dinner: []
})

const handleMealAdded = async (selectedMeals, mealType) => {
  mealsRecord[mealType].push({ selectedMeals })
  const recordRef = doc(db, 'users', user.value.uid, 'records', selectedDate.value)
  await setDoc(recordRef, { ...mealsRecord })
  updateDayGoals()
}

const handleMealDeleted = async (mealType, index) => {
  mealsRecord[mealType].splice(index, 1)
  const recordRef = doc(db, 'users', user.value.uid, 'records', selectedDate.value)
  await setDoc(recordRef, { ...mealsRecord })
  updateDayGoals()
}

const onSelectDay = debounce(async () => {
  const recordRef = doc(db, 'users', user.value.uid, 'records', selectedDate.value)
  const recordData = (await getDoc(recordRef)).data()
  if (recordData) {
    mealsRecord.currentWeight = recordData.currentWeight
    mealsRecord.breakfast = recordData.breakfast
    mealsRecord.lunch = recordData.lunch
    mealsRecord.dinner = recordData.dinner
  } else {
    mealsRecord.currentWeight = null
    mealsRecord.breakfast = []
    mealsRecord.lunch = []
    mealsRecord.dinner = []
  }
  updateDayGoals()
}, 500)

const validateWeigth = async (event) => {
  if (!event.target.value) {
    mealsRecord.currentWeight = null
  } else if (event.target.value > 300) {
    mealsRecord.currentWeight = 300
    event.target.value = 300
  } else if (event.target.value < 20) {
    mealsRecord.currentWeight = 20
    event.target.value = 20
  } else {
    mealsRecord.currentWeight = event.target.value
  }
  const recordRef = doc(db, 'users', user.value.uid, 'records', selectedDate.value)
  if (mealsRecord.currentWeight) {
    await setDoc(recordRef, { ...mealsRecord })
    // await updateDoc(recordRef, {
    //   currentWeight: mealsRecord.currentWeight
    // }
    // )
  } else {
    await setDoc(recordRef, { ...mealsRecord })
    // await updateDoc(recordRef, {
    //   currentWeight: deleteField()
    // })
  }
}

const updateDayGoals = () => {
  sumOfCals.value = (
    mealsRecord.breakfast.reduce(
      (acc, meals) =>
        (acc += meals.selectedMeals.reduce(
          (sum, meal) => (sum += (meal.cals * meal.amount) / 100),
          0
        )),
      0
    ) +
    mealsRecord.lunch.reduce(
      (acc, meals) =>
        (acc += meals.selectedMeals.reduce(
          (sum, meal) => (sum += (meal.cals * meal.amount) / 100),
          0
        )),
      0
    ) +
    mealsRecord.dinner.reduce(
      (acc, meals) =>
        (acc += meals.selectedMeals.reduce(
          (sum, meal) => (sum += (meal.cals * meal.amount) / 100),
          0
        )),
      0
    )
  ).toFixed(0)

  sumOfProteins.value = (
    mealsRecord.breakfast.reduce(
      (acc, meals) =>
        (acc += meals.selectedMeals.reduce(
          (sum, meal) => (sum += (meal.proteins * meal.amount) / 100),
          0
        )),
      0
    ) +
    mealsRecord.lunch.reduce(
      (acc, meals) =>
        (acc += meals.selectedMeals.reduce(
          (sum, meal) => (sum += (meal.proteins * meal.amount) / 100),
          0
        )),
      0
    ) +
    mealsRecord.dinner.reduce(
      (acc, meals) =>
        (acc += meals.selectedMeals.reduce(
          (sum, meal) => (sum += (meal.proteins * meal.amount) / 100),
          0
        )),
      0
    )
  ).toFixed(0)

  sumOfCarbs.value = (
    mealsRecord.breakfast.reduce(
      (acc, meals) =>
        (acc += meals.selectedMeals.reduce(
          (sum, meal) => (sum += (meal.carbs * meal.amount) / 100),
          0
        )),
      0
    ) +
    mealsRecord.lunch.reduce(
      (acc, meals) =>
        (acc += meals.selectedMeals.reduce(
          (sum, meal) => (sum += (meal.carbs * meal.amount) / 100),
          0
        )),
      0
    ) +
    mealsRecord.dinner.reduce(
      (acc, meals) =>
        (acc += meals.selectedMeals.reduce(
          (sum, meal) => (sum += (meal.carbs * meal.amount) / 100),
          0
        )),
      0
    )
  ).toFixed(0)

  sumOfFats.value = (
    mealsRecord.breakfast.reduce(
      (acc, meals) =>
        (acc += meals.selectedMeals.reduce(
          (sum, meal) => (sum += (meal.fats * meal.amount) / 100),
          0
        )),
      0
    ) +
    mealsRecord.lunch.reduce(
      (acc, meals) =>
        (acc += meals.selectedMeals.reduce(
          (sum, meal) => (sum += (meal.fats * meal.amount) / 100),
          0
        )),
      0
    ) +
    mealsRecord.dinner.reduce(
      (acc, meals) =>
        (acc += meals.selectedMeals.reduce(
          (sum, meal) => (sum += (meal.fats * meal.amount) / 100),
          0
        )),
      0
    )
  ).toFixed(0)

  caloriesWidth.value = Math.round((sumOfCals.value * 100) / userData.calories)
  carbsWidth.value = Math.round((sumOfCarbs.value * 100) / userData.carbs)
  proteinsWidth.value = Math.round((sumOfProteins.value * 100) / userData.proteins)
  fatsWidth.value = Math.round((sumOfFats.value * 100) / userData.fats)
}

onMounted(async () => {
  const userRef = doc(db, 'users', user.value.uid)
  const userSnap = await getDoc(userRef)
  userData.calories = userSnap.data().calories
  userData.carbs = userSnap.data().carbs
  userData.proteins = userSnap.data().proteins
  userData.fats = userSnap.data().fats
  userData.allergenics = userSnap.data().allergenics

  const recordRef = doc(db, 'users', user.value.uid, 'records', selectedDate.value)
  const recordData = (await getDoc(recordRef)).data()
  if (recordData) {
    mealsRecord.breakfast = recordData.breakfast
    mealsRecord.lunch = recordData.lunch
    mealsRecord.dinner = recordData.dinner
    mealsRecord.currentWeight = recordData.currentWeight
  } else {
    mealsRecord.breakfast = []
    mealsRecord.lunch = []
    mealsRecord.dinner = []
    mealsRecord.currentWeight = null
  }

  updateDayGoals()
})
</script>

<template>
  <h1 class="text-3xl font-bold mb-4">Рацион</h1>
  <div class="flex flex-col sm:flex-row gap-4 mb-4">
    <input
      class="bg-slate-100 hover:bg-slate-200 rounded-3xl border-2 p-4 transition outline-none text-lg font-bold"
      type="date"
      v-model="selectedDate"
      :max="today"
    />
    <button
      :disabled="!selectedDate"
      @click="onSelectDay"
      class="rounded-3xl text-lg p-4 bg-amber-400 border-2 border-amber-500 hover:bg-amber-300 hover:border-amber-400 hover:shadow-amber-400 hover:shadow-lg transition disabled:bg-gray-400 disabled:border-gray-500 disabled:shadow-gray-300"
    >
      Выбрать день
    </button>
  </div>
  <div class="flex items-center w-fit mb-4 bg-slate-100 rounded-3xl border-2 overflow-hidden">
    <input
      v-model="mealsRecord.currentWeight"
      @focusout="validateWeigth"
      class="w-24 bg-inherit text-lg text-center outline-none"
      type="number"
      placeholder="Ваш вес"
      min="20"
      max="300"
    />
    <span class="border-l-2 text-lg p-4 bg-slate-200">КГ</span>
  </div>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 rounded-3xl">
    <div
      :class="
        sumOfCals > userData.calories
          ? 'bg-amber-300 shadow-xl shadow-amber-200 border-amber-300 hover:bg-amber-200 hover:border-amber-200'
          : 'bg-slate-100'
      "
      class="flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition"
    >
      <img width="72" height="72" src="/fire.svg" alt="" />
      <span class="font-bold text-center">{{
        `${sumOfCals} / ${userData.calories || '???'}`
      }}</span>
      <span class="mb-3 uppercase font-bold text-center">Ккал</span>
      <div class="h-1 w-3/5 rounded-full bg-slate-600 overflow-hidden">
        <div :style="{ width: caloriesWidth + '%' }" class="h-full bg-amber-500 rounded-full"></div>
      </div>
    </div>
    <div
      :class="
        sumOfProteins > userData.proteins
          ? 'bg-amber-300 shadow-xl shadow-amber-200 border-amber-300 hover:bg-amber-200 hover:border-amber-200'
          : 'bg-slate-100'
      "
      class="flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition"
    >
      <img width="64" height="64" src="/egg.svg" alt="" />
      <span class="font-bold text-center">{{
        `${sumOfProteins} / ${userData.proteins || '???'}`
      }}</span>
      <span class="mb-3 uppercase font-bold text-center">Белки</span>
      <div class="h-1 w-3/5 rounded-full bg-slate-600 overflow-hidden">
        <div :style="{ width: proteinsWidth + '%' }" class="h-full bg-amber-500 rounded-full"></div>
      </div>
    </div>
    <div
      :class="
        sumOfCarbs > userData.carbs
          ? 'bg-amber-300 shadow-xl shadow-amber-200 border-amber-300 hover:bg-amber-200 hover:border-amber-200'
          : 'bg-slate-100'
      "
      class="flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition"
    >
      <img width="64" height="64" src="/bread.svg" alt="" />
      <span class="font-bold text-center">{{ `${sumOfCarbs} / ${userData.carbs || '???'}` }}</span>
      <span class="mb-3 uppercase font-bold text-center">Углеводы</span>
      <div class="h-1 w-3/5 rounded-full bg-slate-600 overflow-hidden">
        <div :style="{ width: carbsWidth + '%' }" class="h-full bg-amber-500 rounded-full"></div>
      </div>
    </div>
    <div
      :class="
        sumOfFats > userData.fats
          ? 'bg-amber-300 shadow-xl shadow-amber-200 border-amber-300 hover:bg-amber-200 hover:border-amber-200'
          : 'bg-slate-100'
      "
      class="flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition"
    >
      <img width="64" height="64" src="/fish.svg" alt="" />
      <span class="font-bold text-center">{{ `${sumOfFats} / ${userData.fats || '???'}` }}</span>
      <span class="mb-3 uppercase font-bold text-center">Жиры</span>
      <div class="h-1 w-3/5 rounded-full bg-slate-600 overflow-hidden">
        <div :style="{ width: fatsWidth + '%' }" class="h-full bg-amber-500 rounded-full"></div>
      </div>
    </div>
  </div>

  <div>
    <div class="mb-2">
      <Meal
        @meal-added="handleMealAdded"
        @meal-deleted="handleMealDeleted"
        meal-type="breakfast"
        meal-pic="/breakfast.svg"
        :selected-date="selectedDate"
        :meal-data="mealsRecord.breakfast"
        :allergenics="userData.allergenics"
      />
    </div>
    <div class="mb-2">
      <Meal
        @meal-added="handleMealAdded"
        @meal-deleted="handleMealDeleted"
        meal-type="lunch"
        meal-pic="/lunch.svg"
        :selected-date="selectedDate"
        :meal-data="mealsRecord.lunch"
        :allergenics="userData.allergenics"
      />
    </div>
    <div class="mb-2">
      <Meal
        @meal-added="handleMealAdded"
        @meal-deleted="handleMealDeleted"
        meal-type="dinner"
        meal-pic="/dinner.svg"
        :selected-date="selectedDate"
        :meal-data="mealsRecord.dinner"
        :allergenics="userData.allergenics"
      />
    </div>
  </div>
</template>

<style scoped>
::-webkit-calendar-picker-indicator {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>
