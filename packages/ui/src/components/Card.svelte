<script lang="ts">
  export let padding: 'sm' | 'md' | 'lg' = 'md';
  export let shadow: 'sm' | 'md' | 'lg' | 'none' = 'md';
  export let rounded: 'sm' | 'md' | 'lg' | 'xl' = 'lg';

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    none: 'shadow-none'
  };

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  $: classes = `bg-white border border-secondary-200 ${paddingClasses[padding]} ${shadowClasses[shadow]} ${roundedClasses[rounded]}`;
</script>

<div class={classes}>
  <slot />
</div>
