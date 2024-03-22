<script setup>
import { doc, arrayUnion, updateDoc, arrayRemove, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase.js'
import { ref, inject } from 'vue'
import CloudImage from './CloudImage.vue'
import OpenedCardVue from './OpenedCard.vue'

const props = defineProps({
  load: Boolean,
  id: String,
  name: String,
  cals: Number,
  category: String,
  proteins: Number,
  carbs: Number,
  fats: Number,
  imageUrl: String,
  isFavorite: Boolean,
  ingredients: Array,
  desc: String,
  allergenics: Array
})

const { user } = inject('userInfo')
const isCardHidden = ref(false)
const isCardOpened = ref(false)
const isAddingToMeal = ref(false)

const quantity = ref(100)

const emit = defineEmits(['card-heart-clicked'])

const localeImageUrl = ref('recipeImages/')

const addToMeal = async (mealType) => {
  isAddingToMeal.value = false
  const date = new Date()
  const today = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`
  const recordRef = doc(db, 'users', user.value.uid, 'records', today)
  const recordData = (await getDoc(recordRef)).data()
  if (!recordData) {
    await setDoc(recordRef, { currentWeight: null, breakfast: [], lunch: [], dinner: [] })
  }

  if (mealType === 'breakfast') {
    await updateDoc(recordRef, {
      breakfast: arrayUnion({
        selectedMeals: [
          {
            amount: quantity.value,
            cals: props.cals,
            proteins: props.proteins,
            carbs: props.carbs,
            fats: props.fats,
            localeName: props.name
          }
        ]
      })
    })
  }
  if (mealType === 'lunch') {
    await updateDoc(recordRef, {
      lunch: arrayUnion({
        selectedMeals: [
          {
            amount: quantity.value,
            cals: props.cals,
            proteins: props.proteins,
            carbs: props.carbs,
            fats: props.fats,
            localeName: props.name
          }
        ]
      })
    })
  }
  if (mealType === 'dinner') {
    await updateDoc(recordRef, {
      dinner: arrayUnion({
        selectedMeals: [
          {
            amount: quantity.value,
            cals: props.cals,
            proteins: props.proteins,
            carbs: props.carbs,
            fats: props.fats,
            localeName: props.name
          }
        ]
      })
    })
  }
}

const removeRecipe = async () => {
  const userRef = doc(db, 'users', user.value.uid)

  await updateDoc(userRef, {
    ownRecipes: arrayRemove({
      allergenics: props.allergenics,
      cals: props.cals,
      carbs: props.carbs,
      category: props.category,
      desc: props.desc,
      fats: props.fats,
      ingredients: props.ingredients,
      name: props.name,
      picUrl: props.imageUrl,
      proteins: props.proteins
    })
  })
  console.log('wtf')
  isCardHidden.value = true
}
</script>

<template>
  <OpenedCardVue v-if="isCardOpened" :card="props" @do-close="() => (isCardOpened = false)" />

  <div
    @click="() => (isCardOpened = true)"
    v-if="!isCardHidden"
    class="relative overflow-hidden h-auto bg-white border border-slate-400 rounded-3xl cursor-pointer transition hover:-translate-y-2 hover:shadow-xl"
  >
    <div
      @click.stop=""
      :class="isAddingToMeal ? 'translate-y-0' : '-translate-y-full'"
      class="absolute overflow-hidden bg-slate-100 w-full h-full transition-all ease duration-500 cursor-default"
    >
      <div class="h-full pt-14 flex flex-col items-center bg-slate-50">
        <div
          class="flex justify-center mb-2 items-center w-fit overflow-hidden bg-white border-2 rounded-full"
        >
          <input
            step="10"
            min="0"
            max="1000"
            v-model.number="quantity"
            type="number"
            class="w-20 text-center bg-inherit outline-none"
          />
          <span class="p-3 border-l-2 bg-slate-100">грамм</span>
        </div>
        <div class="flex flex-col w-full h-full">
          <button
            @click="addToMeal('breakfast')"
            class="w-full h-full border-0 bg-slate-50 border-b-2 hover:bg-amber-300 transition duration-500"
          >
            🍎 Добавить в завтрак
          </button>
          <button
            @click="addToMeal('lunch')"
            class="w-full h-full border-0 bg-slate-50 border-b-2 hover:bg-amber-300 transition duration-500"
          >
            🥣 Добавить в обед
          </button>
          <button
            @click="addToMeal('dinner')"
            class="w-full h-full border-0 bg-slate-50 border-b-2 hover:bg-amber-300 transition duration-500"
          >
            🍝 Добавить в ужин
          </button>
          <button
            @click="() => (isAddingToMeal = false)"
            class="w-full h-full border-0 bg-slate-50 hover:bg-red-200 transition duration-500"
          >
            ❌ Отменить
          </button>
        </div>
      </div>
    </div>
    <img
      v-if="!load"
      :src="!isFavorite ? '/like-1.svg' : '/like-2.svg'"
      alt="Like 1"
      class="absolute top-4 left-4"
      @click.stop="() => emit('card-heart-clicked', id, isFavorite)"
    />
    <img
      @click.stop="isAddingToMeal = !isAddingToMeal"
      class="absolute top-4 right-4"
      :src="!isAddingToMeal ? '/plus.svg' : '/checked.svg'"
      alt="Plus"
    />

    <CloudImage v-if="load" :path="imageUrl" />

    <img
      v-else
      :src="localeImageUrl + imageUrl"
      alt="Картинка блюда"
      class="w-full aspect-square object-cover"
    />

    <div class="flex justify-between m-4">
      <div class="flex flex-col">
        <p class="line-clamp-1">{{ name }}</p>
        <b class="">{{ cals }} Ккал</b>
        <span class="text-slate-400">БЖУ: {{ proteins }} | {{ fats }} | {{ carbs }}</span>
      </div>
    </div>
    <div v-if="load">
      <button
        @click.stop="removeRecipe"
        class="absolute bottom-4 right-4 w-8 h-8 rounded-lg p-1 bg-slate-200 hover:bg-red-300 transition"
      >
        <img src="/plus3.svg" class="origin-center rotate-45" alt="Удалить рецепт" />
      </button>
    </div>
  </div>
</template>
