<script lang="ts">
	import LanguageSelector from './LanguageSelector.svelte';
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-xl" href="/">Rules browser</a>
	</div>
	<div class="flex-none">
		<a class="link link-hover" href="https://github.com/QuentinAM/rules-browser/tree/main" target="_blank">Github <i class="fa-brands fa-github"></i></a>
		<!-- &nbsp;
		by
		&nbsp;
		<a class="link link-hover" href="https://github.com/QuentinAM/" target="_blank">QuentinAM</a> -->
		<div class="divider divider-horizontal"></div>
		<LanguageSelector />
	</div>
</div>