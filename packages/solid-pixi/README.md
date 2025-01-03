# solid-pixi

> An experimental, high-performance fork of solid-pixi

This is an unofficial, experimental fork of [solid-pixi](https://github.com/sammccord/solid-pixi) implemented using a custom renderer built with `solid-js/universal`. This improves performance a lot, but was mainly made for myself. See the current limitations.

## Performance improvements

- Uses Solid.js's native `spread` for prop updates to Pixi.js instances, which handles diffing much faster than I could do it myself.
- Proper parent-child relationships through custom Solid renderer implementation (previously lead to lost reactive owners)
- Reactive computations are paused when `renderable={false}` is set.
- Removed Graphics `draw` prop. Use `<Graphics ref={(instance) => instance.lineTo(/*...*/)} />` to draw. Much more performant. Will auto-pause computation when using `ref` and setting `renderable={false}`, too. Alternatively, use `createEffect(() => instance.lineTo(/*...*/))` (set instance via `<Graphics as={instance} />`).

## Notable Changes

- Added `<Portal />` component
- Streamlined API focused on core functionality
- `Assets` => `useAssets` & `useAsset`
- Events are currently not passed to Pixi.js instances (can be rather easily added by handling them in the renderer's spread (see solid-js/web for inspiration))
- Components in the `untouched` folder are not implemented
- Added ability to use `setSize` (faster than setting width & height individually) via `size` prop, i.e. `size={{ width: 100, height: 100 }}`

## Current Limitations

- Customized for specific use cases - not all original features are implemented (events, components under `untouched/` folder)
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

## Todo & Notes

Sam, the maintainer of solid-pixi, would be happy to upstream this. These are personal TODO notes to finish a PR.

- [ ] Add the rest of the elements
- [ ] Handle event props
- [ ] Expose ways to use all assets functions (load, add, bundle, etc) via hooks
- [ ] Properly set up solid-js/universal / jsx-runtime
  - Fix types
  - Set up bundling by configuring vite/babel solid-js plugin to use our renderer (see references)
- Avoid exception when hot reloading

### References

I found an example of a Vite and Babel config @  https://github.com/whoisryosuke/solid-universal-renderer-template/blob/main/packages/demo/vite.config.js.

Additionally, some other universal implementations:
- https://github.com/devinxi/vinxi/tree/main/packages/solid-three
- https://github.com/SudoMaker/dominative-solid
- https://github.com/devinxi/solid-ink/tree/e789c37f6685e9e03abbf918303abc5656d9c9c3, https://whoisryosuke.com/blog/2022/ditch-the-dom-with-solidjs-and-skia-canvaskit/


