# @nightgrey/styled

An experimental collection of styling utilities for SolidJS, inspired by popular libraries like cva and styled-components.

## Features
- `cva` & `cx`: Classic `cva` and `cx` utilities, with a few modifications
- `sva`: An utility inspired by [panda's slot recipes](https://panda-css.com/docs/concepts/slot-recipes)
- `styled`: Factory function to create styled components with variant support
- `Dynamic`: `@corvu/utils/dynamic` with `asChild` support

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
    "@nightgrey/styled": "workspace:*"
  }
}
```

## Core Components

### cva (Class Variance Authority)
Located in `cva.ts`, this is a modified port of [cva](https://github.com/joe-bell/cva) for SolidJS. It allows you to create component variants using class names.

```tsx
const button = cva({
  base: "button-base",
  variants: {
    intent: {
      primary: "button-primary",
      secondary: "button-secondary"
    }
  }
});
```

### cx
This utility handles class name composition, similar to clsx/classnames.

```tsx
cx("base", condition && "active", ["nested", "classes"]); // => "base active nested classes"
```

### styled
This provides a styled-components like API for creating variant-based components.

```tsx
const Button = styled.button(buttonCva);
<Button intent="primary">Click me</Button>
```

### sva (slot variance authority)
A utility inspired by [panda's slot recipes](https://panda-css.com/docs/concepts/slot-recipes). They allow you to style multi-slot components. Based on `cva`.

```tsx
export const toast = sva({
    class: "toast",
    slots: [
        "root",
        "title",
        "description",
    ],
    base: {
        root: [
            "bg-bg-default",
            "shadow-lg ",
            "p-4"
        ],
        title: ["font-semibold", "text-sm"],
        description: ["text-sm"],
    },
    variants: {
        type: {
            info: {
                root: ["bg-bg-info"],
                title: ["text-fg-info"],
                description: ["text-fg-info"],
            },
            success: {
                root: ["bg-bg-success"],
                title: ["text-fg-success"],
                description: ["text-fg-success"],
            },
            warning: {
                root: ["bg-bg-warning"],
                title: ["text-fg-warning"],
                description: ["text-fg-warning"],
            },
            error: {
                root: ["bg-bg-error"],
                title: ["text-fg-error"],
                description: ["text-fg-error"],
            },
        },
    }
});

const styles = toast({ type: "success" });

// styles.root => "bg-bg-success shadow-lg p-4"
// styles.title => "font-semibold text-sm text-fg-success"
// styles.description => "text-sm text-fg-success"
```

### Dynamic
Located in `dynamic.tsx`, extends @corvu/utils/dynamic with an `asChild` prop for better component composition.  Used within the `styled` factory.

```tsx
<Dynamic as={Component} asChild={props => <Component {...props} />} />
```
