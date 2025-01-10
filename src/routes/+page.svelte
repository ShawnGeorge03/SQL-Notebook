<script>
	import ThemeToggle from '$lib/components/Notebook/Header/ThemeToggle.svelte';

	let isMenuOpen = false;

	const toggleMenu = () => {
		isMenuOpen = !isMenuOpen;
	};
</script>

<nav class="fixed top-0 w-full bg-white shadow dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center">
			<!-- Logo -->
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<img
						class="block h-40 w-auto dark:hidden"
						src="src/lib/assets/logo_light.svg"
						alt="Logo (light)"
					/>
					<img
						class="hidden h-40 w-auto dark:block"
						src="src/lib/assets/logo_dark.svg"
						alt="Logo (dark)"
					/>
				</div>
			</div>

			<!-- Hamburger Menu Button (visible on mobile) -->
			<div class="m-auto flex md:hidden">
				<button
					onclick={toggleMenu}
					class="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
					aria-controls="mobile-menu"
					aria-expanded={isMenuOpen}
				>
					<span class="sr-only">Open main menu</span>
					<!-- Hamburger Icon -->
					<img
						src="src/lib/assets/main/hamburger.svg"
						alt="Menu Icon"
						class={`h-6 w-6 ${isMenuOpen ? 'hidden' : 'block'}`}
					/>
					<!-- Close Icon -->
					<img
						src="src/lib/assets/main/close.svg"
						alt="Close Icon"
						class={`h-6 w-6 ${isMenuOpen ? 'block' : 'hidden'}`}
					/>
				</button>
			</div>

			<!-- Desktop Navigation -->
			<div class="m-auto hidden md:block">
				<div class="ml-2 flex items-baseline space-x-4">
					<a
						href="/"
						class="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
						>Home</a
					>
					<a
						href="#features"
						class="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
						>Features</a
					>
					<a
						href="#contributors"
						class="rounded-md px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
						>Contributors</a
					>
					<a
						href="#attributions"
						class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
						>Attributions</a
					>
				</div>
			</div>

			<!-- Theme Toggle -->
			<ThemeToggle class="ml-auto" />
		</div>
	</div>

	<!-- Mobile Menu -->
	<div id="mobile-menu" class={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
		<div class="space-y-1 px-2 pb-3 pt-2">
			<a
				href="/"
				class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
				>Home</a
			>
			<a
				href="#features"
				class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
				>Features</a
			>
			<a
				href="#contributors"
				class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
				>Contributors</a
			>
			<a
				href="#attributions"
				class="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
				>Attributions</a
			>
		</div>
	</div>
</nav>

<body class="min-h-screen from-gray-50 to-white dark:from-gray-900 dark:to-black">
	<main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<section id="hero" class="px-7vw py-25 vhpy-20 flex flex-col gap-3">
			<div class="py-20 text-center">
				<div class="text-title mb-6 font-bold text-gray-900 dark:text-gray-100">SQL Notebook</div>
				<p class="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-400">
					Run PostgreSQL and SQLite directly in your browser with full SQL support and persistent
					storage.
				</p>
				<div class="flex justify-center space-x-4">
					<a
						href="/notebooks"
						class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3
						 text-base font-medium text-white transition-colors
						 hover:bg-blue-700 dark:hover:bg-blue-700"
					>
						Notebooks
					</a>
					<a
						href="https://github.com/ShawnGeorge03/SQL-Notebook?tab=readme-ov-file#readme"
						class="inline-flex items-center rounded-md border border-transparent
						 bg-blue-50 px-6 py-3 text-base font-medium text-blue-600
						 transition-colors hover:bg-blue-100 dark:bg-blue-900/20
						 dark:text-blue-200 dark:hover:bg-blue-800"
					>
						Readme
					</a>
				</div>
			</div>

			<div class="mb-15">
				<div
					class="group relative overflow-hidden rounded-xl bg-gray-800 shadow-2xl dark:bg-gray-700"
				>
					<div
						class="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20
						 transition-opacity duration-300 group-hover:opacity-75"
					></div>
				</div>
			</div>
		</section>

		<section
			id="features"
			class="px-7vw py-25vh flex flex-col gap-3 border-t border-gray-200 dark:border-gray-700"
		>
			<h2 class="text-h2 mb-12 text-center font-bold text-gray-900 dark:text-gray-100">Features</h2>
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				<div
					class="group rounded-xl bg-white p-8 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 p-3 text-blue-600 transition-colors
						 group-hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:group-hover:bg-blue-800"
					>
						<img
							src="src/lib/assets/main/db.svg"
							alt="Database Icon"
							class="h-6 w-6 text-blue-600 dark:text-blue-400"
						/>
					</div>
					<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">
						Local Database Instance
					</h3>
					<p class="leading-relaxed text-gray-600 dark:text-gray-400">
						Run fully-featured PostgreSQL and SQLite instances directly in your browser, powered by
						PGLite and wa-sqlite. No server setup required.
					</p>
				</div>

				<div
					class="group rounded-xl bg-white p-8 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 p-3
						 transition-colors group-hover:bg-blue-100 dark:bg-blue-900/20 dark:group-hover:bg-blue-800"
					>
						<img
							src="src/lib/assets/main/sql.svg"
							alt="SQL Icon"
							class="h-6 w-6 text-blue-600 dark:text-blue-400"
						/>
					</div>
					<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">
						Standard SQL Support
					</h3>
					<p class="leading-relaxed text-gray-600 dark:text-gray-400">
						Execute all standard SQL queries with full compatibility. Supports complex queries,
						joins, transactions, and more.
					</p>
				</div>

				<div
					class="group rounded-xl bg-white p-8 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 p-3
						 transition-colors group-hover:bg-blue-100 dark:bg-blue-900/20 dark:group-hover:bg-blue-800"
					>
						<img
							src="src/lib/assets/main/storage.svg"
							alt="Storage Icon"
							class="h-6 w-6 text-blue-600 dark:text-blue-400"
						/>
					</div>
					<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">
						Database Persistence
					</h3>
					<p class="leading-relaxed text-gray-600 dark:text-gray-400">
						Create and maintain databases with persistent storage capabilities. Your data remains
						safe across browser sessions.
					</p>
				</div>

				<div
					class="group rounded-xl bg-white p-8 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 p-3
						 transition-colors group-hover:bg-blue-100 dark:bg-blue-900/20 dark:group-hover:bg-blue-800"
					>
						<img
							src="src/lib/assets/main/terminal.svg"
							alt="Terminal Icon"
							class="h-6 w-6 text-blue-600 dark:text-blue-400"
						/>
					</div>
					<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">
						Rich Code Editor
					</h3>
					<p class="leading-relaxed text-gray-600 dark:text-gray-400">
						Enjoy a feature-rich code editing experience powered by CodeMirror. Syntax highlighting,
						auto-completion, and more.
					</p>
				</div>

				<div
					class="group rounded-xl bg-white p-8 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 p-3
						 transition-colors group-hover:bg-blue-100 dark:bg-blue-900/20 dark:group-hover:bg-blue-800"
					>
						<img
							src="src/lib/assets/main/lock.svg"
							alt="Lock Icon"
							class="h-6 w-6 text-blue-600 dark:text-blue-400"
						/>
					</div>
					<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">
						Multiple Notebooks
					</h3>
					<p class="leading-relaxed text-gray-600 dark:text-gray-400">
						Create and save multiple notebooks on your device using IndexedDB. Organize your work
						efficiently.
					</p>
				</div>

				<div
					class="group rounded-xl bg-white p-8 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 p-3
						 transition-colors group-hover:bg-blue-100 dark:bg-blue-900/20 dark:group-hover:bg-blue-800"
					>
						<img
							src="src/lib/assets/main/undo.svg"
							alt="Undo Icon"
							class="h-6 w-6 text-blue-600 dark:text-blue-400"
						/>
					</div>
					<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">
						Export/Import (Coming Soon)
					</h3>
					<p class="leading-relaxed text-gray-600 dark:text-gray-400">
						Future support for database export and import functionality. Easily migrate your data
						between environments.
					</p>
				</div>
			</div>
		</section>

		<!-- Contributors Section -->
		<section
			id="contributors"
			class="px-7vw py-25vh flex flex-col gap-3 border-t border-gray-200 dark:border-gray-700"
		>
			<h2 class="text-h2 mb-4 text-center font-bold text-gray-900 dark:text-gray-100">
				Contributors
			</h2>
			<div class="grid gap-8 md:grid-cols-2">
				<div
					class="rounded-xl bg-white p-8 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<div class="mb-6 flex items-center">
						<img
							src="src/lib/assets/shawn.webp?height=96&width=96"
							alt="Shawn Santhoshgeorge"
							class="h-16 w-16 rounded-full"
						/>
						<div class="ml-4">
							<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">
								Shawn Santhoshgeorge
							</h3>
							<p class="text-gray-600 dark:text-gray-400">Developer</p>
						</div>
					</div>
					<div class="space-y-3">
						<a
							href="https://shawnsg.netlify.app/"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center text-gray-600 transition-colors hover:text-blue-600
						   dark:text-gray-400 dark:hover:text-blue-300"
						>
							<img
								src="src/lib/assets/main/website.svg"
								alt="Website Icon"
								class="mr-2 h-5 w-5 transition-colors hover:fill-blue-600
						   dark:stroke-gray-400 dark:hover:stroke-blue-300"
							/>
							Website
						</a>
						<a
							href="https://github.com/ShawnGeorge03"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center text-gray-600 transition-colors hover:text-blue-600
						   dark:text-gray-400 dark:hover:text-blue-300"
						>
							<img
								src="src/lib/assets/main/github.svg"
								alt="GitHub Icon"
								class="mr-2 h-5 w-5 transition-colors hover:fill-blue-600
						   dark:stroke-gray-400 dark:hover:stroke-blue-300"
							/>
							GitHub
						</a>
						<a
							href="https://www.linkedin.com/in/shawnsg/"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center text-gray-600 transition-colors hover:text-blue-600
						   dark:text-gray-400 dark:hover:text-blue-300"
						>
							<img
								src="src/lib/assets/main/linkedin.svg"
								alt="LinkedIn Icon"
								class="mr-2 h-5 w-5"
							/>
							LinkedIn
						</a>
					</div>
				</div>

				<div
					class="rounded-xl bg-white p-8 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<div class="mb-6 flex items-center">
						<img
							src="src/lib/assets/adi.webp?height=96&width=96"
							alt="Aditya Kulkarni"
							class="h-16 w-16 rounded-full"
						/>
						<div class="ml-4">
							<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">
								Aditya Kulkarni
							</h3>
							<p class="text-gray-600 dark:text-gray-400">Developer</p>
						</div>
					</div>
					<div class="space-y-3">
						<a
							href="https://adityakulkarni.me"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center text-gray-600 transition-colors hover:text-blue-600
						   dark:text-gray-400 dark:hover:text-blue-300"
						>
							<img class="mr-2 h-5 w-5" src="src/lib/assets/main/website.svg" alt="Website Icon" />
							Website
						</a>
						<a
							href="https://github.com/Aditya-k-23"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center text-gray-600 transition-colors hover:text-blue-600
						   dark:text-gray-400 dark:hover:text-blue-300"
						>
							<img class="mr-2 h-5 w-5" src="src/lib/assets/main/github.svg" alt="GitHub Icon" />
							GitHub
						</a>
						<a
							href="https://www.linkedin.com/in/aditya-s-kulkarni/"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center text-gray-600 transition-colors hover:text-blue-600
						   dark:text-gray-400 dark:hover:text-blue-300"
						>
							<img
								class="mr-2 h-5 w-5"
								src="src/lib/assets/main/linkedin.svg"
								alt="LinkedIn Icon"
							/>
							LinkedIn
						</a>
					</div>
				</div>
			</div>
		</section>

		<!-- Attributions Section -->
		<section
			id="attributions"
			class=" px-7vw py-25vh flex flex-col gap-3 border-t border-gray-200 dark:border-gray-700"
		>
			<h2 class="text-h2 mb-4 text-center font-bold text-gray-900 dark:text-gray-100">
				Attributions
			</h2>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<a
					href="https://svelte.dev/docs/kit/introduction"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">SvelteKit</h3>
					<p class="text-gray-600 dark:text-gray-400">The fastest way to build Svelte apps</p>
				</a>
				<a
					href="https://svelte.dev/"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">Svelte</h3>
					<p class="text-gray-600 dark:text-gray-400">Cybernetically enhanced web apps</p>
				</a>
				<a
					href="https://lucide.dev/guide/packages/lucide-svelte"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">
						lucide-svelte
					</h3>
					<p class="text-gray-600 dark:text-gray-400">Beautiful & consistent icon toolkit</p>
				</a>
				<a
					href="https://www.shadcn-svelte.com/"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">
						shadcn-svelte
					</h3>
					<p class="text-gray-600 dark:text-gray-400">UI components for Svelte</p>
				</a>
				<a
					href="https://pglite.dev/"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">PGLite</h3>
					<p class="text-gray-600 dark:text-gray-400">PostgreSQL for the browser</p>
				</a>
				<a
					href="https://github.com/rhashimoto/wa-sqlite"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">wa-sqlite</h3>
					<p class="text-gray-600 dark:text-gray-400">WebAssembly SQLite for the web</p>
				</a>
				<a
					href="https://dexie.org/"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">Dexie</h3>
					<p class="text-gray-600 dark:text-gray-400">A Minimalistic Wrapper for IndexedDB</p>
				</a>
				<a
					href="https://codemirror.net/"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="text-h3 mb-2.5 font-semibold text-gray-900 dark:text-gray-100">CodeMirror</h3>
					<p class="text-gray-600 dark:text-gray-400">Versatile text editor for the browser</p>
				</a>
			</div>
		</section>
	</main>

	<footer class="bg-gray-100 py-8 dark:bg-gray-900">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<p class="text-center text-gray-500 dark:text-gray-400">
				&copy; 2024 SQL Notebook. All rights reserved.
			</p>
		</div>
	</footer>
</body>
