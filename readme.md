# Node HBS templating engine

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

You only need location of views folder.

- It needs to be an absolute path.
- all the partials and layouts should be inside the views folder.
- partials will be automatically registered.
- Default layout is main.hbs. But you can change it by passing `layoutName` in `render` method. e.g `hbs.render("home", data, "myLayout")`

Directory Structure

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
