<template>
  <div class="ranking-container">
    <div class="mb-8 text-center">
      <h2 class="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
        {{ t?.ranking?.title || '' }}
      </h2>
      <p class="text-lg text-gray-600 mb-2">{{ t?.ranking?.subtitle || '' }}</p>
      <p class="text-sm text-gray-500">{{ t?.ranking?.instructions || '' }}</p>
    </div>

    <!-- Desktop: Draggable List -->
    <div v-if="items.length > 0 && !isMobile" class="space-y-4">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="card flex items-center gap-4 cursor-move hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-2 border-transparent hover:border-primary-200"
        draggable="true"
        @dragstart="handleDragStart($event, index)"
        @dragover.prevent="handleDragOver($event, index)"
        @drop="handleDrop($event, index)"
        @dragend="handleDragEnd"
      >
        <div class="drag-handle flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
          </svg>
        </div>
        <div class="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
          {{ index + 1 }}
        </div>
        <div class="flex-shrink-0">
          <OptionIcon :icon-type="getIconType(item.key)" size="md" />
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-lg mb-1 text-gray-900">{{ item?.title || 'No title' }}</h3>
          <p class="text-gray-600 text-sm leading-relaxed">{{ item?.description || 'No description' }}</p>
        </div>
      </div>
    </div>

    <!-- Mobile: Click to Select Priority -->
    <div v-else-if="items.length > 0 && isMobile" class="space-y-4">
      <div
        v-for="(item, index) in items"
        :key="item?.id || index"
        class="card active:scale-95 transition-transform"
        @click="selectPriority(item)"
      >
        <div class="flex items-center gap-4">
          <div class="flex-shrink-0">
            <OptionIcon :icon-type="getIconType(item.key)" size="sm" />
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-lg mb-1 text-gray-900">{{ item?.title || '' }}</h3>
            <p class="text-gray-600 text-sm leading-relaxed">{{ item?.description || '' }}</p>
          </div>
          <div
            v-if="item?.priority"
            class="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center font-bold text-lg shadow-md"
          >
            {{ item.priority }}
          </div>
        </div>
      </div>
      
      <!-- Priority Selector Modal (Mobile) -->
      <div
        v-if="selectedItem"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-xl p-6 max-w-sm w-full">
          <h3 class="text-xl font-bold mb-4">{{ t?.ranking?.instructions || 'Select Priority' }}</h3>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="num in 6"
              :key="num"
              class="w-12 h-12 rounded-lg border-2 font-bold transition-colors"
              :class="selectedItem.priority === num 
                ? 'bg-primary-600 text-white border-primary-600' 
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'"
              @click="setPriority(num)"
            >
              {{ num }}
            </button>
          </div>
          <button
            class="mt-4 w-full btn-primary"
            @click="closeModal"
          >
            {{ t?.ranking?.confirm || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Show loading state if no items -->
    <div v-if="items.length === 0" class="text-center py-12">
      <p class="text-gray-500">Loading options...</p>
    </div>

    <div v-if="items.length > 0" class="mt-8 flex gap-4 justify-center">
      <button class="btn-primary" @click="confirmRanking">
        {{ t?.ranking?.confirm || 'Confirm' }}
      </button>
      <button class="btn-secondary" @click="resetRanking">
        {{ t?.ranking?.reset || 'Reset' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import OptionIcon from './OptionIcon.vue';

interface RankingOption {
  id: string;
  key: string;
  title: string;
  description: string;
  priority?: number;
}

interface Props {
  options: RankingOption[] | string;
  translations: any | string;
  currentLang?: string;
}

const props = defineProps<Props>();

// Parse props if they are strings (from Astro JSON.stringify)
const parsedOptions = computed(() => {
  let result: any[] = [];
  
  if (typeof props.options === 'string') {
    try {
      const parsed = JSON.parse(props.options);
      result = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to parse options:', e);
      return [];
    }
  } else if (Array.isArray(props.options)) {
    result = props.options;
  }
  
  // Validate and clean the options - ensure all required fields exist
  const cleaned = result.filter((item: any) => {
    return item && 
           typeof item === 'object' && 
           item.id !== undefined && 
           item.key !== undefined && 
           item.title !== undefined;
  }).map((item: any) => ({
    id: String(item.id || ''),
    key: String(item.key || ''),
    title: String(item.title || ''),
    description: String(item.description || ''),
    priority: item.priority
  }));
  
  return cleaned;
});

const parsedTranslations = computed(() => {
  if (typeof props.translations === 'string') {
    try {
      return JSON.parse(props.translations);
    } catch (e) {
      console.error('Failed to parse translations:', e);
      return {};
    }
  }
  return props.translations || {};
});
const emit = defineEmits<{
  (e: 'confirm', ranking: string[]): void;
}>();

const t = computed(() => {
  const translations = parsedTranslations.value;
  // Ensure ranking object exists
  if (!translations.ranking) {
    return {
      ranking: {
        title: '',
        subtitle: '',
        instructions: '',
        confirm: 'Confirm',
        reset: 'Reset',
        options: {}
      }
    };
  }
  return translations;
});
const selectedItem = ref<RankingOption | null>(null);

// Initialize items from parsed options
const items = ref<RankingOption[]>([]);

// Detect mobile - initialize as false for SSR, will be set in onMounted
const isMobile = ref(false);
const draggedIndex = ref<number | null>(null);

// Watch for parsed options changes and initialize items
watch(parsedOptions, (newOptions) => {
  if (Array.isArray(newOptions) && newOptions.length > 0) {
    items.value = newOptions.map(item => ({ ...item }));
  }
}, { immediate: true });

onMounted(() => {
  // Initialize items from parsed options
  const opts = parsedOptions.value;
  
  if (Array.isArray(opts) && opts.length > 0) {
    items.value = opts.map(item => ({ ...item }));
  }
  
  // Set mobile detection after mount
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 640;
    window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth < 640;
    });
  }
});

function selectPriority(item: RankingOption) {
  selectedItem.value = item;
}

function setPriority(priority: number) {
  if (selectedItem.value) {
    // Remove priority from other items if already set
    items.value.forEach(item => {
      if (item.priority === priority && item.id !== selectedItem.value!.id) {
        item.priority = undefined;
      }
    });
    selectedItem.value.priority = priority;
    selectedItem.value = null;
    
    // Sort items by priority
    items.value.sort((a, b) => {
      const aPriority = a.priority ?? 999;
      const bPriority = b.priority ?? 999;
      return aPriority - bPriority;
    });
  }
}

function closeModal() {
  selectedItem.value = null;
}

function confirmRanking() {
  // For mobile, check if all items have priority
  if (isMobile.value) {
    const allHavePriority = items.value.every(item => item.priority !== undefined);
    if (!allHavePriority) {
      alert(t.value?.ranking?.completeAll || 'Please assign priority to all options first.');
      return;
    }
    // Sort by priority before saving
    const sorted = [...items.value].sort((a, b) => {
      const aPriority = a.priority ?? 999;
      const bPriority = b.priority ?? 999;
      return aPriority - bPriority;
    });
    const ranking = sorted.map(item => item.key);
    // Store ranking and navigate to scenario page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ranking', JSON.stringify(ranking));
      const lang = props.currentLang || 'en';
      window.location.href = `/${lang}/scenario`;
    }
    emit('confirm', ranking);
  } else {
    // Desktop: use current order
    const ranking = items.value.map(item => item.key);
    // Store ranking and navigate to scenario page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ranking', JSON.stringify(ranking));
      const lang = props.currentLang || 'en';
      window.location.href = `/${lang}/scenario`;
    }
    emit('confirm', ranking);
  }
}

function resetRanking() {
  const opts = parsedOptions.value;
  if (Array.isArray(opts) && opts.length > 0) {
    items.value = [...opts];
    items.value.forEach(item => {
      item.priority = undefined;
    });
  }
}

// Native drag and drop handlers
function handleDragStart(event: DragEvent, index: number) {
  draggedIndex.value = index;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', String(index));
  }
  (event.target as HTMLElement).style.opacity = '0.5';
}

function handleDragOver(event: DragEvent, index: number) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
  const target = event.currentTarget as HTMLElement;
  if (target && draggedIndex.value !== null && draggedIndex.value !== index) {
    target.style.borderTop = '2px solid #6366f1';
  }
}

function handleDrop(event: DragEvent, dropIndex: number) {
  event.preventDefault();
  const target = event.currentTarget as HTMLElement;
  if (target) {
    target.style.borderTop = '';
  }
  
  if (draggedIndex.value !== null && draggedIndex.value !== dropIndex) {
    const newItems = [...items.value];
    const draggedItem = newItems[draggedIndex.value];
    newItems.splice(draggedIndex.value, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    items.value = newItems;
  }
  draggedIndex.value = null;
}

function handleDragEnd(event: DragEvent) {
  const target = event.target as HTMLElement;
  if (target) {
    target.style.opacity = '1';
    target.style.borderTop = '';
  }
  draggedIndex.value = null;
}

function getIconType(key: string): 'dna' | 'organ' | 'current-organ' | 'characteristics' | 'expression' | 'identity' {
  const iconMap: Record<string, 'dna' | 'organ' | 'current-organ' | 'characteristics' | 'expression' | 'identity'> = {
    'a': 'dna',
    'b': 'organ',
    'c': 'current-organ',
    'd': 'characteristics',
    'e': 'expression',
    'f': 'identity'
  };
  return iconMap[key] || 'dna';
}
</script>

