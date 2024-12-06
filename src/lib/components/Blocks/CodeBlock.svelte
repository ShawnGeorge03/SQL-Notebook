<script lang="ts">
	import Editor, { type BaseBlockProps } from '$lib/components/Blocks/Block/index.svelte';
	import { PostgreSQL, sql, SQLite, StandardSQL } from '@codemirror/lang-sql';

	interface CodeBlockProps extends BaseBlockProps {
		type: 'sqlite' | 'psql' | 'standard';
	}

	let { class: className, content = $bindable(''), type = 'standard' }: CodeBlockProps = $props();

	let customExtensions = [
		sql({
			upperCaseKeywords: true,
			dialect: type === 'sqlite' ? SQLite : type === 'psql' ? PostgreSQL : StandardSQL
		})
	];
</script>

<!-- The additional attributes of autocomplete, autocorrect, autocapitalize, and spellcheck
are to ensure that Grammarly and others like it would not cause issue to this component
Source: https://stackoverflow.com/questions/254712/disable-spell-checking-on-html-textfields   -->
<Editor
	autocomplete="off"
	autocorrect="off"
	autocapitalize="off"
	spellcheck="false"
	class={className}
	bind:content
	{customExtensions}
/>
