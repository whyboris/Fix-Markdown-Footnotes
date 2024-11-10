[![npm version](https://badge.fury.io/js/fix-markdown-footnotes.svg)](http://badge.fury.io/js/fix-markdown-footnotes)

# Fix Markdown Footnotes

`fmf` is a *CLI* that will reorder foonotes chronologically.

```md
# Before

Hello[^7] world[^3]. These[^2] are[^2b] unordered.[^hi]

# After

Hello[^1] world[^2]. These[^3] are[^4] unordered.[^5]
```

## Try without installing

```sh
npx fix-markdown-footnotes your-file.md
```

## Install

```sh
npm install -g fix-markdown-footnotes
```

## Use

```sh
fmf article.md
```

or to fix all *Markdown* documents in your directory:

```sh
fmf *
```

If that fails, please try:

```sh
fmf '*'
```

## Algorithm

Using the `/(\[\^[^\]]*])/g` regex we detect all instances of footnotes and confirm there is an even number of matches. Then we generate replacement values (via mapping to intermediate unique hashes) starting with 1 in order of appearance. Finally we write the new file contents, replacing the old file.

## Developing

Run `npm start` to test locally. Pass in a file: `npm start test.md` to run the script on the file.

To install a custom version of `fmf`, adjust the script to your liking by editing `index.js` and then run `npm run global`. Now when you execute `fmf` you'll be running your version of the script.

## Notes

Read the *MarkdownGuide.org* details about [footnotes](https://www.markdownguide.org/extended-syntax/#footnotes).

- the CLI will ignore the *node_modules* folder
- the CLI will not change the order of the footnotes at the bottom of the document
- the CLI will not fix duplicate footnote numbers: having `Hi[^4] lol[^4]` is not proper Markdown.
