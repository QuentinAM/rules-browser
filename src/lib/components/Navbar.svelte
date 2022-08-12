<script lang="ts">
	import LanguageSelector from './LanguageSelector.svelte';
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-xl" href="/">Rules browser</a>
	</div>
	<div class="flex-none">
		<LanguageSelector />
	</div>
</div>