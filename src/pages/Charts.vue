<script setup>
import { Chart } from 'chart.js/auto'
import { storage, db } from '../firebase/firebase.js'
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  setDoc,
  getDocs,
  documentId,
  deleteDoc,
  updateDoc,
  where,
  arrayRemove,
  memoryLocalCache,
  arrayUnion
} from 'firebase/firestore'
import { ref, onMounted, inject } from 'vue'

const { user } = inject('userInfo')

const records = ref([])

onMounted(async () => {
  const recordsRef = collection(db, 'users', user.value.uid, 'records')
  const recordsSnapshot = await getDocs(recordsRef)

  const fbrecords = []
  recordsSnapshot.forEach((doc) => {
    const record = doc.data()
    record.date = doc.id
    fbrecords.push(record)
  })
  records.value = fbrecords

  const sumOfProteins = records.value.map(
    (item) =>
      4 *
      (item.breakfast.reduce(
        (acc, meals) =>
          (acc += meals.selectedMeals.reduce(
            (sum, meal) => (sum += (meal.proteins * meal.amount) / 100),
            0
          )),
        0
      ) +
        item.lunch.reduce(
          (acc, meals) =>
            (acc += meals.selectedMeals.reduce(
              (sum, meal) => (sum += (meal.proteins * meal.amount) / 100),
              0
            )),
          0
        ) +
        item.dinner.reduce(
          (acc, meals) =>
            (acc += meals.selectedMeals.reduce(
              (sum, meal) => (sum += (meal.proteins * meal.amount) / 100),
              0
            )),
          0
        ))
  )

  const sumOfCarbs = records.value.map(
    (item) =>
      4 *
      (item.breakfast.reduce(
        (acc, meals) =>
          (acc += meals.selectedMeals.reduce(
            (sum, meal) => (sum += (meal.carbs * meal.amount) / 100),
            0
          )),
        0
      ) +
        item.lunch.reduce(
          (acc, meals) =>
            (acc += meals.selectedMeals.reduce(
              (sum, meal) => (sum += (meal.carbs * meal.amount) / 100),
              0
            )),
          0
        ) +
        item.dinner.reduce(
          (acc, meals) =>
            (acc += meals.selectedMeals.reduce(
              (sum, meal) => (sum += (meal.carbs * meal.amount) / 100),
              0
            )),
          0
        ))
  )

  const sumOfFats = records.value.map(
    (item) =>
      9 *
      (item.breakfast.reduce(
        (acc, meals) =>
          (acc += meals.selectedMeals.reduce(
            (sum, meal) => (sum += (meal.fats * meal.amount) / 100),
            0
          )),
        0
      ) +
        item.lunch.reduce(
          (acc, meals) =>
            (acc += meals.selectedMeals.reduce(
              (sum, meal) => (sum += (meal.fats * meal.amount) / 100),
              0
            )),
          0
        ) +
        item.dinner.reduce(
          (acc, meals) =>
            (acc += meals.selectedMeals.reduce(
              (sum, meal) => (sum += (meal.fats * meal.amount) / 100),
              0
            )),
          0
        ))
  )

  const sumOfDates = records.value.map((item) => item.date)
  const sumOfCurentWeights = records.value.map((item) => item.currentWeight || null)
  const ctx = document.getElementById('myChart')
  const ctx1 = document.getElementById('myChart1')
  const myChart = new Chart(ctx, {
    type: 'bar',
    aspectRatio: 1,
    data: {
      labels: sumOfDates,
      datasets: [
        {
          label: 'Белки',
          data: sumOfProteins,
          backgroundColor: '#f59e0b'
        },

        {
          label: 'Углеводы',
          data: sumOfCarbs,
          backgroundColor: '#fbbf24'
        },
        {
          label: 'Жиры',
          data: sumOfFats,
          backgroundColor: '#fcd34d'
        }
      ]
    },

    options: {
      scales: {
        y: {
          stacked: true,
          beginAtZero: true
        },
        x: {
          stacked: true
        }
      }
    }
  })

  const myChart1 = new Chart(ctx1, {
    type: 'line',
    aspectRatio: 1,
    data: {
      labels: sumOfDates,
      datasets: [
        {
          label: 'Вес, кг',
          data: sumOfCurentWeights,
          // data: [0, 20, 20, 60, null, null, null, 180, null, 125, 105, 110, 170],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          cubicInterpolationMode: 'monotone',
          fill: true
        }
      ]
    },

    options: {
      spanGaps: true,
      scales: {
        y: {
          stacked: true,
          beginAtZero: true
        },
        x: {
          stacked: true
        }
      }
    }
  })
  myChart
  myChart1
})
</script>

<template>
  <!-- {{ records }} -->
  <h1 class="text-3xl font-bold mb-4">Статистика</h1>
  <div class="w-full">
    <h2 class="text-lg">Распределение Ккал по БЖУ:</h2>
    <canvas id="myChart" width="400" height="100"></canvas>

    <h2 class="mt-8 text-lg">Вес:</h2>
    <canvas id="myChart1" width="400" height="100"></canvas>
  </div>
</template>
