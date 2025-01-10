<script>
	import LogoDark from '$lib/assets/logo_dark.svg?raw';
	import LogoLight from '$lib/assets/logo_light.svg?raw';
	import CLoseIcon from '$lib/assets/main/close.svg?raw';
	import HamburgerIcon from '$lib/assets/main/hamburger.svg?raw';

	import ThemeToggle from '$lib/components/Notebook/Header/ThemeToggle.svelte';

	let isMenuOpen = false;
</script>

<nav class="fixed top-0 z-10 w-full bg-white shadow dark:bg-gray-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center">
			<!-- Logo -->
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<span class="inline-block h-[45px] w-[200px] dark:hidden" aria-hidden="true"
						>{@html LogoLight}</span
					>

					<span class="hidden h-[45px] w-[200px] dark:inline-block" aria-hidden="true"
						>{@html LogoDark}</span
					>
				</div>
			</div>

			<!-- Hamburger Menu Button (visible on mobile) -->
			<div class="m-auto flex md:hidden">
				<button
					onclick={() => (isMenuOpen = !isMenuOpen)}
					class="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
					aria-controls="mobile-menu"
					aria-expanded={isMenuOpen}
				>
					<span class="sr-only">Open main menu</span>
					<!-- Hamburger Icon -->
					<span class={`h-6 w-6 ${isMenuOpen ? 'hidden' : 'block'}`} aria-hidden="true"
						>{@html HamburgerIcon}</span
					>

					<!-- Close Icon -->
					<span class={`h-6 w-6 ${isMenuOpen ? 'block' : 'hidden'}`} aria-hidden="true"
						>{@html CLoseIcon}</span
					>
				</button>
			</div>

			<!-- Desktop Navigation -->
			<div class="m-auto hidden md:block">
				<div class="ml-2 flex items-baseline space-x-4">
					<a
						href="/"
						class="rounded-md px-3 py-2 font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
						>Home</a
					>
					<a
						href="#features"
						class="rounded-md px-3 py-2 font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
						>Features</a
					>
					<a
						href="#contributors"
						class="rounded-md px-3 py-2 font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
						>Contributors</a
					>
					<a
						href="#attributions"
						class="block rounded-md px-3 py-2 font-medium text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
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

<body class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-black">
	<main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<section id="hero" class="py-25 vhpy-20 flex flex-col gap-3 px-7vw">
			<div class="py-20 text-center">
				<div class="mb-6 text-title font-bold text-gray-900 dark:text-gray-100">SQL Notebook</div>
				<div class="rounded-md bg-accent">
					<img
						src="src/lib/assets/light_hero.png"
						alt="SQL Notebook"
						class="shadow-color-gray-500 z-9 mx-auto rounded-md p-3 pb-2 drop-shadow-2xl"
					/>
				</div>

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
			class="flex flex-col gap-3 border-t border-gray-200 px-7vw py-25vh dark:border-gray-700"
		>
			<h2 class="mb-12 text-center text-h2 font-bold text-gray-900 dark:text-gray-100">Features</h2>
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				<div
					class="group rounded-xl bg-white p-8 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<div
						class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 p-3 text-blue-600 transition-colors
						 group-hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:group-hover:bg-blue-800"
					>
						<span class="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#60a5fa"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4
                              M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5
                              c0 2.21-3.582 4-8 4s-8-1.79-8-4"
								></path>
							</svg>
						</span>
					</div>
					<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">
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
						<span class="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								stroke="#60a5fa"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 9l3 3-3 3m5 0h3M5 20h14
        a2 2 0 002-2V6a2 2 0 00-2-2H5
        a2 2 0 00-2 2v12a2 2 0 002 2z"
								></path>
							</svg>
						</span>
					</div>
					<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">
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
						<span class="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true">
							<svg
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								stroke="#60a5fa"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 7v10
		 c0 2.21 3.582 4 8 4s8-1.79 8-4V7
		 M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4
		 M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
								></path>
							</svg>
						</span>
					</div>
					<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">
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
						<span class="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								stroke="#60a5fa"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9.75 17L9 20l-1 1h8
		 l-1-1-.75-3M3 13h18M5 17h14
		 a2 2 0 002-2V5
		 a2 2 0 00-2-2H5
		 a2 2 0 00-2 2v10
		 a2 2 0 002 2z"
								></path>
							</svg>
						</span>
					</div>
					<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">
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
						<span class="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								stroke="#60a5fa"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 11H5m14 0
										a2 2 0 012 2v6
										a2 2 0 01-2 2H5
										a2 2 0 01-2-2v-6
										a2 2 0 012-2m14 0V9
										a2 2 0 00-2-2M5 11V9
										a2 2 0 012-2m0 0V5
										a2 2 0 012-2h6
										a2 2 0 012 2v2M7 7h10"
								></path>
							</svg>
						</span>
					</div>
					<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">
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
						<span class="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								stroke="#60a5fa"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 16H6
										a2 2 0 01-2-2V6
										a2 2 0 012-2h8
										a2 2 0 012 2v2m-6 12h8
										a2 2 0 002-2v-8
										a2 2 0 00-2-2h-8
										a2 2 0 00-2 2v8
										a2 2 0 002 2z"
								></path>
							</svg></span
						>
					</div>
					<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">
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
			class="flex flex-col gap-3 border-t border-gray-200 px-7vw py-25vh dark:border-gray-700"
		>
			<h2 class="mb-4 text-center text-h2 font-bold text-gray-900 dark:text-gray-100">
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
							<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">
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
							<span class="mr-2 h-5 w-5" aria-hidden="true">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									stroke="#9ca3af"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 12a9 9 0 01-9 9m9-9
										a9 9 0 00-9-9m9 9H3
										m9 9a9 9 0 01-9-9m9 9
										c1.657 0 3-4.03 3-9s-1.343-9-3-9
										m0 18c-1.657 0-3-4.03-3-9
										s1.343-9 3-9m-9 9a9 9 0 019-9"
									></path>
								</svg>
							</span>
							Website
						</a>
						<a
							href="https://github.com/ShawnGeorge03"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center text-gray-600 transition-colors hover:text-blue-600
						   dark:text-gray-400 dark:hover:text-blue-300"
						>
							<span class="mr-2 h-5 w-5" aria-hidden="true">
								<svg viewBox="0 0 24 24" fill="#9ca3af" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M12 0c-6.626 0-12 5.373-12 12
										0 5.302 3.438 9.8 8.207 11.387
										.599.111.793-.261.793-.577v-2.234
										c-3.338.726-4.033-1.416-4.033-1.416
										-.546-1.387-1.333-1.756-1.333-1.756
										-1.089-.745.083-.729.083-.729
										1.205.084 1.839 1.237 1.839 1.237
										1.07 1.834 2.807 1.304 3.492.997
										.107-.775.418-1.305.762-1.604
										-2.665-.305-5.467-1.334-5.467-5.931
										0-1.311.469-2.381 1.236-3.221
										-.124-.303-.535-1.524.117-3.176
										0 0 1.008-.322 3.301 1.23
										.957-.266 1.983-.399 3.003-.404
										1.02.005 2.047.138 3.006.404
										2.291-1.552 3.297-1.23 3.297-1.23
										.653 1.653.242 2.874.118 3.176
										.77.84 1.235 1.911 1.235 3.221
										0 4.609-2.807 5.624-5.479 5.921
										.43.372.823 1.102.823 2.222v3.293
										c0 .319.192.694.801.576
										4.765-1.589 8.199-6.086 8.199-11.386
										0-6.627-5.373-12-12-12z"
									></path>
								</svg>
							</span>
							GitHub
						</a>
						<a
							href="https://www.linkedin.com/in/shawnsg/"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center text-gray-600 transition-colors hover:text-blue-600
						   dark:text-gray-400 dark:hover:text-blue-300"
						>
							<span class="mr-2 h-5 w-5" aria-hidden="true">
								<svg viewBox="0 0 24 24" fill="#9ca3af" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M19 0h-14c-2.761 0-5 2.239-5 5
										v14c0 2.761 2.239 5 5 5h14
										c2.762 0 5-2.239 5-5v-14
										c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm
										-1.5-12.268c-.966 0-1.75-.79-1.75-1.764
										s.784-1.764 1.75-1.764 1.75.79 1.75 1.764
										-.783 1.764-1.75 1.764zm13.5 12.268h-3v
										-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765
										c1.396-2.586 7-2.777 7 2.476v6.759z"
									></path>
								</svg>
							</span>
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
							<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">
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
							<span class="mr-2 h-5 w-5" aria-hidden="true">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									stroke="#9ca3af"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 12a9 9 0 01-9 9m9-9
											a9 9 0 00-9-9m9 9H3
											m9 9a9 9 0 01-9-9m9 9
											c1.657 0 3-4.03 3-9s-1.343-9-3-9
											m0 18c-1.657 0-3-4.03-3-9
											s1.343-9 3-9m-9 9a9 9 0 019-9"
									></path>
								</svg>
							</span>
							Website
						</a>
						<a
							href="https://github.com/Aditya-k-23"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center text-gray-600 transition-colors hover:text-blue-600
						   dark:text-gray-400 dark:hover:text-blue-300"
						>
							<span class="mr-2 h-5 w-5" aria-hidden="true">
								<svg viewBox="0 0 24 24" fill="#9ca3af" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M12 0c-6.626 0-12 5.373-12 12
											0 5.302 3.438 9.8 8.207 11.387
											.599.111.793-.261.793-.577v-2.234
											c-3.338.726-4.033-1.416-4.033-1.416
											-.546-1.387-1.333-1.756-1.333-1.756
											-1.089-.745.083-.729.083-.729
											1.205.084 1.839 1.237 1.839 1.237
											1.07 1.834 2.807 1.304 3.492.997
											.107-.775.418-1.305.762-1.604
											-2.665-.305-5.467-1.334-5.467-5.931
											0-1.311.469-2.381 1.236-3.221
											-.124-.303-.535-1.524.117-3.176
											0 0 1.008-.322 3.301 1.23
											.957-.266 1.983-.399 3.003-.404
											1.02.005 2.047.138 3.006.404
											2.291-1.552 3.297-1.23 3.297-1.23
											.653 1.653.242 2.874.118 3.176
											.77.84 1.235 1.911 1.235 3.221
											0 4.609-2.807 5.624-5.479 5.921
											.43.372.823 1.102.823 2.222v3.293
											c0 .319.192.694.801.576
											4.765-1.589 8.199-6.086 8.199-11.386
											0-6.627-5.373-12-12-12z"
									></path>
								</svg>
							</span>
							GitHub
						</a>
						<a
							href="https://www.linkedin.com/in/aditya-s-kulkarni/"
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center text-gray-600 transition-colors hover:text-blue-600
						   dark:text-gray-400 dark:hover:text-blue-300"
						>
							<span class="mr-2 h-5 w-5" aria-hidden="true">
								<svg viewBox="0 0 24 24" fill="#9ca3af" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M19 0h-14c-2.761 0-5 2.239-5 5
											v14c0 2.761 2.239 5 5 5h14
											c2.762 0 5-2.239 5-5v-14
											c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm
											-1.5-12.268c-.966 0-1.75-.79-1.75-1.764
											s.784-1.764 1.75-1.764 1.75.79 1.75 1.764
											-.783 1.764-1.75 1.764zm13.5 12.268h-3v
											-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765
											c1.396-2.586 7-2.777 7 2.476v6.759z"
									></path>
								</svg>
							</span>
							LinkedIn
						</a>
					</div>
				</div>
			</div>
		</section>

		<!-- Attributions Section -->
		<section
			id="attributions"
			class=" flex flex-col gap-3 border-t border-gray-200 px-7vw py-25vh dark:border-gray-700"
		>
			<h2 class="mb-4 text-center text-h2 font-bold text-gray-900 dark:text-gray-100">
				Attributions
			</h2>
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<a
					href="https://svelte.dev/docs/kit/introduction"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">SvelteKit</h3>
					<p class="text-gray-600 dark:text-gray-400">The fastest way to build Svelte apps</p>
				</a>
				<a
					href="https://svelte.dev/"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">Svelte</h3>
					<p class="text-gray-600 dark:text-gray-400">Cybernetically enhanced web apps</p>
				</a>
				<a
					href="https://lucide.dev/guide/packages/lucide-svelte"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">
						lucide-svelte
					</h3>
					<p class="text-gray-600 dark:text-gray-400">Beautiful & consistent icon toolkit</p>
				</a>
				<a
					href="https://www.shadcn-svelte.com/"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">
						shadcn-svelte
					</h3>
					<p class="text-gray-600 dark:text-gray-400">UI components for Svelte</p>
				</a>
				<a
					href="https://pglite.dev/"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">PGLite</h3>
					<p class="text-gray-600 dark:text-gray-400">PostgreSQL for the browser</p>
				</a>
				<a
					href="https://github.com/rhashimoto/wa-sqlite"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">wa-sqlite</h3>
					<p class="text-gray-600 dark:text-gray-400">WebAssembly SQLite for the web</p>
				</a>
				<a
					href="https://dexie.org/"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">Dexie</h3>
					<p class="text-gray-600 dark:text-gray-400">A Minimalistic Wrapper for IndexedDB</p>
				</a>
				<a
					href="https://codemirror.net/"
					class="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
				>
					<h3 class="mb-2.5 text-h3 font-semibold text-gray-900 dark:text-gray-100">CodeMirror</h3>
					<p class="text-gray-600 dark:text-gray-400">Versatile text editor for the browser</p>
				</a>
			</div>
		</section>
	</main>

	<footer class="bg-gray-100 py-8 dark:bg-gray-900">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<p class="text-center text-gray-500 dark:text-gray-400">
				&copy; 2025 SQL Notebook. All rights reserved.
			</p>
		</div>
	</footer>
</body>
