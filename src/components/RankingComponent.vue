<template>
  <div class="ranking-container">
    <div class="mb-6 text-center">
      <h2 class="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
        {{ t?.ranking?.title || '' }}
      </h2>
      <p class="text-lg text-gray-600 mb-2">{{ t?.ranking?.subtitle || '' }}</p>
      <p class="text-sm text-gray-500">{{ t?.ranking?.instructions || '' }}</p>
    </div>

    <!-- Desktop: Fixed slots with draggable content -->
    <div v-if="items.length > 0 && !isMobile" class="space-y-2">
      <div
        v-for="(slot, slotIndex) in 6"
        :key="slotIndex"
        class="flex items-center gap-3 py-2"
        :class="{
          'bg-primary-50 rounded-lg': dragOverSlot === slotIndex,
        }"
        @dragover.prevent="handleSlotDragOver($event, slotIndex)"
        @drop.prevent="handleSlotDrop($event, slotIndex)"
        @dragleave="handleSlotDragLeave"
      >
        <!-- Fixed slot number -->
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
          {{ slotIndex + 1 }}
        </div>
        
        <!-- Draggable content area -->
        <div
          v-if="getItemInSlot(slotIndex)"
          class="flex-1 flex items-center gap-3 cursor-move hover:bg-gray-50 transition-colors rounded-lg px-3 py-2 border border-gray-200 bg-white"
          draggable="true"
          @dragstart="handleContentDragStart($event, slotIndex)"
          @dragend="handleContentDragEnd"
        >
          <div class="drag-handle flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
          </div>
          <div class="flex-shrink-0">
            <OptionIcon :icon-type="getIconType(getItemInSlot(slotIndex)!.key)" size="sm" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-base mb-0.5 text-gray-900 truncate">{{ getItemInSlot(slotIndex)?.title || 'No title' }}</h3>
            <p class="text-gray-600 text-xs leading-snug line-clamp-1">{{ getItemInSlot(slotIndex)?.description || 'No description' }}</p>
          </div>
        </div>
        
        <!-- Empty slot indicator -->
        <div
          v-else
          class="flex-1 flex items-center justify-center text-gray-400 text-sm italic border-2 border-dashed border-gray-300 rounded-lg px-3 py-2 h-12"
        >
          {{ t?.ranking?.dropHere || 'Drop option here' }}
        </div>
      </div>
      
      <!-- Available options (not yet placed) -->
      <div v-if="unplacedItems.length > 0" class="mt-4 pt-4 border-t border-gray-200">
        <h3 class="text-sm font-semibold mb-3 text-gray-700">{{ t?.ranking?.availableOptions || 'Available Options:' }}</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div
            v-for="item in unplacedItems"
            :key="item.id"
            class="flex items-center gap-2 cursor-move hover:bg-gray-50 transition-colors rounded-lg px-3 py-2 border border-gray-200 bg-white"
            draggable="true"
            @dragstart="handleContentDragStart($event, null, item)"
            @dragend="handleContentDragEnd"
          >
            <div class="drag-handle flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
              </svg>
            </div>
            <div class="flex-shrink-0">
              <OptionIcon :icon-type="getIconType(item.key)" size="sm" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-sm mb-0.5 text-gray-900 truncate">{{ item.title }}</h3>
              <p class="text-gray-600 text-xs leading-snug line-clamp-1">{{ item.description }}</p>
            </div>
          </div>
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

    <div v-if="items.length > 0" class="mt-6 flex gap-4 justify-center">
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
  slotIndex?: number;
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
  
  // Validate and clean the options
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
    priority: item.priority,
    slotIndex: item.slotIndex
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
const items = ref<RankingOption[]>([]);
const slots = ref<(RankingOption | null)[]>(Array(6).fill(null));
const isMobile = ref(false);
const dragOverSlot = ref<number | null>(null);
const draggedItem = ref<{ item: RankingOption; fromSlot: number | null } | null>(null);

// Watch for parsed options changes and initialize items
watch(parsedOptions, (newOptions) => {
  if (Array.isArray(newOptions) && newOptions.length > 0) {
    items.value = newOptions.map(item => ({ ...item }));
    // Initialize slots as empty
    slots.value = Array(6).fill(null);
  }
}, { immediate: true });

onMounted(() => {
  const opts = parsedOptions.value;
  
  if (Array.isArray(opts) && opts.length > 0) {
    items.value = opts.map(item => ({ ...item }));
    slots.value = Array(6).fill(null);
  }
  
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 640;
    window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth < 640;
    });
  }
});

// Get item in a specific slot
function getItemInSlot(slotIndex: number): RankingOption | null {
  return slots.value[slotIndex] || null;
}

// Get unplaced items
const unplacedItems = computed(() => {
  const placedIds = new Set(slots.value.filter(Boolean).map(item => item!.id));
  return items.value.filter(item => !placedIds.has(item.id));
});

// Desktop drag handlers
function handleContentDragStart(event: DragEvent, slotIndex: number | null, item?: RankingOption) {
  const targetItem = item || (slotIndex !== null ? slots.value[slotIndex] : null);
  if (!targetItem) return;
  
  draggedItem.value = { item: targetItem, fromSlot: slotIndex };
  
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', targetItem.id);
  }
  
  // Make the dragged element semi-transparent
  if (event.target) {
    (event.target as HTMLElement).style.opacity = '0.5';
  }
}

function handleContentDragEnd(event: DragEvent) {
  if (event.target) {
    (event.target as HTMLElement).style.opacity = '1';
  }
  dragOverSlot.value = null;
  draggedItem.value = null;
}

function handleSlotDragOver(event: DragEvent, slotIndex: number) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
  dragOverSlot.value = slotIndex;
}

function handleSlotDragLeave() {
  dragOverSlot.value = null;
}

function handleSlotDrop(event: DragEvent, slotIndex: number) {
  event.preventDefault();
  dragOverSlot.value = null;
  
  if (!draggedItem.value) return;
  
  const { item, fromSlot } = draggedItem.value;
  
  // Remove from old slot
  if (fromSlot !== null) {
    slots.value[fromSlot] = null;
  }
  
  // If target slot is occupied, swap items
  if (slots.value[slotIndex]) {
    if (fromSlot !== null) {
      slots.value[fromSlot] = slots.value[slotIndex];
    }
  }
  
  // Place in new slot
  slots.value[slotIndex] = item;
  draggedItem.value = null;
}

// Mobile handlers
function selectPriority(item: RankingOption) {
  selectedItem.value = item;
}

function setPriority(priority: number) {
  if (selectedItem.value) {
    items.value.forEach(item => {
      if (item.priority === priority && item.id !== selectedItem.value!.id) {
        item.priority = undefined;
      }
    });
    selectedItem.value.priority = priority;
    selectedItem.value = null;
    
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
  if (isMobile.value) {
    const allHavePriority = items.value.every(item => item.priority !== undefined);
    if (!allHavePriority) {
      alert(t.value?.ranking?.completeAll || 'Please assign priority to all options first.');
      return;
    }
    const sorted = [...items.value].sort((a, b) => {
      const aPriority = a.priority ?? 999;
      const bPriority = b.priority ?? 999;
      return aPriority - bPriority;
    });
    const ranking = sorted.map(item => item.key);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ranking', JSON.stringify(ranking));
      // Scroll to scenario section instead of navigating
      const scenarioSection = document.getElementById('scenario');
      if (scenarioSection) {
        scenarioSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    emit('confirm', ranking);
  } else {
    // Desktop: get ranking from slots
    const ranking = slots.value
      .filter(Boolean)
      .map(item => item!.key);
    
    if (ranking.length !== 6) {
      alert(t.value?.ranking?.completeAll || 'Please place all options in the slots.');
      return;
    }
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ranking', JSON.stringify(ranking));
      // Scroll to scenario section instead of navigating
      const scenarioSection = document.getElementById('scenario');
      if (scenarioSection) {
        scenarioSection.scrollIntoView({ behavior: 'smooth' });
      }
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
    slots.value = Array(6).fill(null);
  }
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

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
