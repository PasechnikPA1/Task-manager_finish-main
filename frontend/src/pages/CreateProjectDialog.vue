<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="create-project-dialog">
      <q-card-section>
        <div class="text-h6">Создать новый проект</div>
      </q-card-section>

      <q-card-section>
        <!-- Форма для ввода данных -->
        <q-form @submit="onSubmit">
          <!-- Название проекта -->
          <q-input
            v-model="newProject.name"
            label="Название проекта"
            :rules="[(val) => !!val || 'Поле обязательно']"
          />

          <!-- Проблема -->
          <q-input
            v-model="newProject.problem"
            label="Проблема"
            :rules="[(val) => !!val || 'Поле обязательно']"
          />

          <!-- Решение -->
          <q-input
            v-model="newProject.solution"
            label="Решение"
            :rules="[(val) => !!val || 'Поле обязательно']"
          />

          <!-- Результат -->
          <q-input
            v-model="newProject.result"
            label="Результат"
            :rules="[(val) => !!val || 'Поле обязательно']"
          />

          <!-- Ресурсы -->
          <q-input
            v-model="newProject.resource"
            label="Ресурсы"
            :rules="[(val) => !!val || 'Поле обязательно']"
          />

          <!-- Стек технологий -->
          <q-select
            v-model="newProject.stack"
            label="Стек технологий"
            :options="competenceOptions"
            multiple
            use-chips
            :rules="[(val) => val.length > 0 || 'Выберите хотя бы одну технологию']"
          />

          <!-- Статус проекта -->
          <q-select
            v-model="newProject.status"
            label="Статус проекта"
            :options="statusOptions"
            :rules="[(val) => !!val || 'Поле обязательно']"
          />

          <!-- Дата начала проекта -->
          <q-input
            v-model="startProjectString"
            label="Дата начала проекта"
            type="date"
            :rules="[(val) => !!val || 'Поле обязательно']"
          />

          <!-- Дата окончания проекта -->
          <q-input
            v-model="stopProjectString"
            label="Дата окончания проекта"
            type="date"
            :rules="[(val) => !!val || 'Поле обязательно']"
          />

          <!-- Максимальное количество участников -->
          <q-input
            v-model="newProject.maxUsers"
            label="Максимальное количество участников"
            type="text"
            :rules="[(val) => !!val || 'Поле обязательно']"
          />

          <!-- Заказчик -->
          <q-input
            v-model="newProject.customer"
            label="Заказчик"
            :rules="[(val) => !!val || 'Поле обязательно']"
          />

          <!-- Кнопки -->
          <q-card-actions align="right">
            <q-btn flat label="Отмена" color="negative" v-close-popup />
            <q-btn type="submit" label="Создать" color="primary" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Competence, CreateProjectDto, StatusProject } from '../../../backend/src/common/types';
import { create } from 'src/api/project.api'; // Импортируем метод для создания проекта
import { useMainStore } from 'src/stores/main-store'; // Импортируем хранилище

// Пропсы и эмиты
const emit = defineEmits(['create']);

// Состояние диалога
const showDialog = ref(false);

// Хранилище
const mainStore = useMainStore();

// Данные нового проекта
const newProject = ref<CreateProjectDto>({
  name: '',
  problem: '',
  solution: '',
  result: '', // Добавлено поле "Результат"
  resource: '',
  stack: [],
  status: StatusProject.searchTeam, // Статус проекта
  startProject: new Date(), // Дата начала проекта (тип Date)
  stopProject: new Date(), // Дата окончания проекта (тип Date)
  maxUsers: '1', // По умолчанию строка '1'
  customer: '',
  initiator: mainStore.userId, // Используем ID залогиненного пользователя
});

// Строковые представления дат для v-model
const startProjectString = computed({
  get: () => newProject.value.startProject.toISOString().split('T')[0],
  set: (value) => {
    newProject.value.startProject = new Date(value);
  },
});

const stopProjectString = computed({
  get: () => newProject.value.stopProject.toISOString().split('T')[0],
  set: (value) => {
    newProject.value.stopProject = new Date(value);
  },
});

// Опции для стека технологий
const competenceOptions = Object.values(Competence);

// Опции для статуса проекта
const statusOptions = Object.values(StatusProject);

// Открытие диалога
const openDialog = () => {
  showDialog.value = true;
};

// Закрытие диалога
const closeDialog = () => {
  showDialog.value = false;
};

// Отправка формы
const onSubmit = async () => {
  try {
    // Проверяем, что все обязательные поля заполнены
    if (
      !newProject.value.name ||
      !newProject.value.problem ||
      !newProject.value.solution ||
      !newProject.value.result ||
      !newProject.value.resource ||
      newProject.value.stack.length === 0 ||
      !newProject.value.maxUsers ||
      !newProject.value.customer ||
      !newProject.value.status
    ) {
      console.error('Заполните все обязательные поля');
      return;
    }

    // Отправляем данные на сервер
    const projectData: CreateProjectDto = {
      ...newProject.value,
    };

    const createdProject = await create(projectData);
    if (createdProject) {
      // Оповещаем родительский компонент о создании проекта
      emit('create', createdProject);
      closeDialog(); // Закрываем диалог после успешного создания
    }
  } catch (error) {
    console.error('Ошибка при создании проекта:', error);
  }
};

// Экспортируем методы для использования в родительском компоненте
defineExpose({
  openDialog,
  closeDialog,
});
</script>

<style scoped>
.create-project-dialog {
  width: 500px;
  max-width: 90%;
}
</style>