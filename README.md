# .github

Organization-level configuration for **NEXFORM ROBOTICS**.

The file that matters here is [`profile/README.md`](profile/README.md): GitHub
renders it as the organization landing page at
<https://github.com/nexform-tech>.

Nothing else in this repository is product code or documentation for a product
line. The repository standards that every other repository follows live in
[`repo-template`](https://github.com/nexform-tech/repo-template).

## The stack diagram

The landing page embeds both color schemes of the organization's six-layer diagram,
[`profile/assets/stack-light.svg`](profile/assets/stack-light.svg) and
[`profile/assets/stack-dark.svg`](profile/assets/stack-dark.svg), and lets the reader's
theme pick between them through the HTML `<picture>` element. Edit the `LAYERS` and
`FLOWS` tables in
[`profile/assets/generate-stack-svg.mjs`](profile/assets/generate-stack-svg.mjs)
and regenerate both files instead of editing SVG coordinates by hand:

```bash
node profile/assets/generate-stack-svg.mjs
```

Node 18 or later; the script has no dependencies.
