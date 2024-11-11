<template>
    <div v-if="visible"
    :class="[
        'p-4 rounded-md flex items-center justify-between',
        alertClasses[type] || alertClasses['info']
    ]">

    <div class="flex items-center space-x-2">
        <span v-if="icon" :class = "iconClasses[type] || iconClasses['info']">
            <i :class="icon"></i>
        </span>
        <span class="text-sm font-medium">{{ message }}</span>
    </div>
    <button
        v-if="dismissible"
        @click="closeAlert"
        class="ml-4 text-lg font-bold text-gray-500 hover:text-gray-700"
    >
      &times;
    </button>
    </div>
</template>

<script setup lang="ts">
import {ref,computed} from 'vue';


type AlertType = 'success' | 'error' | 'warning' | 'info'; 

defineProps<{
  type: AlertType;
  icon?: string;
  message: string;
  dismissible?: boolean;
}>();

const visible = ref(true);

const alertClasses = computed(() => ({
  success: 'bg-green-100 text-green-800 border border-green-300',
  error: 'bg-red-100 text-red-800 border border-red-300',
  warning: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  info: 'bg-blue-100 text-blue-800 border border-blue-300',
}));

const iconClasses = computed(() => ({
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
}));

const closeAlert = () => {
  visible.value = false;
};

</script>
