<template>
  <div class="scenario-display">
    <div v-if="scenario" class="card relative overflow-hidden border-2 border-primary-100">
      <!-- Decorative corner accent -->
      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-bl-full"></div>
      
      <div class="relative z-10">
        <div class="flex items-center gap-4 mb-6">
          <div class="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">{{ scenario.title }}</h2>
        </div>
        
        <div class="prose max-w-none">
          <div class="bg-gray-50 rounded-xl p-6 border-l-4 border-primary-500">
            <p class="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
              {{ scenario.content }}
            </p>
          </div>
        </div>
        
      </div>
    </div>
    <div v-else class="card text-center py-12 border-2 border-dashed border-gray-300">
      <div class="mb-4">
        <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p class="text-gray-500 mb-4 text-lg">No ranking data found. Please complete the ranking first.</p>
      <button 
        @click="scrollToRanking"
        class="btn-primary inline-block"
      >
        Go to Ranking
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getScenarioForRanking, scenarioLibrary, type Scenario } from '../utils/scenarios';

interface Props {
  translations: any | string;
  currentLang: string;
}

const props = defineProps<Props>();

// Parse translations if string
const parsedTranslations = computed(() => {
  if (typeof props.translations === 'string') {
    try {
      return JSON.parse(props.translations);
    } catch {
      return {};
    }
  }
  return props.translations || {};
});

const t = computed(() => parsedTranslations.value);
const ranking = ref<string[]>([]);
const scenario = ref<{ title: string; content: string } | null>(null);

function loadRanking() {
  // Read ranking from sessionStorage
  if (typeof window !== 'undefined') {
    const rankingStr = sessionStorage.getItem('ranking');
    if (rankingStr) {
      try {
        ranking.value = JSON.parse(rankingStr);
        const scenarioId = getScenarioForRanking(ranking.value);
        const scenarioData = scenarioLibrary[scenarioId];
        
        if (scenarioData) {
          scenario.value = {
            title: scenarioData.title[props.currentLang] || scenarioData.title['en'],
            content: scenarioData.content[props.currentLang] || scenarioData.content['en'],
          };
        } else {
          scenario.value = null;
        }
      } catch (e) {
        console.error('Failed to parse ranking:', e);
        scenario.value = null;
      }
    } else {
      scenario.value = null;
    }
  }
}

onMounted(() => {
  loadRanking();
  
  // Listen for custom event from RankingComponent
  if (typeof window !== 'undefined') {
    window.addEventListener('rankingUpdated', loadRanking);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('rankingUpdated', loadRanking);
  }
});

function scrollToConclusion() {
  if (typeof window !== 'undefined') {
    const conclusionSection = document.getElementById('conclusion');
    if (conclusionSection) {
      conclusionSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function scrollToRanking() {
  if (typeof window !== 'undefined') {
    const rankingSection = document.getElementById('ranking');
    if (rankingSection) {
      rankingSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
</script>

