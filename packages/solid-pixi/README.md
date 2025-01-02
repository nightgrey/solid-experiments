# solid-pixi

> An experimental, high-performance fork of solid-pixi

This is an unofficial, experimental fork of [solid-pixi](https://github.com/sammccord/solid-pixi) implemented using a custom renderer built with `solid-js/universal`. This improves performance a lot, but was mainly made for myself. See the current limitations.

## Performance improvements

- Uses Solid.js's native `spread` for prop updates to Pixi.js instances
- Proper parent-child relationships through custom Solid renderer implementation
- Reactive computations are paused when `renderable={false}` is set.
- Removed Graphics `draw` prop. Use `<Graphics ref={(instance) => instance.lineTo(/*...*/)} />` or `createEffect(() => instance.lineTo(/*...*/))` to draw.

## Notable Changes

- Added `<Portal />` component
- Streamlined API focused on core functionality
- Events are currently not passed to Pixi.js instances (can be enabled by checking for `on` in renderer's spread)
- Components in the `untouched` folder are not implemented

## Current Limitations

- Customized for specific use cases - not all original features are implemented
- Type system issues (components don't return valid JSX.Element)
- JSX runtime integration needs work:
  - Components are not intrinsic elements (must be imported)
  - TypeScript complains about JSX.Element return types
  - JSX runtime pragma comment may not work in some setups

## Usage

Since this is experimental and not published, the recommended approach is to copy the relevant parts into your project directly.

If you tell NPM where the package is via `workspaces` in your `package.json`, you can import the components as if they are from a regular NPM package:

**package.json**
```json
{
  "workspaces": [
    "packages/*"
  ],
  "dependencies": {
    "@nightgrey/solid-pixi": "workspace:*"
  }
}
```


**App.tsx**
```tsx
import { Application, Container } from '@nightgrey/solid-pixi'

function App() {
  return (
    <Application>
      <Container x={100} y={100}>
        {/* Your Pixi.js content */}
      </Container>
    </Application>
  )
}
```
