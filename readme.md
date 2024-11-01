# Node HBS templating engine

A Node.js framework agnostic library for handlebars template engine

## Installation

```bash
npm install node-hbs handlebars
```

## Usage

```ts
import { NodeHbs } from "node-hbs";
import { join } from "node:path";

const hbs = new NodeHbs({
	viewsPath: join(import.meta.dirname, "..", "views"),
});

```

## Use

This library can be used in any Node.js application.

You only need location of views folder.

- It needs to be an absolute path.
- all the partials and layouts should be inside the views folder.
- partials will be automatically registered.

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
