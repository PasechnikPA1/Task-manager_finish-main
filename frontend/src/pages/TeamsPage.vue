<template>
  <q-page class="flex flex-column">
    <div class="projects-container">
      <div class="header">
        <h1 class="project-title">Команды</h1>
        <q-btn
          color="primary"
          label="Создать команду"
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

      <!-- Список команд -->
      <div class="teams-list">
        <q-card
          v-for="(team, index) in filteredTeams"
          :key="team.id"
          class="q-mb-sm"
          flat
          bordered
          :style="{ borderRadius: '10px', border: '1px solid #ddd' }"
        >
          <q-card-section>
            <div class="flex justify-between items-center">
              <div>
                <div class="text-h6">#{{ index + 1 }} {{ team.title }}</div>
              </div>
              <div class="flex items-center">
                <!-- Иконка с количеством участников (увеличена) -->
                <q-icon name="people" class="q-icon--large q-mr-sm" />
                <span class="q-mr-md text-h6">{{ team.membersCount }}</span>

                <!-- Статус приватности -->
                <q-chip
                  :color="team.isPrivate ? 'negative' : 'positive'"
                  text-color="white"
                  size="sm"
                >
                  {{ team.isPrivate ? 'Закрытая' : 'Открытая' }}
                </q-chip>

                <!-- Кнопка "Открыть" -->
                <q-btn
                  color="primary"
                  label="Открыть"
                  @click="toggleTeamDetails(team.id)"
                  class="q-ml-sm"
                />
              </div>
            </div>
          </q-card-section>

          <!-- Подробная информация о команде -->
          <q-slide-transition>
            <div v-if="openedTeams.includes(team.id)">
              <q-separator />
              <q-card-section>
                <div class="text-subtitle2 q-mb-sm">
                  <strong>Создал:</strong> {{ team.createdBy }}
                </div>
                <div class="text-subtitle2 q-mb-sm">
                  <strong>Дата создания:</strong> {{ formatDate(team.createdAt) }}
                </div>
                <div class="text-subtitle2 q-mb-sm">
                  <strong>Описание:</strong> {{ team.description }}
                </div>
                <div class="text-subtitle2 q-mb-sm">
                  <strong>Количество участников:</strong> {{ team.membersCount }}
                </div>
                <div class="text-subtitle2 q-mb-sm">
                  <strong>Приватность:</strong> {{ team.isPrivate ? 'Закрытая' : 'Открытая' }}
                </div>
                <div class="text-subtitle2">
                  <strong>Статус:</strong> {{ team.status }}
                </div>
              </q-card-section>
            </div>
          </q-slide-transition>
        </q-card>
      </div>
    </div>

    <!-- Модальное окно для создания команды -->
    <q-dialog v-model="showCreateDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Создать новую команду</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="createTeam">
            <q-input
              v-model="newTeam.title"
              label="Название команды"
              class="q-mb-md"
              outlined
              required
            />
            <q-input
              v-model="newTeam.description"
              label="Описание команды"
              type="textarea"
              class="q-mb-md"
              outlined
              required
            />
            <q-input
              v-model="newTeam.membersCount"
              label="Количество участников"
              type="number"
              class="q-mb-md"
              outlined
              required
            />
            <q-toggle
              v-model="newTeam.isPrivate"
              label="Приватная команда"
              class="q-mb-md"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" v-close-popup />
          <q-btn type="submit" label="Создать" color="primary" @click="createTeam" />
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

interface Team {
  id: number;
  title: string;
  description: string;
  createdBy: string; // Имя пользователя
  createdAt: string; // Дата создания
  membersCount: number;
  isPrivate: boolean; // Приватность команды
  status: string; // Статус команды
}

// Хранилище
const mainStore = useMainStore();
const { firstname, lastname } = storeToRefs(mainStore);

// Поиск
const searchQuery = ref('');

// Фильтры
const filters = ref<Filter[]>([
  { label: 'Все категории', active: true },
  { label: 'Открыта', active: false },
  { label: 'Закрыта', active: false },
]);

// Команды (пример данных)
const teams = ref<Team[]>([
  {
    id: 1,
    title: 'DreamTeam',
    description: 'Команда для разработки инновационных решений в области медицины.',
    createdBy: 'Иван Иванов',
    createdAt: '2023-10-01',
    membersCount: 3,
    isPrivate: false,
    status: 'Открыта',
  },
  {
    id: 2,
    title: 'Умники',
    description: 'Команда для разработки интеллектуальных систем и платформ.',
    createdBy: 'Петр Петров',
    createdAt: '2023-10-05',
    membersCount: 5,
    isPrivate: true,
    status: 'Закрыта',
  },
  // Остальные команды...
]);

// Переключение фильтров
const toggleFilter = (filter: Filter) => {
  filters.value.forEach((f) => (f.active = f === filter));
};

// Фильтрация команд по статусу и поиску
const filteredTeams = computed(() => {
  const activeFilter = filters.value.find((f) => f.active);
  let filtered = teams.value;

  // Фильтрация по статусу
  if (activeFilter?.label !== 'Все категории') {
    filtered = filtered.filter((team) => team.status === activeFilter?.label);
  }

  // Фильтрация по поиску
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((team) =>
      team.title.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Логика для открытия/закрытия деталей команды
const openedTeams = ref<number[]>([]);

const toggleTeamDetails = (teamId: number) => {
  if (openedTeams.value.includes(teamId)) {
    openedTeams.value = openedTeams.value.filter((id) => id !== teamId);
  } else {
    openedTeams.value.push(teamId);
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

// Логика для создания команды
const showCreateDialog = ref(false);
const newTeam = ref<Team>({
  id: 0,
  title: '',
  description: '',
  createdBy: `${firstname.value} ${lastname.value}`, // Используем имя авторизованного пользователя
  createdAt: new Date().toISOString().split('T')[0], // Текущая дата
  membersCount: 0,
  isPrivate: false, // По умолчанию команда открытая
  status: 'Открыта', // По умолчанию статус "Открыта"
});

const createTeam = () => {
  // Генерация уникального ID (в реальном проекте это должно быть на стороне сервера)
  newTeam.value.id = teams.value.length + 1;
  teams.value.push({ ...newTeam.value });

  // Сброс формы
  newTeam.value = {
    id: 0,
    title: '',
    description: '',
    createdBy: `${firstname.value} ${lastname.value}`, // Используем имя авторизованного пользователя
    createdAt: new Date().toISOString().split('T')[0], // Текущая дата
    membersCount: 0,
    isPrivate: false,
    status: 'Открыта',
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

.teams-list {
  max-width: 60vw;
  margin: 0 auto;
  padding: 0;
}

/* Увеличение размера иконки */
.q-icon--large {
  font-size: 24px; /* Размер иконки */
}
</style>