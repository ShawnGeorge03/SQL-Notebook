<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, Github, GithubIcon, Linkedin, LinkIcon, LucideGithub } from 'lucide-svelte';
	import '../app.css';
</script>

<section>
	<div class="bg-dark w-full text-center">
		<p class="title">SQL Notebook</p>
		<h2>Run SQL Queries directly in your browser</h2>
		<Button href="/notebooks">
			Go to Notebooks <ArrowRight size="15" />
		</Button>
	</div>
</section>

<section>
	<div class="features bg-dark justify-between">
		<h2>Features</h2>
		<ul>
			<li>Run a local instance of your database</li>
			<li>Make use of Transaction Mode</li>
			<li>Run all standard SQL queries</li>
			<li>Run with or without data persistence</li>
			<li>Support In-Memory Operations</li>
			<li>Export the database to a file</li>
			<li>Import a database from a file</li>
		</ul>
	</div>
</section>

<section>
	<div class="p-2">
		<h1>Contributors</h1>
		<div class="grid grid-cols-2 gap-2">
			<div>
				<h2>Shawn Santoshgeorge</h2>
				<div class="grid grid-rows-3 gap-2">
					<a
						href="https://shawnsg.netlify.app/"
						aria-label="Shawn Website"
						class="flex items-center space-x-2"
					>
						<LinkIcon size="20" />
						<span>Website</span>
					</a>
					<a
						href="https://github.com/ShawnGeorge03"
						aria-label="Shawn Github"
						class="flex items-center space-x-2"
					>
						<LucideGithub size="20" />
						<span>GitHub</span>
					</a>
					<a
						href="https://www.linkedin.com/in/shawnsg"
						aria-label="Shawn Linkedin"
						class="flex items-center space-x-2"
					>
						<Linkedin size="20" />
						<span>Linkedin</span>
					</a>
				</div>
			</div>
			<div>
				<h2>Aditya Kulkarni</h2>
				<div class="grid grid-rows-3 gap-2">
					<a
						href="https://adityakulkarni.me/"
						aria-label="Aditya Website"
						class="flex items-center space-x-2"
					>
						<LinkIcon size="20" />
						<span>Website</span>
					</a>
					<a
						href="https://github.com/Aditya-k-23"
						aria-label="Aditya Github"
						class="flex items-center space-x-2"
					>
						<LucideGithub size="20" />
						<span>GitHub</span>
					</a>
					<a
						href="https://www.linkedin.com/in/aditya-s-kulkarni/"
						aria-label="Adityas Linkedin"
						class="flex items-center space-x-2"
					>
						<Linkedin size="20" />
						<span>Linkedin</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.features li {
		list-style: disc;
		font-size: 18px;
	}
</style>
