# SQL Notebook

> Run PostgreSQL and SQLite directly in your browser with full SQL support and persistent storage.
> No server setup required.

[![Deploy to Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?style=for-the-badge&logo=vercel)](https://sql--notebook.vercel.app/)
[![License](https://img.shields.io/badge/license-Unlicense-blue.svg?style=for-the-badge)](https://unlicense.org/)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=for-the-badge)](#contributors)

## Table of Contents

- [Description](#description)
- [Motivation](#motivation)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Project Setup](#project-setup)
  - [Usage](#usage)
- [Building](#building)
- [License](#license)
  - [Third-Party Licenses](#third-party-licenses)
- [Contributors](#contributors)

---

## Description

**SQL Notebook** is a web-based platform that enables you to run fully-featured PostgreSQL and SQLite instances directly in the browser. Powered by [PGLite](https://pglite.dev/) and [wa-sqlite](https://github.com/rhashimoto/wa-sqlite), you can execute complex queries, manage multiple databases, and even persist your data across sessions—**no backend server or deployment hassles required**.

**Live Demo**: [https://sql--notebook.vercel.app/](https://sql--notebook.vercel.app/)

---

## Motivation

SQL Notebook was created to provide a **simple, intuitive, and flexible** environment for developers, data analysts, and SQL enthusiasts who want to:

1. **Experiment with SQL** without having to spin up a local or remote database server.
2. **Learn SQL** in a familiar browser-based environment.
3. **Prototype quickly** and share snippets without complex setup.
4. **Retain data** locally in the browser for future sessions.

By leveraging **IndexedDB** and advanced browser technologies, SQL Notebook preserves your data and configurations across page reloads, giving you a persistent, server-free database environment at your fingertips.

---

## Features

- **Local Database Instance**  
  Run fully-featured **PostgreSQL** and **SQLite** instances directly in your browser—completely serverless. Harness the power of [PGLite](https://pglite.dev/) and [wa-sqlite](https://github.com/rhashimoto/wa-sqlite).

- **Full SQL Support**  
  Execute all standard SQL queries with complete compatibility, including **joins**, **transactions**, **subqueries**, and more.

- **Persistent Storage**  
  Store your data in the browser using **IndexedDB**. Your databases remain intact even if you close or refresh your browser.

- **Rich Code Editor**  
  Enjoy a feature-packed editor courtesy of [CodeMirror](https://codemirror.net/). Benefit from **syntax highlighting**, **auto-completion**, and more advanced editing features.

- **Multiple Notebooks**  
  Create and manage multiple notebooks within the app, making it easy to segment your experiments or projects.

- **Lightweight & Fast**  
  Deployed on [Vercel](https://vercel.com/) for quick load times and reliable hosting.

---

## Tech Stack

- **Frontend Framework**: [Svelte](https://svelte.dev/) & [SvelteKit](https://kit.svelte.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn-svelte](https://www.shadcn-svelte.com/)
- **Deployments**: [Vercel](https://vercel.com/)
- **Databases**: [PGLite](https://pglite.dev/) & [wa-sqlite](https://github.com/rhashimoto/wa-sqlite)
- **Editor**: [CodeMirror](https://codemirror.net/)
- **Browser Storage**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) via [Dexie](https://dexie.org/)

---

## Getting Started

### Project Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/ShawnGeorge03/SQL-Notebook.git
   ```

2. **Navigate to the project directory**

   ```bash
   cd SQL-Notebook
   ```

3. **Install the dependencies**

   ```bash
   pnpm install
   ```

4. **Start the development server**

   ```bash
   pnpm run dev
   ```

Open the browser and navigate to [http://localhost:5173](http://localhost:5173).

## Usage

1. **Open a New Notebook**

   - Click on the **“New Notebook”** button in the UI to create a new workspace.

2. **Write SQL Queries**

   - In the editor window, input your SQL queries.
   - **Example**:

     ```sql
     CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       email TEXT NOT NULL UNIQUE
     );

     INSERT INTO users (name, email)
     VALUES ('Jane Doe', 'jane@example.com');

     SELECT * FROM users;
     ```

3. **Execute**

   - Click on the **“Run”** button (or use the provided shortcut) to execute the current query.

4. **Review Results**

   - The results pane below the editor will display the output from your query, including errors if any.

5. **Persistence**

   - Data is automatically stored in your browser’s **IndexedDB**, so your tables and records will remain accessible on future visits.

6. **Manage Multiple Notebooks**
   - Switch between notebooks for different projects or ideas without mixing up your data. All notebooks are stored separately in IndexedDB.

---

## Building

To build the project for production:

```bash
pnpm run build
```

To preview the production build, run:

```bash
pnpm run preview
```

## License

This project is licensed under [The Unlicense](https://unlicense.org/).

You are free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

For more information, see the [LICENSE](./LICENSE) file.

### Third-Party Licenses

This project uses third-party libraries that are licensed under their respective terms. See the `NOTICE` file for details. Run `pnpm run licenses ls` to generate a list of dependencies and their licenses.

## Contributors

- [Aditya Kulkarni](https://adityakulkarni.me/)
- [Shawn Santoshgeorge](https://shawnsg.netlify.app/)

Interested in contributing? Feel free to open an [issue](https://github.com/ShawnGeorge03/SQL-Notebook/issues) or pull request!

> Happy Querying! 🚀
>
> We hope SQL Notebook helps simplify your data exploration and SQL development. If you have feedback or suggestions, please create an issue or submit a pull request.
