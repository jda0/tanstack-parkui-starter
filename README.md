Welcome to your new TanStack app!

# Getting Started

To run this application:

```bash
npm install
npm run start
```

# Building For Production

To build this application for production:

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

## File Aliasing

In Typescript and Javascript files, prefer using aliases to absolute or relative (non-sibling) imports.

- `lib/` is aliased to `$/`
- `src/` is aliased to `@/`

## Replacing a dependency

These dependencies were chosen for their focus and modularity. Replacing a component (even the UI reactivity framework) should not pose a great chore (in comparison to, e.g., the migration from Chakra 2 → 3 or NextJS → React Router).

For example:

- Tanstack Router (the routing library) supports both React and Solid as of writing;
- ParkUI (the component library, which extends [Ark](https://ark-ui.com/) and [Panda CSS](https://panda-css.com/docs)) additionally supports Vue 3, while Ark additionally Svelte.
- Lucide (the icon library) can be used directly as SVGs, and provides components for React, Solid, Vue, Svelte, Angular, Preact, React Native and Astro.
- Vite is framework and backend agnostic, and should be replacable with another build tool such as [rsbuild](https://rsbuild.rs/).

## Component Styling

This project uses [Park UI](https://next.park-ui.com/docs/) for component styling.
Install components from the Park UI repository with:

```bash
npx -y @park-ui/cli components add ‹component›
```

> [!CAUTION]
> Park UI v1 is currently in development the CLI is not stable. All recipes have
> been installed already.

Recipes installed from Park UI should be saved to `lib/park-ui`.

Park is built on Panda CSS, which stores generated files in `lib/panda.gen`. Panda should be familiar to anyone coming from other CSS-in-JS frameworks like Stitches, style-prop based frameworks like Chakra, and/or Tailwind.

[Semantic tokens](https://park-ui.com/docs/theme/semantic-tokens) are available for:

- **borderRadius**: `l1`—`l3` (increase when wrapping other elements)
- **boxShadow**: `xs`—`2xl`
- **theme colors**: `‹ctx›.‹mod›`;
  - `ctx` can be one of: `bg`, `fg`, `accent`, `border`, `colorPalette`;
    - If using `colorPalette`, it should be assigned to a [palette color](https://park-ui.com/docs/theme/colors) in the same or a parent component, e.g.

      ```tsx
      import { css } from `$/panda.gen/css`

      // react
      function Component() {
        return <div className={css({ background: 'colorPalette.5', colorPalette: 'indigo' })}>;
      }
      ```

  - `mod` can be one of:
    - `default`, `muted`, `subtle`, `disabled`, `outline` or `error`;
    - `.a‹1-12›` for a level in the alpha-based palette, e.g. `green.a10`;
    - `.‹1-12›` for a level in the opaque palette, e.g. `red.3`.
    - an opacity modifier can also be applied as a suffix of the form `/‹%›`, e.g. `red.9/50`, see [the Panda docs](https://panda-css.com/docs/concepts/color-opacity-modifier) for details.

See the Panda docs for other features, including:

- [Helpers](https://panda-css.com/docs/concepts/patterns) to simplify common class combinations, such as `container()` and `grid({…})`.

- [Utilities](https://panda-css.com/docs/utilities/typography), such as `bgGradient` and `borderX`, to map css properties to semantic tokens and simplify aliasing.

- Variant recipes via [CVA](https://panda-css.com/docs/concepts/recipes), and for multi-part components via [SVA](https://panda-css.com/docs/concepts/slot-recipes), to help map component props to classes.

### Main Differences from Chakra

- Presentational attributes (like `background`) are controlled via `className`. Pass them as an object to the `css` helper (exported from `lib/panda.gen/css`), e.g.:

```tsx
import { css } from `$/panda.gen/css`

// react
function Component() {
  return <div className={css({ background: 'bg.default' })}>;
}
```

- Panda can use style props, but that feature is disabled in this project with the exception of `css` and those explicitly exported by ParkUI (such as `variant`);
  `css={…}` is equivalent to `className={css(…)}`. Patterns are accessible as JSX elements (e.g. `<div className={center(…)}>…</div>` as `<Center css={…}>…</Center>`).

### Main Differences from Tailwind

- Presentational attributes are passed as an object to the `css` helper instead of directly as classes. (see example above).

- The color palette's levels are identified from 1 to 12 instead of 100 to 900.

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:

```bash
npm run lint
npm run format
npm run check
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router) as a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).
