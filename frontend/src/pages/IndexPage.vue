<template>
  <q-page class="flex flex-column">
    <div class="projects-container">
      <div class="header">
        <h1 class="project-title">Проекты</h1>
        <q-btn
          label="Создать проект"
          color="primary"
          @click="openCreateProjectDialog"
          class="q-mb-md"
        />
      </div>

      <!-- Список проектов -->
      <div class="projects-grid">
        <div
          class="project-card"
          v-for="project in paginatedProjects"
          :key="project.title"
          @click="openProjectDetails(project)"
        >
          <h2 class="project-heading"><strong>{{ project.title.replace(/^#\d+\s*/, '') }}</strong></h2>
          <p class="project-description">{{ project.description }}</p>

          <!-- Инициатор с иконкой -->
          <div class="project-initiator">
            <q-icon name="person" class="q-mr-sm" />
            <strong>Инициатор:</strong> {{ project.initiator }}
          </div>

          <!-- Статус проекта (команда и заявки) -->
          <div class="project-status">
            <div class="status-item">
              <q-icon name="people" class="q-mr-sm" />
              <span>Команда до {{ project.teamSize }} человек</span>
            </div>
            <div class="status-item">
              <q-icon name="mail" class="q-mr-sm" />
              <span>Подано заявок: {{ project.applicationsCount }}</span>
            </div>
          </div>

          <!-- Технологии -->
          <div class="technologies">
            <span
              v-for="tech in project.technologies"
              :key="tech"
              :class="getTechClass(tech)"
              class="tech-tag"
            >
              {{ tech }}
            </span>
          </div>
        </div>
      </div>

      <!-- Пагинация -->
      <q-pagination
        v-model="currentPage"
        :max="totalPages"
        :input="true"
        class="q-mt-md"
      />

      <!-- Пустое состояние -->
      <div v-if="projects.length === 0" class="empty-state">
        <q-icon name="info" size="xl" />
        <p>Нет проектов.</p>
      </div>

      <!-- Диалог с деталями проекта -->
      <q-dialog v-model="showProjectDetails">
        <q-card v-if="selectedProject" class="project-details-card">
          <q-card-section>
            <h2 class="project-heading"><strong>{{ selectedProject.title.replace(/^#\d+\s*/, '') }}</strong></h2>
            <p class="project-description">{{ selectedProject.description }}</p>

            <div class="project-initiator">
              <q-icon name="person" class="q-mr-sm" />
              <strong>Инициатор:</strong> {{ selectedProject.initiator }}
            </div>

            <div class="project-status">
              <div class="status-item">
                <q-icon name="people" class="q-mr-sm" />
                <span>Команда до {{ selectedProject.teamSize }} человек</span>
              </div>
              <div class="status-item">
                <q-icon name="mail" class="q-mr-sm" />
                <span>Подано заявок: {{ selectedProject.applicationsCount }}</span>
              </div>
            </div>

            <div class="technologies">
              <span
                v-for="tech in selectedProject.technologies"
                :key="tech"
                :class="getTechClass(tech)"
                class="tech-tag"
              >
                {{ tech }}
              </span>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Закрыть" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Диалог для создания проекта -->
      <CreateProjectDialog ref="createProjectDialog" @create="addProject" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CreateProjectDialog from './CreateProjectDialog.vue';

interface Project {
  title: string;
  description: string;
  initiator: string;
  technologies: string[];
  teamSize: number;
  applicationsCount: number;
}

const projects = ref<Project[]>([
  {
    title: '#1 Создание сайта для проведения конкурса "Педагог года"',
    description: 'Разработка веб-приложения для создания анкет преподавателей и проведения голосования за них',
    initiator: 'Екатерина Сердюкова',
    technologies: ['C#', '.NET 6.0', 'SQLite', 'Git', 'Docker'],
    teamSize: 7,
    applicationsCount: 2,
  },
  {
    title: '#3 тест 25.06',
    description: 'Вопрос: SpringBoot, FireBase, Elasticsearch',
    initiator: 'Екатерина Сердюкова',
    technologies: ['PostgreSQL', 'Docker', 'Git'],
    teamSize: 7,
    applicationsCount: 1,
  },
  {
    title: '#5 Виртуальный консультант студента (ДЛЯ 3 КУРСА)!!!',
    description: 'Создать цифровой справочник, var-бот агент.',
    initiator: 'Екатерина Сердюкова',
    technologies: ['PostgreSQL', 'Docker', 'Git'],
    teamSize: 5,
    applicationsCount: 0,
  },
  {
    title: '#2 Создание кабинета студента/преподавателя',
    description: 'Создание портала, где студенты и преподаватели смогут зарегистрироваться и вести учет посещаемости, оценок, расписания и других элементов учебного процесса.',
    initiator: 'Екатерина Сердюкова',
    technologies: ['PostgreSQL', 'Docker', 'Git'],
    teamSize: 7,
    applicationsCount: 1,
  },
  {
    title: '#4 Веб приложение "Лига тенниса" (для 3 курса!!!)',
    description: 'Создать многоплатформенное мобильное/веб приложение, которое реализует функционал: регистрация, просмотр событий лиги, турниры, матчи, рейтинги игроков, результаты матчей, календарь событий.',
    initiator: 'Екатерина Сердюкова',
    technologies: ['C++', '.NET 6.0', 'MySQL', 'Docker'],
    teamSize: 7,
    applicationsCount: 1,
  },
]);

// Пагинация
const itemsPerPage = 4;
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(projects.value.length / itemsPerPage));
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return projects.value.slice(start, end);
});

// Функция для определения класса технологии
const getTechClass = (tech: string) => {
  const programmingLanguages = ['C#', 'C++', 'Python', 'Javascript', 'SpringBoot', '.NET 6.0'];
  const databases = ['SQLite', 'PostgreSQL', 'MySQL', 'FireBase', 'Elasticsearch'];
  const tools = ['Git', 'Docker'];

  if (programmingLanguages.includes(tech)) {
    return 'tech-green'; // Языки программирования
  } else if (databases.includes(tech)) {
    return 'tech-orange'; // Базы данных
  } else if (tools.includes(tech)) {
    return 'tech-red'; // Инструменты (Git, Docker)
  }
  return ''; // По умолчанию
};

// Открытие деталей проекта
const showProjectDetails = ref(false);
const selectedProject = ref<Project | null>(null);

const openProjectDetails = (project: Project) => {
  selectedProject.value = project;
  showProjectDetails.value = true;
};

// Логика для создания проекта
const createProjectDialog = ref();

const openCreateProjectDialog = () => {
  createProjectDialog.value.openDialog();
};

const addProject = (newProject: Project) => {
  projects.value.push(newProject);
};
</script>

<style scoped>
.projects-container {
  width: 80%;
  margin: 20px auto 0;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}

.project-title {
  font-size: 60px;
  margin: 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}

.project-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.project-heading {
  font-size: 24px;
  margin-top: 0;
  margin-bottom: 8px;
}

.project-heading strong {
  font-weight: bold;
}

.project-description {
  margin: 8px 0;
}

.project-initiator {
  margin: 8px 0;
  display: flex;
  align-items: center;
  font-weight: bold;
}

.project-status {
  margin-top: 10px;
  display: flex;
  gap: 20px;
}

.status-item {
  display: flex;
  align-items: center;
}

.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
}

.tech-tag {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.tech-green {
  background-color: #66bb6a;
}

.tech-orange {
  background-color: #ffa726;
}

.tech-red {
  background-color: #ef5350;
}

.empty-state {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.project-details-card {
  width: 600px;
  max-width: 90%;
}
</style>