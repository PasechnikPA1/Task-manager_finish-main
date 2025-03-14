<template>
  <q-page class="flex flex-column">
    <div class="projects-container">
      <div class="header">
        <h1 class="project-title">Идеи</h1>
        <q-btn
          color="primary"
          label="Создать идею"
          @click="showCreateDialog = true"
          class="q-mb-md"
        />
      </div>

      <!-- Поиск и фильтры -->
      <div class="search-and-filters q-mb-md">
        <q-input
          v-model="searchQuery"
          placeholder="Поиск по названию"
          outlined
          dense
          class="q-mb-md"
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <div class="filters">
          <q-chip
            v-for="filter in filters"
            :key="filter.label"
            :label="filter.label"
            :color="filter.active ? 'primary' : 'grey-5'"
            text-color="white"
            clickable
            @click="toggleFilter(filter)"
          />
        </div>
      </div>

      <!-- Список идей -->
      <div class="ideas-list">
        <q-card
          v-for="(idea, index) in filteredIdeas"
          :key="idea.id"
          class="q-mb-sm"
          flat
          bordered
          :style="{ borderRadius: '10px', border: '1px solid #ddd' }"
        >
          <q-card-section>
            <div class="flex justify-between items-center">
              <div>
                <div class="text-h6">#{{ index + 1 }} {{ idea.title }}</div>
              </div>
              <div class="flex items-center">
                <q-chip
                  :color="getStatusColor(idea.status)"
                  text-color="white"
                  size="sm"
                >
                  {{ idea.status }}
                </q-chip>
                <q-btn
                  color="primary"
                  label="Открыть"
                  @click="toggleIdeaDetails(idea.id)"
                  class="q-ml-sm"
                />
              </div>
            </div>
          </q-card-section>

          <!-- Подробная информация об идее -->
          <q-slide-transition>
            <div v-if="openedIdeas.includes(idea.id)">
              <q-separator />
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm">
                  <strong>Создал:</strong> {{ idea.createdBy }}
                </div>
                <div class="text-subtitle2 q-mb-sm">
                  <strong>Дата создания:</strong> {{ formatDate(idea.createdAt) }}
                </div>
                <div class="text-subtitle2 q-mb-sm">
                  <strong>Проблема:</strong> {{ idea.problem }}
                </div>
                <div class="text-subtitle2 q-mb-sm">
                  <strong>Решение:</strong> {{ idea.solution }}
                </div>
                <div class="text-subtitle2 q-mb-sm">
                  <strong>Ожидаемый результат:</strong> {{ idea.expectedResult }}
                </div>
                <div class="text-subtitle2 q-mb-sm">
                  <strong>Необходимые ресурсы:</strong> {{ idea.requiredResources }}
                </div>
                <div class="text-subtitle2">
                  <strong>Стек:</strong> {{ idea.stack }}
                </div>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
      </div>
    </div>

    <!-- Модальное окно для создания идеи -->
    <q-dialog v-model="showCreateDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Создать новую идею</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="createIdea">
            <q-input
              v-model="newIdea.title"
              label="Название идеи"
              class="q-mb-md"
              outlined
              required
            />
            <q-input
              v-model="newIdea.problem"
              label="Проблема"
              class="q-mb-md"
              outlined
              required
            />
            <q-input
              v-model="newIdea.solution"
              label="Решение"
              class="q-mb-md"
              outlined
              required
            />
            <q-input
              v-model="newIdea.expectedResult"
              label="Ожидаемый результат"
              class="q-mb-md"
              outlined
              required
            />
            <q-input
              v-model="newIdea.requiredResources"
              label="Необходимые ресурсы"
              class="q-mb-md"
              outlined
              required
            />
            <q-input
              v-model="newIdea.stack"
              label="Стек"
              class="q-mb-md"
              outlined
              required
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" v-close-popup />
          <q-btn type="submit" label="Создать" color="primary" @click="createIdea" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMainStore } from 'src/stores/main-store';
import { storeToRefs } from 'pinia';

// Типы
interface Filter {
  label: string;
  active: boolean;
}

interface Idea {
  id: number;
  title: string;
  createdBy: string; // Имя пользователя
  createdAt: string; // Дата создания
  problem: string;
  solution: string;
  expectedResult: string;
  requiredResources: string;
  stack: string;
  status: string;
}

// Хранилище
const mainStore = useMainStore();
const { firstname, lastname } = storeToRefs(mainStore);

// Поиск
const searchQuery = ref('');

// Фильтры
const filters = ref<Filter[]>([
  { label: 'Все категории', active: true },
  { label: 'Опубликована', active: false },
  { label: 'На согласовании', active: false },
]);

// Идеи (10 штук)
const ideas = ref<Idea[]>([
  {
    id: 1,
    title: 'Создание чат-бота для помощи больным',
    createdBy: 'Иван Иванов',
    createdAt: '2023-10-01',
    problem: 'Пациенты не получают своевременной помощи',
    solution: 'Разработка чат-бота для автоматизации ответов на вопросы пациентов',
    expectedResult: 'Уменьшение нагрузки на медперсонал',
    requiredResources: 'Разработчики, медицинские консультанты',
    stack: 'Python, TensorFlow, Flask',
    status: 'Опубликована',
  },
  {
    id: 2,
    title: 'Улучшение системы записи к врачу',
    createdBy: 'Петр Петров',
    createdAt: '2023-10-05',
    problem: 'Долгое время ожидания записи',
    solution: 'Разработка онлайн-платформы для записи к врачу',
    expectedResult: 'Ускорение процесса записи',
    requiredResources: 'Разработчики, дизайнеры',
    stack: 'Vue.js, NestJS, PostgreSQL',
    status: 'На согласовании',
  },
  // Остальные идеи...
]);

// Переключение фильтров
const toggleFilter = (filter: Filter) => {
  filters.value.forEach((f) => (f.active = f === filter));
};

// Фильтрация идей по статусу и поиску
const filteredIdeas = computed(() => {
  const activeFilter = filters.value.find((f) => f.active);
  let filtered = ideas.value;

  // Фильтрация по статусу
  if (activeFilter?.label !== 'Все категории') {
    filtered = filtered.filter((idea) => idea.status === activeFilter?.label);
  }

  // Фильтрация по поиску
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((idea) =>
      idea.title.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Цвет статуса
const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    'Опубликована': 'positive',
    'На согласовании': 'warning',
  };
  return statusColors[status] || 'grey';
};

// Логика для открытия/закрытия деталей идеи
const openedIdeas = ref<number[]>([]);

const toggleIdeaDetails = (ideaId: number) => {
  if (openedIdeas.value.includes(ideaId)) {
    openedIdeas.value = openedIdeas.value.filter((id) => id !== ideaId);
  } else {
    openedIdeas.value.push(ideaId);
  }
};

// Форматирование даты
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Логика для создания идеи
const showCreateDialog = ref(false);
const newIdea = ref<Idea>({
  id: 0,
  title: '',
  createdBy: `${firstname.value} ${lastname.value}`, // Используем имя авторизованного пользователя
  createdAt: new Date().toISOString().split('T')[0], // Текущая дата
  problem: '',
  solution: '',
  expectedResult: '',
  requiredResources: '',
  stack: '',
  status: 'На согласовании', // По умолчанию статус "На согласовании"
});

const createIdea = () => {
  // Генерация уникального ID (в реальном проекте это должно быть на стороне сервера)
  newIdea.value.id = ideas.value.length + 1;
  ideas.value.push({ ...newIdea.value });

  // Сброс формы
  newIdea.value = {
    id: 0,
    title: '',
    createdBy: `${firstname.value} ${lastname.value}`, // Используем имя авторизованного пользователя
    createdAt: new Date().toISOString().split('T')[0], // Текущая дата
    problem: '',
    solution: '',
    expectedResult: '',
    requiredResources: '',
    stack: '',
    status: 'На согласовании',
  };

  // Закрытие модального окна
  showCreateDialog.value = false;
};
</script>

<style scoped>
.projects-container {
  width: 80%;
  margin: 10px auto 0;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
}

.project-title {
  font-size: 40px;
  margin: 0;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  color: #333;
}

.search-and-filters {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filters {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.ideas-list {
  max-width: 60vw;
  margin: 0 auto;
  padding: 0;
}
</style>