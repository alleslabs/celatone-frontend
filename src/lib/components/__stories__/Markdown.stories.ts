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

export const Heading: Story = {
  args: {
    markdown: `# This is an H1 Header
    ## This is an H2 Header
    ### This is an H3 Header
    #### This is an H4 Header
    ##### This is an H5 Header
    ###### This is an H6 Header`,
  },
};

export const Paragraph: Story = {
  args: {
    markdown: `This is the first line of the paragraph.  
    And this is the second line on the same paragraph, separated by a line break.
    
    This is a new paragraph.`,
  },
};

export const Link: Story = {
  args: {
    markdown: `## Links

    [This is a link](http://www.celat.one)`,
  },
};

export const Blockquote: Story = {
  args: {
    markdown: `> This is a blockquote.`,
  },
};

export const InlineCode: Story = {
  args: {
    markdown: "This is an inline `code`.",
  },
};

export const CodeBlock: Story = {
  args: {
    markdown: `\`\`\`javascript
    function fibonacci(n) {
        if (n <= 1) {
            return n;
        }
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    for (let i = 0; i <= 10; i++) {
        console.log(\`Fibonacci of \${i} is \${fibonacci(i)}\`);
    }
    \`\`\``,
  },
};

export const Emphasis: Story = {
  args: {
    markdown: `## Emphasis

    *This text will be italic*
    _This will also be italic_
    
    **This text will be bold**
    __This will also be bold__
    
    _You **can** combine them_
    `,
  },
};

export const List: Story = {
  args: {
    markdown: `## Lists

    ### Unordered
    
    * Item 1
    * Item 2
      * Item 2a
      * Item 2b
    
    ### Ordered
    
    1. Item 1
    2. Item 2
    3. Item 3
    `,
  },
};

export const Table: Story = {
  args: {
    markdown: `# Example Markdown with Table

    This is an example of a table in a Markdown document:
    
    | Header 1    | Header 2    | Header 3    |
    |-------------|-------------|-------------|
    | Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3 |
    | Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |
    | Row 3 Col 1 | Row 3 Col 2 | Row 3 Col 3 |`,
  },
};
