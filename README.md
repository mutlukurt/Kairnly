# Kairnly

Kairnly is a private, local-first desktop workspace for personal notes, pages, documents, tasks, ideas, structured writing, and local knowledge management.

[![Download macOS DMG](https://img.shields.io/badge/Download%20macOS%20DMG-Kairnly%201.0.0-8B6F47?style=for-the-badge&logo=apple&logoColor=white)](https://github.com/mutlukurt/Kairnly/raw/main/releases/Kairnly_1.0.0_aarch64.dmg)

**Download for macOS:** [Kairnly_1.0.0_aarch64.dmg](https://github.com/mutlukurt/Kairnly/raw/main/releases/Kairnly_1.0.0_aarch64.dmg)

> This local build is unsigned by default. macOS may show a security warning on first launch. For public distribution, Apple Developer ID signing and notarization are recommended.

It is designed for people who want a calm writing-first workspace without accounts, cloud sync, subscriptions, team features, or remote databases. Notes live locally on the user’s own device.

Repository: https://github.com/mutlukurt/Kairnly

## What Kairnly Does

In plain language:

Kairnly is a personal digital notebook and workspace. You can create pages, nest pages under other pages, write rich notes, add todos, headings, dividers, images, files, videos, bookmarks, tables, code blocks, and export your notes. It behaves like a modern page-based workspace, but it is private and local.

For users, this means:

- Write notes and documents in a clean, focused editor.
- Organize thoughts into pages and subpages.
- Keep data on the device instead of in a cloud account.
- Search pages and note content quickly.
- Export one note, a note with all subpages, or the whole workspace.
- Back up everything as JSON and import it again later.
- Export notes as PDFs, including images and visual content.

For developers, this means:

- Tauri desktop shell with a React/Vite frontend.
- SQLite persistence layer implemented in Rust through Tauri commands.
- Tiptap / ProseMirror rich-text editor.
- Zustand state management.
- Tailwind CSS and CSS variables for theming.
- Local-first architecture with browser fallback for preview mode.

## Product Philosophy

Kairnly is inspired by the idea of a cairn: small stones stacked as path markers. The app helps users stack notes, references, tasks, and ideas into a private knowledge path.

The interface aims to feel:

- Calm
- Premium
- Minimal but useful
- Warm and neutral
- Writing-first
- Offline-first
- Personal and professional

Kairnly is not a cloud SaaS app. It intentionally does not include login, billing, Supabase, Firebase, team workspaces, real-time collaboration, or remote sync.

## Tech Stack

Core:

- Tauri 2
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- SQLite via Rust `rusqlite`
- Tiptap / ProseMirror

Editor and interaction:

- `@tiptap/react`
- `@tiptap/starter-kit`
- Tiptap task list, image, table, link, underline, highlight, color, text style extensions
- Custom `MediaBlock` Tiptap node for local files, videos, embeds, and bookmarks
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- Framer Motion
- Lucide React icons

Export and backup:

- `html2canvas`
- `jspdf`
- `jszip`

Styling and utilities:

- Tailwind CSS
- CSS variables
- `clsx`
- `tailwind-merge`

Rust / local database:

- `tauri`
- `rusqlite` with bundled SQLite
- SQLite FTS5 search index
- `serde`
- `serde_json`
- `chrono`
- `uuid`

## Architecture Overview

Kairnly has three main layers.

### 1. Desktop Shell

The desktop shell lives in `src-tauri/`.

It provides:

- Native desktop window through Tauri.
- Local SQLite database location resolution.
- Rust commands exposed to the frontend through Tauri `invoke`.
- Database setup, migrations-by-schema, seed content, search indexing, backup export, and backup import.

Important files:

- `src-tauri/src/lib.rs`
- `src-tauri/src/main.rs`
- `src-tauri/tauri.conf.json`
- `src-tauri/icons/*`

### 2. Frontend App

The frontend lives in `src/`.

It provides:

- App layout
- Sidebar
- Page tree
- Rich editor
- Settings
- Search / command palette
- Export workflows
- Theme system
- Browser preview fallback

Important files:

- `src/App.tsx`
- `src/features/sidebar/Sidebar.tsx`
- `src/features/editor/WorkspaceEditor.tsx`
- `src/features/editor/BlockInsertMenu.tsx`
- `src/features/editor/editorCommands.ts`
- `src/features/editor/MediaBlock.ts`
- `src/features/search/CommandPalette.tsx`
- `src/features/settings/SettingsDialog.tsx`

### 3. Local Data Layer

The database API is split into:

- Tauri command client: `src/lib/db/client.ts`
- Browser preview fallback: `src/lib/db/localFallback.ts`
- Rust SQLite implementation: `src-tauri/src/lib.rs`

When running as a Tauri desktop app, Kairnly uses SQLite.

When running in the browser preview with Vite, Kairnly uses a localStorage fallback so the UI can still be developed and tested without a desktop build.

## SQLite Schema

Kairnly stores workspace data locally in SQLite.

Main tables:

- `pages`
- `blocks`
- `page_links`
- `tags`
- `page_tags`
- `search_index` using SQLite FTS5

The `pages` table stores:

- id
- title
- icon
- cover
- parent_id
- sort_order
- favorite/archive state
- timestamps

The `blocks` table stores:

- id
- page_id
- parent_block_id
- type
- content_json
- properties_json
- sort_order
- timestamps

The UI does not expose the technical word “blocks” to the user. The user simply writes naturally inside pages.

## Main Features

### Local-First Workspace

- All core data is stored locally.
- Desktop persistence uses SQLite.
- No cloud account is required.
- No remote backend is required.
- Browser preview uses localStorage only as a development fallback.

### Page System

- Create pages
- Rename pages inline
- Add page icons
- Add/remove cover area
- Favorite pages
- Archive pages
- Duplicate/export foundations
- Create nested subpages
- Breadcrumbs
- Recent and favorite sections
- Page tree in sidebar

### Sidebar

- Workspace branding
- New Page button
- Search button
- Quick command button
- Favorites
- Recent pages
- All pages
- Nested tree
- Active page highlight
- Sidebar collapse
- Hover actions for child pages and favorites
- Warm premium visual style

### Rich Editor

- Tiptap / ProseMirror editor
- Page title field
- Page icon selector
- Placeholder writing text
- Autosave
- Saved locally indicator
- Last edited timestamp
- Bubble formatting toolbar
- Text color controls
- Background highlight controls
- Hover block controls
- Add block menu
- Delete block button
- Local media blocks

Supported content includes:

- Paragraph
- Heading 1
- Heading 2
- Heading 3
- Bulleted list
- Numbered list
- Todo list
- Toggle-style block placeholder
- Quote
- Callout
- Divider
- Code block
- Inline code
- Bold
- Italic
- Underline
- Strike
- Link
- Highlight
- Table
- Image
- Local file card
- Local video card
- Embed card
- Bookmark card
- Page mention placeholder
- Date mention

### Block Insert Menu

The editor has one shared command registry used by both:

- Slash command menu
- Hover plus button menu

The shared registry lives in:

- `src/features/editor/editorCommands.ts`

The menu supports:

- Suggested blocks
- Basic blocks
- Media
- Advanced
- Search/filter
- Keyboard navigation
- Icons
- Descriptions
- Hover states
- Escape close
- Outside click close
- Position-aware insertion

The plus button inserts blocks after the hovered block, not always at the end.

### Todo Behavior

Todo list UX was fixed so:

- Text appears beside the checkbox.
- Checkbox is not blocked by hover controls.
- Users can check/uncheck freely.
- Checked items are shown as completed.
- Hover block controls are positioned to the left and do not cover the checkbox.

### Media Support

Kairnly supports local media insertion:

- Images from the user’s device
- Videos from the user’s device
- Files from the user’s device
- URL embeds
- Bookmark URL cards

Local files are inserted as data URLs in the document model for persistence through the current local backup flow.

### Search and Command Palette

Cmd/Ctrl + K opens the command palette.

It supports:

- Search pages
- Search block text
- Open recent pages
- Create new page
- Open settings
- Toggle theme
- Favorite current page
- Export workspace backup
- Archive current page

SQLite FTS5 is used in the desktop build.

### Settings

Settings includes:

- Appearance
- Data
- Editor
- About

Appearance:

- Light theme
- Dark theme

Data:

- Local data location
- JSON workspace backup export
- JSON workspace backup import
- Export all notes as PDFs in a ZIP
- Workspace stats

Editor:

- Font size
- Line height
- Page width
- Word count toggle
- Focus mode
- Reset editor preferences

About:

- App logo
- Version
- Privacy note
- Editor engine info
- Backup format info

### Export and Backup

Kairnly supports:

- Export current page as Markdown
- Export current page as HTML
- Export current page as PDF
- Export current page plus subpages as separate PDFs in a ZIP
- Export all notes as separate PDFs in a ZIP
- Export entire workspace as JSON
- Import workspace JSON backup

PDF export includes rendered text, headings, lists, todos, tables, code blocks, callouts, images, and media cards. Videos are represented as attachment cards because standard PDFs do not preserve playable video in a simple portable way.

### Theme System

The app uses CSS variables for theming.

Themes:

- Warm light theme
- Deep graphite dark theme

The editor also uses CSS variables for:

- Font size
- Line height
- Page width

## Local Persistence Behavior

Desktop/Tauri behavior:

- Notes are saved in SQLite on the user’s device.
- Closing and reopening the desktop app preserves notes.
- No internet is needed for core use.

Browser preview behavior:

- Notes are saved in browser localStorage.
- Data persists for the same browser and same local/domain origin.
- It does not automatically sync across devices, browsers, or domains.
- JSON export/import can be used to move data manually.

## Project Structure

```text
Kairnly/
  public/
    logo.png
    favicon.png
    apple-touch-icon.png
  src/
    components/ui/
      Button.tsx
      Modal.tsx
      Tooltip.tsx
    features/
      editor/
        BlockInsertMenu.tsx
        EditorHeader.tsx
        MediaBlock.ts
        WorkspaceEditor.tsx
        editorCommands.ts
      search/
        CommandPalette.tsx
      settings/
        SettingsDialog.tsx
      sidebar/
        Sidebar.tsx
        pageTree.ts
    lib/
      db/
        client.ts
        localFallback.ts
      export/
        pdf.ts
      store/
        workspace.ts
      utils/
        cn.ts
        text.ts
    types/
      index.ts
  src-tauri/
    src/
      lib.rs
      main.rs
    icons/
    tauri.conf.json
```

## Chronological Development Log

### v1.0.0 - Initial Local-First Workspace Foundation

Technical:

- Created a Vite + React + TypeScript project.
- Added Tauri desktop shell structure.
- Added SQLite persistence layer in Rust with `rusqlite`.
- Added pages, blocks, links, tags, page tags, and FTS5 search schema.
- Added seed “Welcome to Kairnly” page.
- Added TypeScript data types for pages, blocks, search results, themes, and Tiptap documents.
- Added Zustand workspace store.
- Added browser fallback storage for preview mode.

User-facing:

- Kairnly became a working local-first writing app foundation.
- Users could open the workspace, see a welcome page, and persist notes locally.

### v1.0.1 - Premium Workspace Layout

Technical:

- Built main app shell with left sidebar and editor area.
- Added reusable UI components.
- Added page tree builder.
- Added theme CSS variables.
- Added warm light theme and graphite dark theme.

User-facing:

- Kairnly started to feel like a calm personal workspace instead of a raw editor.
- Sidebar gained favorites, recents, all pages, active page state, and collapse behavior.

### v1.0.2 - Rich Editor and Autosave

Technical:

- Integrated Tiptap / ProseMirror.
- Added StarterKit, placeholder, task list, underline, highlight, link, and table extensions.
- Added title editing.
- Added autosave debounce.
- Added saved locally indicator.

User-facing:

- Users could write rich pages with headings, lists, todos, quotes, code, dividers, and tables.
- Changes saved automatically.

### v1.0.3 - Slash Commands and Shared Block Commands

Technical:

- Added slash command behavior.
- Refactored command definitions into a shared editor command registry.
- Added reusable block insert menu.
- Added keyboard navigation and search/filter in the menu.

User-facing:

- Typing `/` opened a block menu.
- Users could quickly insert common writing blocks.

### v1.0.4 - Position-Aware Plus Button Block Insertion

Technical:

- Added hover block controls.
- Added position-aware insert logic based on ProseMirror document positions.
- Reused the same command registry for slash menu and plus menu.
- Added outside click and Escape handling.

User-facing:

- Hovering a block showed a plus button.
- Clicking plus opened a floating insert menu near the block.
- New blocks inserted after the selected block instead of at the end.

### v1.0.5 - Block Deletion and Stable Hover Controls

Technical:

- Added block delete action using Tiptap `deleteRange`.
- Added delayed hover close behavior.
- Moved controls left to avoid covering text and todos.
- Added toolbar hover persistence so controls do not disappear when moving from block to toolbar.

User-facing:

- Users can delete inserted blocks such as dividers, todos, paragraphs, and media.
- Controls no longer block checkbox interactions.
- The toolbar feels stable and usable.

### v1.0.6 - Todo UX Fixes

Technical:

- Added task-list-specific CSS layout.
- Removed paragraph margin inside task items.
- Styled checked todo items.
- Improved checkbox cursor and alignment.

User-facing:

- Todo text now appears beside the checkbox.
- Users can check and uncheck todos freely.
- Completed todos are visually clear.

### v1.0.7 - Local Media Blocks

Technical:

- Added custom Tiptap `MediaBlock` node.
- Added local file picker helper.
- Added local image, video, and file insertion.
- Added embed and bookmark card rendering.
- Added media block styling.

User-facing:

- Users can add images from their device.
- Users can add videos from their device.
- Users can add local files as attachment cards.
- URLs can be saved as embed/bookmark cards.

### v1.0.8 - Search and Command Palette

Technical:

- Added global Cmd/Ctrl + K command palette.
- Added local search over page titles and block text.
- Connected Tauri SQLite FTS5 search to the frontend.

User-facing:

- Users can search the workspace quickly.
- Users can create pages, open settings, toggle theme, favorite pages, export backups, and archive pages from one palette.

### v1.0.9 - Settings Completion

Technical:

- Converted Settings into real tabs.
- Added Appearance, Data, Editor, and About sections.
- Added editor preference persistence through localStorage and CSS variables.
- Added JSON import command in Tauri and browser fallback.

User-facing:

- Users can change themes.
- Users can see local data location.
- Users can export/import JSON backups.
- Users can tune editor font size, line height, page width, word count, and focus mode.
- Users can read app/privacy/about information.

### v1.0.10 - PDF Export System

Technical:

- Added Tiptap JSON to export HTML renderer.
- Added lazy-loaded `html2canvas`, `jspdf`, and `jszip`.
- Added single page PDF export.
- Added current page plus subpages ZIP export.
- Added full workspace PDF ZIP export.

User-facing:

- Users can download a single note as PDF.
- Users can download a page and its subpages as separate PDFs in a ZIP.
- Users can download all notes as separate PDFs in a ZIP.
- Images and visual content are included in the PDF output.

### v1.0.11 - Branding and App Icon

Technical:

- Added desktop `logo.png` as app logo.
- Generated favicon, apple touch icon, Tauri PNG icons, and macOS ICNS icon.
- Connected icons in `index.html` and `tauri.conf.json`.

User-facing:

- Kairnly now uses its own visual logo in the app, browser tab, and desktop bundle configuration.

### v1.0.12 - Documentation and MIT License

Technical:

- Replaced the Vite template README with full project documentation.
- Added architecture, feature list, tech stack, development log, local persistence notes, and setup instructions.
- Added MIT License.

User-facing:

- The project is now understandable for users, developers, portfolio reviewers, and contributors.

### v1.0.13 - Professional macOS DMG Packaging

Technical:

- Prepared the Tauri v2 macOS bundle configuration for a professional desktop release.
- Normalized the bundle identifier to `com.mutlukurt.kairnly`.
- Added macOS bundle category, short description, copyright, bundle name, bundle version, minimum system version, and DMG layout metadata.
- Verified that the Kairnly `.icns` icon is used by the macOS app bundle.
- Added `build:mac`, `build:dmg`, and `build:dmg:desktop` npm scripts.
- Added `scripts/copy-dmg-to-desktop.mjs`, a dependency-free Node script that finds the newest generated DMG and copies it to the current user’s Desktop.
- Added `Cargo.lock` for reproducible desktop builds.
- Fixed Rust lifetime issues caught during the native release build.
- Ignored Tauri generated build output so local release artifacts do not pollute normal source control.
- Produced a signed-status-neutral local DMG build artifact at `releases/Kairnly_1.0.0_aarch64.dmg`.

User-facing:

- Users can download the macOS DMG directly from the repository.
- Developers can run one command to produce a fresh DMG and copy it to Desktop.
- The generated installer uses the Kairnly name, Kairnly icon, and proper macOS productivity app metadata.

## Installation

Install dependencies:

```bash
npm install
```

Run browser preview:

```bash
npm run dev
```

Run desktop app:

```bash
npm run desktop
```

Build frontend:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Build macOS DMG

Required environment: macOS with Rust/Cargo installed.

Download the current bundled DMG from:

```text
releases/Kairnly_1.0.0_aarch64.dmg
```

To produce a fresh local DMG build:

```bash
npm run build:dmg:desktop
```

The generated `.dmg` is copied to the current user’s Desktop after a successful build.

This local build is unsigned by default. macOS may show a security warning on first launch. For public distribution, Apple Developer ID signing and notarization are recommended.

## Desktop Build Requirements

To run or build the Tauri desktop app, Rust and Cargo must be installed.

Check:

```bash
rustc --version
cargo --version
```

If Cargo is missing, install Rust from:

```text
https://www.rust-lang.org/tools/install
```

## Current Notes

- The browser preview is useful for UI development but is not the final persistence target.
- The desktop app uses SQLite.
- Cloud sync is intentionally not included.
- JSON backup/import is the manual portability path.
- PDF export is client-side and lazy-loaded.

## License

Kairnly is released under the MIT License. See [LICENSE](./LICENSE).
