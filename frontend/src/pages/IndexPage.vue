<template>
  <q-page class="flex flex-column">
    <div class="projects-container">
      <div class="header">
        <h1 class="project-title">Проекты</h1>
        <!-- Кнопка создания проекта (отображается только для админов, администрации ВШЦТ и заказчиков) -->
        <q-btn
          v-if="mainStore.canCreateProject()"
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
          :key="project.id"
        >
          <div @click="openProjectDetails(project)">
            <h2 class="project-heading"><strong>{{ project.name }}</strong></h2>
            <p class="project-description">{{ project.solution }}</p>

            <!-- Инициатор с иконкой -->
            <div class="project-initiator">
              <q-icon name="person" class="q-mr-sm" />
              <strong>Заказчик:</strong> {{ project.customer }}
            </div>

            <!-- Статус проекта (команда и заявки) -->
            <div class="project-status">
              <div class="status-item">
                <q-icon name="people" class="q-mr-sm" />
                <span>Команда до {{ project.maxUsers }} человек</span>
              </div>
            </div>

            <!-- Технологии -->
            <div class="technologies">
              <span
                v-for="tech in project.stack.split(', ')"
                :key="tech"
                :class="getTechClass(tech)"
                class="tech-tag"
              >
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Кнопка удаления проекта (отображается только для админов, администрации ВШЦТ и заказчиков) -->
          <q-btn
            v-if="mainStore.canDeleteProject()"
            flat
            color="negative"
            icon="delete"
            @click.stop="confirmDelete(project.id)"
            class="delete-btn"
          />
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
            <h2 class="project-heading"><strong>{{ selectedProject.name }}</strong></h2>
            <p class="project-description">{{ selectedProject.solution }}</p>

            <div class="project-initiator">
              <q-icon name="person" class="q-mr-sm" />
              <strong>Заказчик:</strong> {{ selectedProject.customer }}
            </div>

            <div class="project-status">
              <div class="status-item">
                <q-icon name="people" class="q-mr-sm" />
                <span>Команда до {{ selectedProject.maxUsers }} человек</span>
              </div>
            </div>

            <div class="technologies">
              <span
                v-for="tech in selectedProject.stack.split(', ')"
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

      <!-- Диалог подтверждения удаления -->
      <q-dialog v-model="confirmDeleteDialog">
        <q-card>
          <q-card-section>
            <h6>Вы уверены, что хотите удалить проект?</h6>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Отмена" color="primary" v-close-popup />
            <q-btn
              flat
              label="Удалить"
              color="negative"
              @click="handleDelete"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <!-- Диалог создания проекта -->
    <CreateProjectDialog ref="createProjectDialog" @create="addProject" />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getAll, remove } from 'src/api/project.api';
import { useMainStore } from 'src/stores/main-store';
import CreateProjectDialog from './CreateProjectDialog.vue';

interface Project {
  id: number;
  name: string;
  solution: string;
  stack: string;
  maxUsers: string;
  customer: string;
}

// Данные проектов
const projects = ref<Project[]>([]);

// Хранилище
const mainStore = useMainStore();

// Загрузка проектов из базы данных
const loadProjects = async () => {
  try {
    const data = await getAll(); // Загружаем проекты из API
    if (data) {
      projects.value = data.map((project) => ({
        id: project.id,
        name: project.name,
        solution: project.solution,
        stack: project.stack.join(', '), // Преобразуем массив в строку
        maxUsers: project.maxUsers,
        customer: project.customer,
      }));
    }
  } catch (error) {
    console.error('Ошибка при загрузке проектов:', error);
  }
};

// Загружаем проекты при монтировании компонента
onMounted(() => {
  loadProjects();
});

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
  const programmingLanguages = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Node.js'];
  const databases = ['PostgreSQL', 'PostgeSQL', 'MySQL']; // Добавили PostgeSQL
  const tools = ['Git', 'Docker'];

  // Убираем лишние пробелы
  const trimmedTech = tech.trim();

  if (programmingLanguages.includes(trimmedTech)) {
    return 'tech-green'; // Языки программирования
  } else if (databases.includes(trimmedTech)) {
    return 'tech-orange'; // Базы данных
  } else if (tools.includes(trimmedTech)) {
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
  projects.value.push(newProject); // Добавляем новый проект в список
};

// Логика для удаления проекта
const confirmDeleteDialog = ref(false);
const projectIdToDelete = ref<number | null>(null);

const confirmDelete = (id: number) => {
  projectIdToDelete.value = id;
  confirmDeleteDialog.value = true;
};

const handleDelete = () => {
  if (projectIdToDelete.value !== null) {
    deleteProject(projectIdToDelete.value);
  }
};

const deleteProject = async (id: number) => {
  try {
    const deletedProject = await remove(id); // Вызываем API для удаления проекта
    if (deletedProject) {
      // Удаляем проект из списка, создавая новый массив
      projects.value = projects.value.filter((project) => project.id !== id);

      // Если на текущей странице больше нет проектов, переходим на предыдущую страницу
      if (paginatedProjects.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1;
      }
    }
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
  }
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
  position: relative;
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

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>