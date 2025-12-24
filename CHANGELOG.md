# Changelog

All notable changes to antoniosarro.dev are documented here. Check it out at antoniosarro.dev/changelog.

---

<!--CHANGELOG_ENTRY_START-->

## [1.0.1] - 2025-12-24

@@title:Holiday Effects & Improvements@@

Minor release with seasonal visual effects and code quality improvements.

### ::added::
- **Christmas snow effect component for holiday period**
  ``src/lib/components/shared/effects/Snow.svelte``
- **Fireworks effect component for New Year's Day**
  ``src/lib/components/shared/effects/Fireworks.svelte``
- **Custom Giscus component with store and types**
  ``src/lib/components/shared/Giscus.svelte``
  ``src/lib/stores/giscus.svelte.ts``
  ``src/lib/types/giscus.ts``

### ::fixed::
- **Overall codebase linting and formatting fixes**

<!--CHANGELOG_ENTRY_END-->

<!--CHANGELOG_ENTRY_START-->

## [1.0.0] - 2025-12-18

@@title:Stable Release@@

The first stable release of antoniosarro.dev is here! This marks the official launch of my personal portfolio and blog, built from scratch with SvelteKit, featuring custom MDX processing, aggressive font optimization, and a nightly rebuild strategy for fresh content.

### ::added::

- **Personal portfolio website** with blog, projects, and about sections
- **Custom MDX processor** with syntax highlighting, line numbers, and code block titles
- **Blog system** with series support, tag filtering, search, and reading progress indicator
- **GitHub integration** for contribution graph and project showcases
- **Dark/light theme** with system preference detection and cookie persistence
- **Mobile-responsive design** with slide-out navigation drawer
- **Font optimization pipeline** using pyftsubset for 66% size reduction
- **Image optimization** with AVIF/WebP generation and lazy loading
- **RSS feed** and sitemap generation for SEO
- **Giscus comments** integration for blog discussions
- **Changelog system** with timeline view and detailed modal
- **View transitions** for smooth page navigation

<!--CHANGELOG_ENTRY_END-->