<script setup>
import { Chart } from 'chart.js/auto'
import { db } from '../firebase/firebase.js'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { ref, onMounted, inject } from 'vue'

const { user } = inject('userInfo')

const records = ref([])

onMounted(async () => {
  const userRef = doc(db, 'users', user.value.uid)
  const userSnap = await getDoc(userRef)
  const userData = userSnap.data()

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
  const sumOfCalories = sumOfProteins.reduce(
    (acc, item, index) => (acc.push(item * 4 + sumOfCarbs[index] * 4 + sumOfFats[index] * 9), acc),
    []
  )
  const sumOfDates = records.value.map((item) => item.date.slice(5))
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
          fill: {
            target: { value: userData.calories }
          }
        },
        {
          label: 'Норма',
          data: Array(sumOfCalories.length).fill(userData.calories),
          pointStyle: false,
          borderColor: '#fde68a',
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          cubicInterpolationMode: 'monotone'
        }
      ]
    },

    options: {
      spanGaps: true,
      scales: {
        y: {
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
          backgroundColor: Array(sumOfProteins.length)
            .fill()
            .map((item, index) =>
              sumOfProteins[index] > userData.proteins * 1.1 ||
              sumOfProteins[index] < userData.proteins * 0.9
                ? '#f87171'
                : '#fbbf24'
            )
          // backgroundColor: '#fbbf24'
        },
        {
          label: 'Жиры, гр.',
          data: sumOfFats,
          backgroundColor: Array(sumOfFats.length)
            .fill()
            .map((item, index) =>
              sumOfFats[index] > userData.fats * 1.1 || sumOfFats[index] < userData.fats * 0.9
                ? '#fca5a5'
                : '#fcd34d'
            )
          // backgroundColor: '#fcd34d'
        },

        {
          label: 'Углеводы, гр.',
          data: sumOfCarbs,
          backgroundColor: Array(sumOfCarbs.length)
            .fill()
            .map((item, index) =>
              sumOfCarbs[index] > userData.carbs * 1.1 || sumOfCarbs[index] < userData.carbs * 0.9
                ? '#fecaca'
                : '#fde68a'
            )
          // backgroundColor: '#fde68a'
        },
        {
          label: 'Общая норма, гр.',
          type: 'line',
          borderColor: '#f59e0b',
          backgroundColor: '#ffffff',
          pointStyle: false,
          data: Array(sumOfCarbs.length)
            .fill()
            .map(() => userData.proteins + userData.carbs + userData.fats)
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
          backgroundColor: Array(sumOfProteins.length)
            .fill()
            .map((item, index) =>
              sumOfProteins[index] > userData.proteins * 1.1 ||
              sumOfProteins[index] < userData.proteins * 0.9
                ? '#f87171'
                : '#fbbf24'
            )
          // backgroundColor: '#fbbf24'
        },
        {
          label: 'Жиры, Ккал.',
          data: sumOfFats.map((item) => item * 9),
          backgroundColor: Array(sumOfFats.length)
            .fill()
            .map((item, index) =>
              sumOfFats[index] > userData.fats * 1.1 || sumOfFats[index] < userData.fats * 0.9
                ? '#fca5a5'
                : '#fcd34d'
            )
          // backgroundColor: '#fcd34d'
        },

        {
          label: 'Углеводы, Ккал.',
          data: sumOfCarbs.map((item) => item * 4),
          backgroundColor: Array(sumOfCarbs.length)
            .fill()
            .map((item, index) =>
              sumOfCarbs[index] > userData.carbs * 1.1 || sumOfCarbs[index] < userData.carbs * 0.9
                ? '#fecaca'
                : '#fde68a'
            )
          // backgroundColor: '#fde68a'
        },
        {
          label: 'Общая норма, Ккал.',
          type: 'line',
          borderColor: '#f59e0b',
          backgroundColor: '#ffffff',
          pointStyle: false,
          data: Array(sumOfCarbs.length).fill(userData.calories)
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
          fill: {
            target: { value: userData.optimalWeight }
          }
        },
        {
          label: 'Оптимальный вес, кг',
          pointStyle: false,
          data: Array(sumOfCurentWeights.length).fill(userData.optimalWeight),
          borderColor: '#fde68a',
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          cubicInterpolationMode: 'monotone'
        }
      ]
    },

    options: {
      spanGaps: true,
      scales: {
        y: {
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
  <div class="w-full px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div>
      <h2 class="text-lg text-slate-600 text-center">Потребление Ккал:</h2>
      <canvas id="calories" width="150" height="100"></canvas>
    </div>
    <div>
      <h2 class="text-lg text-slate-600 text-center">Потребление БЖУ:</h2>
      <canvas id="pfc" width="150" height="100"></canvas>
    </div>
    <div>
      <h2 class="text-lg text-slate-600 text-center">Распределение Ккал по БЖУ:</h2>
      <canvas id="distribution" width="150" height="100"></canvas>
    </div>
    <div>
      <h2 class="text-lg text-slate-600 text-center">Вес:</h2>
      <canvas id="weight" width="150" height="100"></canvas>
    </div>
  </div>
</template>
