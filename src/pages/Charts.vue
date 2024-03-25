<script setup>
import { Chart } from 'chart.js/auto'
import { db } from '../firebase/firebase.js'
import { collection, getDocs } from 'firebase/firestore'
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
  console.log(records.value)
  const sumOfProteins = records.value.map(
    (item) =>
      item.breakfast.reduce(
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
      )
  )

  const sumOfCarbs = records.value.map(
    (item) =>
      item.breakfast.reduce(
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
      )
  )

  const sumOfFats = records.value.map(
    (item) =>
      item.breakfast.reduce(
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
      )
  )
  console.log(sumOfFats)
  const sumOfCalories = sumOfProteins.reduce(
    (acc, item, index) => (acc.push(item + sumOfCarbs[index] + sumOfFats[index]), acc),
    []
  )
  const sumOfDates = records.value.map((item) => item.date)
  const sumOfCurentWeights = records.value.map((item) => item.currentWeight || null)

  const calories = document.getElementById('calories')
  const pfc = document.getElementById('pfc')
  const distribution = document.getElementById('distribution')
  const weight = document.getElementById('weight')

  const caloriesChart = new Chart(calories, {
    type: 'line',
    aspectRatio: 1,
    data: {
      labels: sumOfDates,
      datasets: [
        {
          label: 'Ккал',
          data: sumOfCalories,
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

  const pfcChart = new Chart(pfc, {
    type: 'bar',
    aspectRatio: 1,
    data: {
      labels: sumOfDates,
      datasets: [
        {
          label: 'Белки, гр.',
          data: sumOfProteins,
          backgroundColor: '#f59e0b'
        },

        {
          label: 'Углеводы, гр.',
          data: sumOfCarbs,
          backgroundColor: '#fbbf24'
        },
        {
          label: 'Жиры, гр.',
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

  const distributionChart = new Chart(distribution, {
    type: 'bar',
    aspectRatio: 1,
    data: {
      labels: sumOfDates,
      datasets: [
        {
          label: 'Белки, Ккал.',
          data: sumOfProteins.map((item) => item * 4),
          backgroundColor: '#f59e0b'
        },

        {
          label: 'Углеводы, Ккал.',
          data: sumOfCarbs.map((item) => item * 4),
          backgroundColor: '#fbbf24'
        },
        {
          label: 'Жиры, Ккал.',
          data: sumOfFats.map((item) => item * 9),
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

  const weightChart = new Chart(weight, {
    type: 'line',
    aspectRatio: 1,
    data: {
      labels: sumOfDates,
      datasets: [
        {
          label: 'Вес, кг',
          data: sumOfCurentWeights,
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
  caloriesChart
  pfcChart
  distributionChart
  weightChart
})
</script>

<template>
  <h1 class="text-3xl font-bold mb-4">Статистика</h1>
  <div class="w-full">
    <h2 class="text-lg text-slate-600 text-center">Потребление Ккал:</h2>
    <canvas id="calories" width="400" height="100"></canvas>

    <h2 class="mt-12 text-lg text-slate-600 text-center">Потребление БЖУ:</h2>
    <canvas id="pfc" width="400" height="100"></canvas>

    <h2 class="mt-12 text-lg text-slate-600 text-center">Распределение Ккал по БЖУ:</h2>
    <canvas id="distribution" width="400" height="100"></canvas>

    <h2 class="mt-12 text-lg text-slate-600 text-center">Вес:</h2>
    <canvas id="weight" width="400" height="100"></canvas>
  </div>
</template>
