Angular storefront

Apply these conventions throughout the repository. They cover every route, reusable component, dialog, and application state. Keep each change scoped to the requested feature. Use the repository's package manager, scripts, and naming conventions.

Layout must follow the available space

Design each component to work across a continuous range of container widths and heights. The same component must remain usable on its own page, in a narrow sidebar, and inside a dialog on a wide display.

Do not author CSS or SCSS media queries. Do not introduce device categories, breakpoint mixins, viewport-width checks, or alternate mobile and desktop component trees.

Choose layout units by purpose. Use logical properties for sizing and spacing, rem-based tokens for spacing and type, ch for readable line lengths, fr for flexible grid tracks, and percentages for parent-relative dimensions. Use clamp() for bounded fluid values. Keep the root font size responsive to user preferences.

Use wrapping Flexbox for action groups and navigation. Use intrinsic Grid for repeated items. Choose a minimum track size from the content a card needs and cap it at the space the parent can supply. A catalog grid can use repeat(auto-fit, minmax(min(100%, var(--product-card-min)), 1fr)).

Allow grid and flex children to shrink with min-inline-size: 0 where needed. Let long names, localized labels, prices, and validation messages wrap. Keep actions reachable when text grows or the viewport height shrinks.

Use a shared maximum content width and fluid gutters on wide displays. Let content determine block size. Give images an intrinsic size or aspect ratio, scale them within the container, and use NgOptimizedImage when appropriate.

Keep page content free of horizontal scrolling. If a genuinely two-dimensional element needs local scrolling, contain it within that element and keep it keyboard accessible. Never hide page overflow to conceal a layout defect.

Feature ownership and directory structure

Organize by business feature first, then by responsibility inside each feature. A feature is a folder boundary and can expose standalone routes. Create a directory when it has an actual member.

src/app/
  core/
    config/
  shared/
    components/
    pipes/
  features/
    catalog/
      pages/
      components/
      models/
      interfaces/
      services/
      mappers/
      catalog.routes.ts
    cart/
    checkout/
  app.config.ts
  app.routes.ts

Pages coordinate routed workflows. Components render UI and emit user intent. Services own data access or feature state. Models describe domain data. Interfaces describe external payloads or behavioral contracts. Add a mapper when the transport and domain shapes differ. Keep product details within the catalog unless it develops an independent responsibility.

Keep feature-specific code with its owner. Reuse one authoritative model for each domain concept. Promote UI to shared when multiple features need the same behavior. Keep application-wide configuration in core. Avoid cross-feature imports of private components and services.

Angular 22 and state

Use Angular 22, a compatible Angular Material release, strict TypeScript, strict template checking, and standalone components. Omit redundant standalone: true metadata. Preserve Angular 22's default change detection.

Use external HTML templates and SCSS files, inject() for dependencies, input() and output() for component contracts, and component host metadata for host bindings. Use built-in template control flow and track mutable collections by stable IDs.

Give each piece of state one owner. Use signal() for mutable state and computed() for synchronous derivations. Expose read-only signals from services and explicit methods for changes. Reserve effect() for side effects such as cart persistence.

Use httpResource() for reactive HTTP reads and resource() for other asynchronous reads. Derive request parameters from signals. Skip reads until required inputs exist. Respect cancellation when implementing a loader. Render loading, error, empty, and success states, and provide retry for recoverable failures.

Perform writes through explicit service methods. Adding a cart item or placing an order must happen only in response to the intended command. Prevent duplicate submissions and preserve user input when a request fails.

Use lazy feature routes and typed reactive forms. Keep pricing rules and data transformations outside templates. Avoid manual subscriptions when signals, resources, or the async pipe cover the lifecycle.

Styling, values, and accessibility

Use Angular Material controls and public theming APIs. Define shared design tokens for color, typography, spacing, radius, elevation, content width, and reusable layout dimensions. Use BEM for custom component styles. Avoid private Material selectors, duplicated SCSS, and ng-deep.

Keep product data in the data source, API endpoints and locale settings in configuration, business limits with their domain owner, and user-facing copy in the project's localization mechanism. Keep fixtures outside components. Use currency formatting and one consistent representation of monetary amounts.

Avoid hardcoded business values and arbitrary styling numbers. Structural CSS values such as zero, 100%, or 1fr may stay at the point of use. Give meaningful reusable values descriptive names.

Write self-explanatory TypeScript, HTML, and SCSS. Do not generate code comments. Put setup and usage instructions in the README.

Meet WCAG AA requirements. Use semantic landmarks, native interaction semantics, meaningful labels, visible keyboard focus, and accessible form errors. Preserve logical reading and tab order as the layout reflows. Verify dialog focus entry, containment, and return.

Storefront behavior

Preserve the catalog-to-checkout journey whenever a change touches it. Keep search, filters, and sorting shareable through URL state. Handle unavailable products and unknown product routes. Derive the basket badge, line totals, and order total from the cart state. Validate persisted cart data before restoring it and recheck quantity limits as stock changes. For a demo without a backend, isolate fixtures behind a typed data-access service and keep checkout free of real payment details.

Verification before handoff

Run the repository's production build and relevant configured checks. Exercise changed behavior through its normal user entry point.

For UI changes, continuously resize the affected page and its containing element. Inspect widths immediately before and after content wraps. Exercise short viewports, wide layouts, enlarged text, 200% browser zoom, long content, and keyboard navigation. Device presets may supplement this check.

Verify that controls remain visible, text stays readable, focus remains reachable, and the page has no unintended horizontal overflow. Check loading, error, and empty states wherever the change affects them.

Report the checks performed, the results, and any checks that could not be run.