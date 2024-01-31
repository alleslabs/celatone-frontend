import type { Meta, StoryObj } from "@storybook/react";

import { Markdown } from "../Markdown";

const meta: Meta<typeof Markdown> = {
  component: Markdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Markdown>;

const heading = `# This is an H1 Header
## This is an H2 Header
### This is an H3 Header
#### This is an H4 Header
##### This is an H5 Header
###### This is an H6 Header`;

const paragraph = `This is the first line of the paragraph.  
And this is the second line on the same paragraph, separated by a line break.

This is a new paragraph.`;

const emphasis = `## Emphasis

*This text will be italic*
_This will also be italic_

**This text will be bold**
__This will also be bold__

_You **can** combine them_
`;

const link = `## Links

[This is a link](http://www.celat.one)`;

const blockquote = `> This is a blockquote.`;

const inlineCode = "This is an inline `code`.";

const codeBlock = `\`\`\`javascript
function fibonacci(n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

for (let i = 0; i <= 10; i++) {
    console.log(\`Fibonacci of \${i} is \${fibonacci(i)}\`);
}
\`\`\``;

const list = `
## Lists

### Unordered

* Item 1
* Item 2
  * Item 2a
  * Item 2b

### Ordered

1. Item 1
2. Item 2
3. Item 3
`;

const table = `# Example Markdown with Table

This is an example of a table in a Markdown document:

| Header 1    | Header 2    | Header 3    |
|-------------|-------------|-------------|
| Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3 |
| Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |
| Row 3 Col 1 | Row 3 Col 2 | Row 3 Col 3 |`;

export const Heading: Story = {
  args: {
    markdown: heading,
  },
};

export const Paragraph: Story = {
  args: {
    markdown: paragraph,
  },
};

export const Link: Story = {
  args: {
    markdown: link,
  },
};

export const Blockquote: Story = {
  args: {
    markdown: blockquote,
  },
};

export const InlineCode: Story = {
  args: {
    markdown: inlineCode,
  },
};

export const CodeBlock: Story = {
  args: {
    markdown: codeBlock,
  },
};

export const Emphasis: Story = {
  args: {
    markdown: emphasis,
  },
};

export const List: Story = {
  args: {
    markdown: list,
  },
};

export const Table: Story = {
  args: {
    markdown: table,
  },
};
