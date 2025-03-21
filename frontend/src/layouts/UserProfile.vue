Рауш Кирилл, [21.03.2025 13:37]
<!-- eslint-disable vue/valid-v-on -->
<template>
  <!-- Модальное окно с профилем пользователя -->
  <q-dialog v-model="isOpen" class = "custom dialog">
    <q-card class="profile-card">
      <!-- Заголовок профиля -->
      <q-card-section class="bg-primary text-white text-center">
        <div class="text-h6">Профиль пользователя</div>
      </q-card-section>

      <!-- Поля ввода данных пользователя -->
      <q-card-section class="q-gutter-md">
        <q-input
          v-model="user.firstname"
          label="Имя"
          :readonly="!isEditing"
          outlined
          class="custom-input"
          bg-color="white"
          label-color="primary"
          stack-label
        >
          <template v-slot:prepend>
            <q-icon name="person" color="primary" />
          </template>
        </q-input>

        <q-input
          v-model="user.lastname"
          label="Фамилия"
          :readonly="!isEditing"
          outlined
          class="custom-input"
          bg-color="white"
          label-color="primary"
          stack-label
        >
          <template v-slot:prepend>
            <q-icon name="person_outline" color="primary" />
          </template>
        </q-input>

        <!-- Поле для отображения ролей -->
        <q-input
          :model-value="formattedRoles.join(', ')"
          label="Роли"
          readonly
          outlined
          class="custom-input"
          bg-color="white"
          label-color="primary"
          stack-label
        >
          <template v-slot:prepend>
            <q-icon name="assignment_ind" color="primary" />
          </template>
        </q-input>

        <q-input
          v-model="user.group"
          label="Группа"
          :readonly="!isEditing"
          outlined
          class="custom-input"
          bg-color="white"
          label-color="primary"
          stack-label
        >
          <template v-slot:prepend>
            <q-icon name="groups" color="primary" />
          </template>
        </q-input>

        <q-input
          v-model="user.telephone"
          label="Телефон"
          :readonly="!isEditing"
          outlined
          class="custom-input"
          bg-color="white"
          label-color="primary"
          stack-label
        >
          <template v-slot:prepend>
            <q-icon name="phone" color="primary" />
          </template>
        </q-input>

        <q-input
          v-model="user.competence"
          label="Компетенции"
          :readonly="!isEditing"
          outlined
          class="custom-input"
          bg-color="white"
          label-color="primary"
          stack-label
        >
          <template v-slot:prepend>
            <q-icon name="star" color="primary" />
          </template>
        </q-input>

        <q-input
          v-model="user.teams"
          label="Команды"
          :readonly="!isEditing"
          outlined
          class="custom-input"
          bg-color="white"
          label-color="primary"
          stack-label
        >
          <template v-slot:prepend>
            <q-icon name="people" color="primary" />
          </template>
        </q-input>
      </q-card-section>

      <!-- Кнопки действий -->
      <q-card-actions align="center" class="q-pa-md">
        <q-btn
          v-if="!isEditing"
          label="Назад"
          @click="closeProfile"
          color="grey"
          class="q-mr-sm"
        />
        <q-btn
          v-if="!isEditing"
          label="Изменить"
          @click="startEditing"
          color="primary"
        />
        <template v-else>
          <q-btn
            label="Сохранить"
            @click="saveChanges"
            color="positive"
            class="q-mr-sm"
          />
          <q-btn
            label="Отмена"
            @click="cancelEditing"
            color="negative"
          />
        </template>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

Рауш Кирилл, [21.03.2025 13:37]
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMainStore } from 'src/stores/main-store';
import { storeToRefs } from 'pinia';

// Определяем пропс для ролей
const props = defineProps({
  roles: {
    type: Array as () => string[],
    required: true,
  },
});

const mainStore = useMainStore();
const { firstname, lastname } = storeToRefs(mainStore);

const isOpen = ref(false);
const isEditing = ref(false);

// Сохраним исходные значения для отмены изменений
const originalUser = ref({
  firstname: '',
  lastname: '',
  group: '',
  telephone: '',
  competence: '',
  teams: '',
});

// Форматируем роли для отображения
const formattedRoles = computed(() => {
  return props.roles;
});

const user = computed({
  get() {
    if (isEditing.value) {
      return originalUser.value;
    } else {
      return {
        firstname: firstname.value,
        lastname: lastname.value,
        group: originalUser.value.group,
        telephone: originalUser.value.telephone,
        competence: originalUser.value.competence,
        teams: originalUser.value.teams,
      };
    }
  },
  set(newValue) {
    originalUser.value = newValue;
  },
});

const startEditing = () => {
  originalUser.value = {
    firstname: user.value.firstname,
    lastname: user.value.lastname,
    group: user.value.group,
    telephone: user.value.telephone,
    competence: user.value.competence,
    teams: user.value.teams,
  };
  isEditing.value = true;
};

const saveChanges = async () => {
  try {
    // Логика сохранения изменений
    isEditing.value = false;
  } catch (error) {
    console.error('Ошибка при сохранении изменений:', error);
  }
};

const cancelEditing = () => {
  isEditing.value = false;
};

// Функция для закрытия профиля
const closeProfile = () => {
  isOpen.value = false;
};

defineExpose({
  open: () => (isOpen.value = true),
});
</script>

<style scoped>
.profile-card {
  position: absolute; /* Устанавливаем абсолютное позиционирование */
  top: 50px;            /* Устанавливаем верхнее положение */
  left: 0;           /* Устанавливаем левое положение */
  width: 100%;       /* Ширина карточки */
  max-width: 500px;  /* Максимальная ширина карточки */
  margin: 0;         /* Убираем отступы */
}

.q-dialog__inner {
  margin: 0;         /* Убираем отступы у диалога */
}

.q-card-section {
  padding: 16px;
}

.custom-input {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-input .q-field__control {
  border-radius: 8px;
}

.custom-input .q-field__native {
  padding: 10px;
}

.custom-input .q-field__label {
  font-weight: bold;
}

@media (max-width: 600px) {
  .profile-card {
    width: 90%;
  }

  .q-card-section {
    padding: 8px;
  }
}
</style>