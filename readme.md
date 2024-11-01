# Node HBS - Handlebars templating engine

A Node.js framework agnostic library for handlebars template engine

## Installation

```bash
npm install node-hbs handlebars
```

## Usage

An example with Hono and complete code is available in [example](https://github.com/siddiquipro/node-hbs/tree/main/example).

```ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { NodeHbs } from "node-hbs";
import { join } from "node:path";

const hbs = new NodeHbs({
	viewsPath: join(import.meta.dirname, "..", "views"),
});

const app = new Hono();

app.get("/", (c) => {
	return c.html(hbs.render("home", { title: "..." }));
});

serve(app);
```

## Use

This library can be used in any Node.js application.

- You only need location of views folder. It needs to be an absolute path.
- All handlebar files must end with `.hbs`.
- All the partials and layouts should be inside the views folder.
- Partials will be automatically registered.
- Default layout is main.hbs. But you can change it by passing `layoutName` in `render` method. e.g `hbs.render("home", data, "myLayout")`

### Props

- `viewsPath`: Absolute Path to views folder (required)
- `partialsPath`: Absolute Path to partials folder (default: `views/partials`)
- `layoutsPath`: Absolute Path to layouts folder (default: `views/layouts`)
- `defaultLayout`: Name of default layout (default: `main`)
- `externalPartialPaths`: List of external partials absolute paths (default: `[]`)

### Available methods

- `render(name: string, data: HbsData = {}, layoutName: string | null = defaultLayout): string` - Render page with handlebars data
- `registerHelper(name: string, fn: (...args: any[]) => any): void` - Register handlebars helper
- `registerPartial(path: string): void` - Register handlebars partial
- `getRegisteredPartialNames(): Array<{ path: string, name: string }>` - Get registered partial names and absolute paths

### Directory Structure

```bash
├── src
│   └── index.ts
└── views
    ├── layouts
    │   └── main.hbs
    ├── partials
    │   └── footer.hbs
    └── home.hbs
```

## Layouts

The default layout is `main.hbs`. You can change the layout for each page by passing `layoutName` in `render` method. e.g `hbs.render("home", data, "myLayout")`. To change the default layout, pass `defaultLayout` in constructor. e.g `new NodeHbs({ defaultLayout: "myLayout" })`

Whenever you create a layout make sure it has `mainSlot` in it.

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Example</title>
		<script src="https://cdn.tailwindcss.com"></script>
	</head>
	<body class="bg-gray-100">
		<main class="container mx-auto py-4">{{{ mainSlot }}}</main>
	</body>
</html>

```

## Partials

The partials are loaded from `partials` folder. You can also add partials by calling `registerPartial` method. e.g `hbs.registerPartial(join(import.meta.dirname, "..", "node_modules" , "package"))`

The registerPartial will load all the partials from the path supplied and if these are folders then will be loaded recursively for all hbs files and register them.

All the partials are registered with the name of the partial file. Please ensure the name are distinct.

## Views

The views are loaded from the root of `views` folder.
