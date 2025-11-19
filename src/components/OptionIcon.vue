<template>
  <div class="option-icon" :class="iconClass">
    <svg 
      v-if="iconType === 'dna'" 
      class="w-full h-full"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <path d="M12 2L2 7L12 12L22 7L12 2Z" />
      <path d="M2 17L12 22L22 17" />
      <path d="M2 12L12 17L22 12" />
    </svg>
    
    <svg 
      v-else-if="iconType === 'organ'" 
      class="w-full h-full"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <path d="M12 2C8 2 4 4 4 8C4 12 8 14 12 16C16 14 20 12 20 8C20 4 16 2 12 2Z" />
      <circle cx="12" cy="8" r="2" />
    </svg>
    
    <svg 
      v-else-if="iconType === 'current-organ'" 
      class="w-full h-full"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <path d="M12 2C8 2 4 4 4 8C4 12 8 14 12 16C16 14 20 12 20 8C20 4 16 2 12 2Z" />
      <circle cx="12" cy="8" r="2" fill="currentColor" />
      <path d="M8 10L16 10" stroke-width="1.5" />
    </svg>
    
    <svg 
      v-else-if="iconType === 'characteristics'" 
      class="w-full h-full"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <circle cx="12" cy="8" r="3" />
      <path d="M6 21C6 17 8 15 12 15C16 15 18 17 18 21" />
      <path d="M9 12L15 12" />
      <path d="M10 16L14 16" />
    </svg>
    
    <svg 
      v-else-if="iconType === 'expression'" 
      class="w-full h-full"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <path d="M12 2L2 7L12 12L22 7L12 2Z" />
      <path d="M2 17L12 22L22 17" />
      <path d="M2 12L12 17L22 12" />
      <circle cx="12" cy="7" r="1" fill="currentColor" />
    </svg>
    
    <svg 
      v-else-if="iconType === 'identity'" 
      class="w-full h-full"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6V12L16 14" />
    </svg>
    
    <div v-else class="w-full h-full flex items-center justify-center text-2xl font-bold">
      ?
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  iconType: 'dna' | 'organ' | 'current-organ' | 'characteristics' | 'expression' | 'identity';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary'
});

const iconClass = computed(() => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  const colorClasses = {
    primary: 'text-primary-600',
    accent: 'text-accent-500',
    gray: 'text-gray-600'
  };
  
  return `${sizeClasses[props.size]} ${colorClasses[props.color as keyof typeof colorClasses] || colorClasses.primary}`;
});
</script>

<style scoped>
.option-icon {
  flex-shrink: 0;
}
</style>

