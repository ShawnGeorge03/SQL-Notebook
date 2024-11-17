<script lang="ts">
    import Editor, { type BaseBlockProps } from "$lib/components/Blocks/Block/index.svelte";
    import { PostgreSQL, sql, SQLite, StandardSQL } from "@codemirror/lang-sql";

    interface CodeBlockProps extends BaseBlockProps {
        type:  "sqlite" | "psql" | "standard"
    }

    let { class: className, content = $bindable(""), type = "standard" }: CodeBlockProps = $props();

    let customExtensions = [
        sql({
            upperCaseKeywords: true,
            dialect: type === "sqlite" ? SQLite : type === "psql" ? PostgreSQL : StandardSQL
        })
    ]

</script>

<Editor class={className} {content} {customExtensions} />