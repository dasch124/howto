<!--lint disable first-heading-level-->

# ACDH-CH Learning resources

## View content

Visit the website at [https://howto.acdh.oeaw.ac.at](https://howto.acdh.oeaw.ac.at).

## Contribute content

### Contribute or edit content via CMS

Sign-in to the CMS via [https://howto.acdh.oeaw.ac.at/cms]. You'll need a GitHub account and be a
member of the [ACDH-CH GitHub organization](https://github.com/acdh-oeaw/).

For edits to articles you can also directly click the "Suggest changes to this resource" links at
the bottom of each post.

### Run a local CMS backend

You can run a local CMS backend which writes directly to the filesystem, and does not require
authentication, with `npm run cms:dev`. Then start a development server with `npm run dev` and visit
[http://localhost:3000/cms](http://localhost:3000/cms). Don't forget to commit and push changes via
`git`.

### Use your favourite text editor

Content is saved to `.mdx` files in the `content/posts` folder, and you can use your favourite text
editor to make changes and commit via `git`. When using VS Code you can install the recommended
extensions to get linting aud auto-formatting for Markdown.

### Contributing guidelines

When contributing content directly via `git`, please use feature branches and don't push to `main`,
to allow for review.

### Note on writing Markdown

Content is saved in [MDX format](https://mdxjs.com/), which is Markdown with custom JavaScript
components. Most Markdown syntax is supported, however there are
[subtle parsing differences](https://github.com/micromark/mdx-state-machine#72-deviations-from-markdown)
to be aware of. Most notably: the "lesser than" sign `<` needs to be HTML-escaped to `&lt;` (because
it signifies the start of a custom component), and similarly "autolinks" (`<https://example.com>`
instead of `[https://example.com](https://example.com)`) are not allowed.
