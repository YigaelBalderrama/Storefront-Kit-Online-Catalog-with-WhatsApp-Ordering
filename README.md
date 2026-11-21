# OnlineStore

## Catálogo

La ruta inicial `/` redirige a `/catalogo`, una ruta de carga diferida con tarjetas de producto.
Cada tarjeta muestra una ilustración local, nombre, descripción, precio y stock, incluyendo productos agotados.
Los seis productos son datos de demostración en `src/app/features/catalog/data/products.ts`, aislados detrás del servicio `Catalog`.
Los precios usan unidades monetarias en bolivianos; moneda y locale se configuran en `src/app/core/config/store.config.ts`.
Los textos de interfaz en español se centralizan en `src/app/features/catalog/catalog.copy.ts`.
La cuadrícula se adapta al contenedor sin media queries. El catálogo contempla carga, error con reintento y lista vacía.

El catálogo muestra 3 productos por página por defecto. Las opciones de `catalog.config.ts` se limitan al total de productos, sin duplicados; con seis productos se ofrecen 3 y 6.
El selector aparece encima de las tarjetas y la navegación inferior solo se muestra cuando hay más de una página.
La barra superior compartida permanece visible al hacer scroll y ofrece acceso al carrito con `mat-icon` y el contador de unidades en su tooltip.

Las acciones usan iconos de fuente de Angular Material (`mat-icon`) con tooltips y etiquetas accesibles. La fuente Material Icons se carga desde Google Fonts en `src/index.html` y requiere conexión. No se usan SVG dentro de los botones.
Las secciones (categorías) se muestran a la derecha del catálogo y pasan debajo cuando el contenedor necesita más espacio. Por defecto se muestran todas.
Las casillas permiten seleccionar varias categorías simultáneamente. «Todas las secciones» permite marcarlas o desmarcarlas juntas y muestra un estado intermedio si solo algunas están seleccionadas.
El filtro se comparte repitiendo `seccion` (por ejemplo, `/catalogo?seccion=Hogar&seccion=Moda`), vuelve a la primera página al cambiar y ajusta la paginación a los resultados. Sin parámetro se muestran todas; `seccion=` conserva una selección vacía.
La página y el tamaño se comparten en la URL (`/catalogo?pagina=2&cantidad=3`). Los parámetros inválidos usan valores seguros.

## Carrito

La ruta `/carrito` permite aumentar o reducir cantidades, eliminar productos y vaciar el carrito. El enlace del catálogo muestra el número total de unidades.
Cada unidad añadida descuenta una unidad de la disponibilidad mostrada. Quitar unidades las devuelve al catálogo; nunca se permite superar el stock.
Los subtotales y el total se derivan del mismo estado. Los productos agotados no se pueden añadir.
El carrito se guarda en `localStorage` con la clave `online-store.cart.v1`; solo se restauran cantidades enteras positivas de productos existentes, limitadas al stock actual.
Si el almacenamiento no está disponible, el carrito funciona durante la sesión. Este es un carrito de demostración local: no reserva inventario en un servidor ni procesa pagos.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

No end-to-end runner is configured in this project yet. The installed Playwright agent skill provides browser testing guidance; it does not install a project test suite.

## Code quality

Install the locked dependencies with `npm ci`.

The `prepare` script automatically activates the Husky Git hooks when installing dependencies. Before each commit, `.husky/pre-commit` runs `npm run lint` followed by `npm run format:check` across the project. Either failure blocks the commit. Fix reported issues with `npm run lint:fix` and `npm run format`, review and stage the changes, then retry the commit. To reactivate hooks in an existing checkout, run `npm run prepare`.

| Command                | Purpose                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `npm run lint`         | Check TypeScript and Angular templates, including accessibility rules; warnings fail the check. |
| `npm run lint:fix`     | Apply available ESLint fixes.                                                                   |
| `npm run format`       | Format source and configuration files with Prettier.                                            |
| `npm run format:check` | Check formatting without modifying files.                                                       |
| `npm run test:ci`      | Run the existing Angular/Vitest unit tests once.                                                |
| `npm run check`        | Run formatting, lint, unit tests, and the production build.                                     |

ESLint uses flat configuration in `eslint.config.mjs`, with Angular 22, TypeScript, and template accessibility recommendations. `eslint-config-prettier` disables conflicting formatting rules. Prettier owns formatting, uses the Angular HTML parser, and normalizes line endings to LF. Generated output, dependencies, lockfiles, and agent instructions are excluded from formatting.

VS Code recommends the Angular Language Service, ESLint, and Prettier extensions. Workspace settings enable formatting and ESLint fixes on explicit save.

## Agent skills

The following skills were installed for the current Codex user in `~/.codex/skills` and become available on the next turn:

- [angular-developer](https://github.com/angular/skills/tree/main/angular-developer): official Angular guidance, including unit testing, HTTP testing, routing tests, and end-to-end testing.
- [angular-material](https://github.com/angular-sanctuary/angular-agent-skills/tree/main/skills/angular-material): Material theming, components, CDK, and component harnesses. Its reference baseline is Angular Material 21; verify APIs against Angular 22 before use.
- [playwright](https://github.com/openai/skills/tree/main/skills/.curated/playwright): browser automation and interaction testing.

Skills are installed in the user's environment, not as npm dependencies. Repository instructions take precedence over their examples, including typed reactive forms, default Angular 22 change detection, and layouts without media queries.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
