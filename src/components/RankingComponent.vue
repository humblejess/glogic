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
      <!-- Available options (not yet placed) -->
      <div v-if="unplacedItems.length > 0" class="mb-6 pb-4 border-b border-gray-200">
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
              <h3 class="font-semibold text-sm mb-0.5 text-gray-900 truncate">{{ item.key }}. {{ item.title }}</h3>
              <p class="text-gray-600 text-xs leading-snug line-clamp-1">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Ranking slots 1-6 -->
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
            <h3 class="font-semibold text-base mb-0.5 text-gray-900 truncate">{{ getItemInSlot(slotIndex)?.key }}. {{ getItemInSlot(slotIndex)?.title || 'No title' }}</h3>
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
    </div>

    <!-- Mobile: Drag to Select Priority -->
    <div v-else-if="items.length > 0 && isMobile" class="space-y-6 relative">
      <!-- Dragging Preview (follows finger) -->
      <div
        v-if="mobileDragState && mobileDragState.item"
        :style="{
          position: 'fixed',
          left: mobileDragState.currentX + 'px',
          top: mobileDragState.currentY + 'px',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          pointerEvents: 'none',
          width: 'calc(33.333% - 0.5rem)',
          maxWidth: '120px'
        }"
        class="flex flex-col items-center justify-center p-3 bg-white border-2 border-primary-500 rounded-lg shadow-2xl"
      >
        <div class="mb-2">
          <OptionIcon :icon-type="getIconType(mobileDragState.item.key)" size="sm" />
        </div>
        <div class="text-xs font-bold text-gray-900">{{ mobileDragState.item.key }}</div>
        <div class="text-xs text-gray-600 text-center mt-1 line-clamp-1 w-full">{{ mobileDragState.item.title }}</div>
      </div>

      <!-- Available Options (a-f) -->
      <div>
        <h3 class="text-sm font-semibold mb-3 text-gray-700 px-2">{{ t?.ranking?.availableOptions || 'Available Options:' }}</h3>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="item in unplacedItems"
            :key="item.id"
            class="flex flex-col items-center justify-center p-3 bg-white border-2 border-gray-300 rounded-lg cursor-move transition-transform touch-none"
            :class="{
              'border-primary-500 bg-primary-50': draggedItem?.item.id === item.id,
              'opacity-30': draggedItem && draggedItem.item.id === item.id,
              'opacity-50': draggedItem && draggedItem.item.id !== item.id
            }"
            @touchstart="handleMobileDragStart($event, null, item)"
            @touchmove.prevent="handleMobileDragMove"
            @touchend="handleMobileDragEnd"
          >
            <div class="mb-2">
              <OptionIcon :icon-type="getIconType(item.key)" size="sm" />
            </div>
            <div class="text-xs font-bold text-gray-900">{{ item.key }}</div>
            <div class="text-xs text-gray-600 text-center mt-1 line-clamp-1">{{ item.title }}</div>
          </div>
        </div>
      </div>

      <!-- Drag Target Area: 1-6 Slots -->
      <div>
        <h3 class="text-sm font-semibold mb-3 text-gray-700 px-2">{{ t?.ranking?.instructions || 'Drag to rank' }}</h3>
        <div class="grid grid-cols-3 gap-2">
            <div
              v-for="slotIndex in 6"
              :key="slotIndex"
              :data-slot-index="slotIndex - 1"
              class="flex flex-col items-center justify-center p-4 bg-gray-50 border-2 border-dashed rounded-lg min-h-[100px] transition-colors"
              :class="{
                'border-primary-500 bg-primary-100': dragOverSlot === slotIndex - 1,
                'border-gray-300': dragOverSlot !== slotIndex - 1 && !getItemInSlot(slotIndex - 1),
                'border-primary-400 bg-primary-50': getItemInSlot(slotIndex - 1) && dragOverSlot !== slotIndex - 1
              }"
              @touchmove.prevent="handleMobileDragMove"
              @touchend="handleMobileDragEnd($event, slotIndex - 1)"
            >
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center font-bold text-lg shadow-sm mb-2">
              {{ slotIndex }}
            </div>
            <div 
              v-if="getItemInSlot(slotIndex - 1)" 
              class="flex flex-col items-center w-full touch-none"
              :class="{
                'opacity-30': draggedItem?.item.id === getItemInSlot(slotIndex - 1)?.id
              }"
              @touchstart="handleMobileDragStart($event, slotIndex - 1, getItemInSlot(slotIndex - 1)!)"
              @touchmove.prevent="handleMobileDragMove"
              @touchend="handleMobileDragEnd"
            >
              <div class="mb-1">
                <OptionIcon :icon-type="getIconType(getItemInSlot(slotIndex - 1)!.key)" size="sm" />
              </div>
              <div class="text-xs font-bold text-gray-900">{{ getItemInSlot(slotIndex - 1)?.key }}</div>
              <div class="text-xs text-gray-600 text-center mt-1 line-clamp-1">{{ getItemInSlot(slotIndex - 1)?.title }}</div>
            </div>
            <div v-else class="text-xs text-gray-400 text-center">
              {{ t?.ranking?.dropHere || 'Drop here' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Result Display: 1-6 Ranking -->
      <div>
        <h3 class="text-sm font-semibold mb-3 text-gray-700 px-2">{{ t?.ranking?.yourRanking || 'Your Ranking:' }}</h3>
        <div class="space-y-2">
          <div
            v-for="slotIndex in 6"
            :key="slotIndex"
            class="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg"
            :class="{
              'border-primary-300 bg-primary-50': getItemInSlot(slotIndex - 1),
              'border-gray-200': !getItemInSlot(slotIndex - 1)
            }"
          >
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {{ slotIndex }}
            </div>
            <div v-if="getItemInSlot(slotIndex - 1)" class="flex items-start gap-3 flex-1">
              <div class="flex-shrink-0">
                <OptionIcon :icon-type="getIconType(getItemInSlot(slotIndex - 1)!.key)" size="sm" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm text-gray-900 mb-1">{{ getItemInSlot(slotIndex - 1)?.key }}. {{ getItemInSlot(slotIndex - 1)?.title }}</div>
                <div class="text-xs text-gray-600 leading-relaxed">{{ getItemInSlot(slotIndex - 1)?.description }}</div>
              </div>
            </div>
          </div>
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
const mobileDragState = ref<{
  item: RankingOption | null;
  fromSlot: number | null;
  touchStartX: number;
  touchStartY: number;
  currentX: number;
  currentY: number;
  element: HTMLElement | null;
} | null>(null);

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

// Mobile drag handlers
function handleMobileDragStart(event: TouchEvent, slotIndex: number | null, item?: RankingOption) {
  const targetItem = item || (slotIndex !== null ? slots.value[slotIndex] : null);
  if (!targetItem) return;

  const touch = event.touches[0];
  mobileDragState.value = {
    item: targetItem,
    fromSlot: slotIndex,
    touchStartX: touch.clientX,
    touchStartY: touch.clientY,
    currentX: touch.clientX,
    currentY: touch.clientY,
    element: event.target as HTMLElement
  };

  draggedItem.value = { item: targetItem, fromSlot: slotIndex };
  
  // Visual feedback - make original element semi-transparent
  if (event.target) {
    (event.target as HTMLElement).style.opacity = '0.3';
  }
}

function handleMobileDragMove(event: TouchEvent) {
  if (!mobileDragState.value) return;
  
  const touch = event.touches[0];
  
  // Update preview position to follow finger
  mobileDragState.value.currentX = touch.clientX;
  mobileDragState.value.currentY = touch.clientY;
  
  // Find the target slot
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  if (element) {
    const slotElement = element.closest('[data-slot-index]');
    if (slotElement) {
      const slotIndex = parseInt((slotElement as HTMLElement).dataset.slotIndex || '-1');
      if (slotIndex >= 0 && slotIndex < 6) {
        dragOverSlot.value = slotIndex;
      } else {
        dragOverSlot.value = null;
      }
    } else {
      dragOverSlot.value = null;
    }
  }
}

function handleMobileDragEnd(event: TouchEvent, targetSlotIndex?: number) {
  if (!mobileDragState.value || !draggedItem.value) {
    // Reset visual feedback
    if (mobileDragState.value?.element) {
      mobileDragState.value.element.style.opacity = '1';
    }
    mobileDragState.value = null;
    draggedItem.value = null;
    dragOverSlot.value = null;
    return;
  }

  const { item, fromSlot } = draggedItem.value;
  
  // Determine target slot
  let finalSlotIndex: number | null = null;
  
  if (targetSlotIndex !== undefined) {
    finalSlotIndex = targetSlotIndex;
  } else if (dragOverSlot.value !== null) {
    finalSlotIndex = dragOverSlot.value;
  } else {
    // Try to find from touch position
    const touch = event.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element) {
      const slotElement = element.closest('[data-slot-index]');
      if (slotElement) {
        const slotIndex = parseInt((slotElement as HTMLElement).dataset.slotIndex || '-1');
        if (slotIndex >= 0 && slotIndex < 6) {
          finalSlotIndex = slotIndex;
        }
      }
    }
  }

  if (finalSlotIndex !== null && finalSlotIndex !== fromSlot) {
    // Store the item currently in target slot (if any)
    const targetSlotItem = slots.value[finalSlotIndex];
    
    // Remove from old slot
    if (fromSlot !== null) {
      slots.value[fromSlot] = null;
    }

    // If target slot is occupied, swap items
    if (targetSlotItem) {
      if (fromSlot !== null) {
        slots.value[fromSlot] = targetSlotItem;
      } else {
        // If dragging from unplaced items, the swapped item goes back to unplaced
        // (it will automatically appear in available options)
      }
    }

    // Place in new slot
    slots.value[finalSlotIndex] = item;
  }

  // Reset visual feedback
  if (mobileDragState.value.element) {
    mobileDragState.value.element.style.opacity = '1';
  }
  
  mobileDragState.value = null;
  draggedItem.value = null;
  dragOverSlot.value = null;
}

function confirmRanking() {
  // Both mobile and desktop use slots now
  const ranking = slots.value
    .filter(Boolean)
    .map(item => item!.key);
  
  if (ranking.length !== 6) {
    alert(t.value?.ranking?.completeAll || 'Please place all options in the slots.');
    return;
  }
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('ranking', JSON.stringify(ranking));
    
    // Trigger custom event to notify ScenarioDisplay to reload
    window.dispatchEvent(new CustomEvent('rankingUpdated'));
    
    // Scroll to scenario section instead of navigating
    const scenarioSection = document.getElementById('scenario');
    if (scenarioSection) {
      scenarioSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  emit('confirm', ranking);
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
