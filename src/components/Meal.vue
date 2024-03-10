<script setup>
import { ref } from 'vue'
const props = defineProps({
  mealType: String,
  mealPic: String,
  selectedDate: String,
  mealData: Object,
  allergenics: Array
})

const emit = defineEmits(['meal-added', 'meal-deleted'])

const meals = ref([
  {
    name: 'banana',
    localeName: 'Бананы',
    cals: 96,
    proteins: 1.5,
    carbs: 21,
    fats: 0.5,
    allergenic: null,
    isSelected: false
  },
  {
    name: 'beef',
    localeName: 'Говядина',
    cals: 187,
    proteins: 18.9,
    carbs: 0,
    fats: 12.4,
    allergenic: null,
    isSelected: false
  },
  {
    name: 'bread',
    localeName: 'Хлеб',
    cals: 265,
    proteins: 9,
    carbs: 49,
    fats: 3.2,
    allergenic: 'Глютен',
    isSelected: false
  },
  {
    name: 'rice',
    localeName: 'Рис',
    cals: 330,
    proteins: 6,
    carbs: 72,
    fats: 0.5,
    allergenic: null,
    isSelected: false
  },
  {
    name: 'cheese',
    localeName: 'Сыр',
    cals: 334,
    proteins: 26.8,
    carbs: 0,
    fats: 25.2,
    allergenic: 'Молочный белок',
    isSelected: false
  },
  {
    name: 'chicken',
    localeName: 'Курица',
    cals: 190,
    proteins: 16,
    carbs: 0,
    fats: 14,
    allergenic: null,
    isSelected: false
  },
  {
    name: 'eggs',
    localeName: 'Яйца',
    cals: 157,
    proteins: 12.7,
    carbs: 0.7,
    fats: 11.5,
    allergenic: 'Яичный белок',
    isSelected: false
  },
  {
    name: 'fish',
    localeName: 'Рыба',
    cals: 142,
    proteins: 20,
    carbs: 0,
    fats: 6.5,
    allergenic: 'Рыба и морепродукты',
    isSelected: false
  },
  {
    name: 'buckwheat',
    localeName: 'Гречка',
    cals: 329,
    proteins: 13,
    carbs: 68,
    fats: 2.6,
    allergenic: null,
    isSelected: false
  },
  {
    name: 'milk',
    localeName: 'Молоко',
    cals: 64,
    proteins: 3.2,
    carbs: 4.8,
    fats: 3.2,
    allergenic: 'Молочный белок',
    isSelected: false
  },
  {
    name: 'pasta',
    localeName: 'Макароны',
    cals: 334,
    proteins: 10.4,
    carbs: 71.5,
    fats: 1.1,
    allergenic: 'Глютен',
    isSelected: false
  },
  {
    name: 'pork',
    localeName: 'Свинина',
    cals: 357,
    proteins: 14.3,
    carbs: 0,
    fats: 33.3,
    allergenic: null,
    isSelected: false
  },
  {
    name: 'potato',
    localeName: 'Картошка',
    cals: 77,
    proteins: 2,
    carbs: 17.5,
    fats: 0,
    allergenic: null,
    isSelected: false
  },
  {
    name: 'cottage_cheese',
    localeName: 'Творог',
    cals: 80,
    proteins: 18.3,
    carbs: 1.3,
    fats: 0.1,
    allergenic: 'Молочный белок',
    isSelected: false
  },
  {
    name: 'oatmeal',
    localeName: 'Овсянка',
    cals: 380,
    proteins: 11,
    carbs: 70,
    fats: 6,
    allergenic: null,
    isSelected: false
  }
])
const isCreatingMeal = ref(false)
const selectedMeals = ref([])
const customMeals = ref([])

const handleSelection = (item) => {
  item.isSelected = !item.isSelected
  if (item.isSelected) {
    selectedMeals.value.push({ ...item, amount: 100 })
  } else {
    selectedMeals.value = selectedMeals.value.filter((element) => element.name !== item.name)
  }
}

const addCustomProduct = () => {
  customMeals.value.push({
    localeName: 'Название',
    amount: 100,
    cals: 0,
    proteins: 0,
    carbs: 0,
    fats: 0
  })
}

const removeCustomProduct = (index) => {
  console.log(index)
  customMeals.value.splice(index, 1)
}

const addMeal = () => {
  const selectedMealsCopy = JSON.parse(
    JSON.stringify([...selectedMeals.value, ...customMeals.value])
  )
  emit('meal-added', selectedMealsCopy, props.mealType)
  selectedMeals.value = []
  customMeals.value = []
  meals.value.forEach((item) => (item.isSelected = false))
}
</script>

<template>
  <div
    class="flex flex-col items-center w-full lg:w-2/3 mx-auto overflow-hidden bg-slate-50 border-2 rounded-3xl"
  >
    <div class="flex justify-between w-full p-4 bg-slate-100 hover:bg-slate-200 transition">
      <div class="flex gap-2 items-center">
        <img width="32" height="32" :src="props.mealPic" alt="" />
        <span class="text-lg"
          >{{
            props.mealType === 'breakfast'
              ? 'Завтрак'
              : props.mealType === 'lunch'
                ? 'Обед'
                : 'Ужин'
          }}
        </span>
      </div>
      <button
        @click="() => (isCreatingMeal = !isCreatingMeal)"
        class="bg-amber-400 border-2 border-amber-500 hover:bg-amber-500 transition rounded-full w-8 h-8 p-1 text-center text-lg"
      >
        <img
          :class="{ 'origin-center rotate-45': isCreatingMeal }"
          class="transition"
          src="/plus3.svg"
          alt="Добавить запись"
        />
      </button>
    </div>
    <div
      v-for="(mealRecord, index) in props.mealData"
      :key="index"
      class="relative p-4 w-full border-b-2"
    >
      <button
        @click="() => emit('meal-deleted', props.mealType, index)"
        class="absolute top-2 right-5 w-6 h-6 bg-slate-100 rounded-full border-2 border-slate-200 transition hover:bg-red-400 hover:border-red-500"
      >
        <img src="/plus3.svg" class="origin-center rotate-45" alt="Удалить запись" />
      </button>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(product, productIndex) in mealRecord.selectedMeals"
          :key="productIndex"
          :class="
            product.isSelected
              ? props.allergenics.includes(product.allergenic)
                ? 'bg-red-300'
                : 'bg-amber-300'
              : 'bg-orange-300'
          "
          class="truncate py-1 px-2 rounded-full"
        >
          {{ product.localeName }} {{ product.amount }}г
        </span>
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          >Ккал:
          {{
            mealRecord?.selectedMeals
              .reduce((acc, product) => (acc += (product.cals * product.amount) / 100), 0)
              .toFixed(1)
          }}</span
        >
        <span
          >Белок:
          {{
            mealRecord?.selectedMeals
              .reduce((acc, product) => (acc += (product.proteins * product.amount) / 100), 0)
              .toFixed(1)
          }}</span
        >
        <span
          >Углеводы:
          {{
            mealRecord?.selectedMeals
              .reduce((acc, product) => (acc += (product.carbs * product.amount) / 100), 0)
              .toFixed(1)
          }}</span
        >
        <span
          >Жиры:
          {{
            mealRecord?.selectedMeals
              .reduce((acc, product) => (acc += (product.fats * product.amount) / 100), 0)
              .toFixed(1)
          }}</span
        >
      </div>
    </div>
    <div
      :class="isCreatingMeal ? 'max-h-[1200px] ' : 'max-h-0'"
      class="flex flex-col overflow-hidden transition-all ease duration-1000"
    >
      <div
        class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 justify-between my-4 mx-4"
      >
        <div
          v-for="(item, index) in meals"
          :key="index"
          :class="{
            'bg-red-400 hover:bg-red-500':
              props.allergenics.includes(item.allergenic) && item.isSelected,
            'bg-amber-300 hover:bg-amber-400':
              !props.allergenics.includes(item.allergenic) && item.isSelected,
            'bg-red-100 hover:bg-red-200':
              props.allergenics.includes(item.allergenic) && !item.isSelected,
            'bg-slate-100 hover:bg-slate-200':
              !props.allergenics.includes(item.allergenic) && !item.isSelected
          }"
          @click="handleSelection(item)"
          class="flex flex-col items-center justify-center p-2 cursor-pointer transition rounded-2xl"
        >
          <img class="w-1/2" :src="`/food_icons/${item.name}.svg`" :alt="item.name" />
          <span class="truncate text-sm">{{ item.localeName }}</span>
        </div>
        <div
          @click="addCustomProduct"
          class="flex flex-col items-center justify-center p-2 cursor-pointer bg-slate-100 hover:bg-amber-400 hover:border-amber-500 transition rounded-2xl"
        >
          <img class="w-1/2" :src="`/food_icons/custom.svg`" alt="Свой продукт" />
          <span class="text-sm">Другое</span>
        </div>
      </div>

      <div class="flex flex-col p-4">
        <div class="grid grid-cols-6 mb-2 border-b-2">
          <span class="truncate text-center">Продукт</span>
          <span class="truncate text-center">Количество, г.</span>
          <span class="truncate text-center">Ккал</span>
          <span class="truncate text-center">Белки</span>
          <span class="truncate text-center">Углеводы</span>
          <span class="truncate text-center">Жиры</span>
        </div>

        <div
          v-for="(item, index) in selectedMeals"
          :key="index"
          class="grid grid-cols-6 mb-2 border-b-2"
        >
          <span class="text-center">{{ item.localeName }} </span>
          <input
            v-model="item.amount"
            type="number"
            class="bg-inherit font-bold text-center"
            min="0"
            max="1000"
            step="10"
          />
          <span class="text-center"
            >{{ ((item.cals * Math.abs(item.amount)) / 100).toFixed(1) }}
          </span>
          <span class="text-center"
            >{{ ((item.proteins * Math.abs(item.amount)) / 100).toFixed(1) }}
          </span>
          <span class="text-center"
            >{{ ((item.carbs * Math.abs(item.amount)) / 100).toFixed(1) }}
          </span>
          <span class="text-center"
            >{{ ((item.fats * Math.abs(item.amount)) / 100).toFixed(1) }}
          </span>
        </div>
        <div
          v-for="(customMeal, index) in customMeals"
          :key="index"
          class="grid grid-cols-6 mb-2 border-b-2"
        >
          <!-- {{ currentCustomMeal }} -->
          <div class="relative">
            <button
              @click="removeCustomProduct(index)"
              class="absolute -top-1 -left-3 w-6 h-6 bg-slate-100 rounded-full border-2 border-slate-200 transition hover:bg-red-400 hover:border-red-500"
            >
              <img src="/plus3.svg" class="origin-center rotate-45" alt="Удалить запись" />
            </button>
            <input
              v-model="customMeal.localeName"
              type="text"
              class="w-full bg-inherit font-bold text-center"
            />
          </div>
          <input
            v-model="customMeal.amount"
            type="number"
            class="bg-inherit font-bold text-center"
            min="0"
            max="1000"
            step="10"
          />
          <input
            v-model="customMeal.cals"
            type="number"
            class="bg-inherit font-bold text-center"
            min="0"
            max="1000"
            step="10"
          />
          <input
            v-model="customMeal.proteins"
            type="number"
            class="bg-inherit font-bold text-center"
            min="0"
            max="1000"
            step="10"
          />
          <input
            v-model="customMeal.carbs"
            type="number"
            class="bg-inherit font-bold text-center"
            min="0"
            max="1000"
            step="10"
          />
          <input
            v-model="customMeal.fats"
            type="number"
            class="bg-inherit font-bold text-center"
            min="0"
            max="1000"
            step="10"
          />
        </div>

        <div class="grid grid-cols-6 mb-2 border-b-2">
          <span class="truncate text-center">Сумма</span>
          <span class="text-center">{{
            selectedMeals.reduce((acc, item) => (acc += item.amount), 0) +
            customMeals.reduce((acc, item) => (acc += item.amount), 0)
          }}</span>
          <span class="text-center">{{
            (
              selectedMeals.reduce((acc, item) => (acc += (item.cals * item.amount) / 100), 0) +
              customMeals.reduce((acc, item) => (acc += (item.cals * item.amount) / 100), 0)
            ).toFixed(1)
          }}</span>
          <span class="text-center">{{
            (
              selectedMeals.reduce((acc, item) => (acc += (item.proteins * item.amount) / 100), 0) +
              customMeals.reduce((acc, item) => (acc += (item.proteins * item.amount) / 100), 0)
            ).toFixed()
          }}</span>
          <span class="text-center">{{
            (
              selectedMeals.reduce((acc, item) => (acc += (item.carbs * item.amount) / 100), 0) +
              customMeals.reduce((acc, item) => (acc += (item.carbs * item.amount) / 100), 0)
            ).toFixed(1)
          }}</span>
          <span class="text-center">{{
            (
              selectedMeals.reduce((acc, item) => (acc += (item.fats * item.amount) / 100), 0) +
              customMeals.reduce((acc, item) => (acc += (item.fats * item.amount) / 100), 0)
            ).toFixed(1)
          }}</span>
        </div>
      </div>
      <div class="mx-auto mb-4">
        <button @click="addMeal" class="p-4 bg-green-400 rounded-3xl">
          Добавить прием пищи ✔️
        </button>
      </div>
    </div>
  </div>
</template>
