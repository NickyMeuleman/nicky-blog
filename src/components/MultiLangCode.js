/** @jsx jsx */
import { jsx } from "theme-ui";
import { useState, useMemo } from "react";
import { CodeBlock } from "@nickymeuleman/gatsby-theme-blog";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import "@reach/tabs/styles.css";

const MultiLangCode = ({ children, values }) => {
  const codeblocks = useMemo(() => {
    return (
      children
        // zip children array and values array together
        .map((child, idx) => [child, values?.length >= idx && values[idx]])
        // returns an object per child where the items in the values array take precedence over child properties
        .map(([child, value]) => {
          const codeBlockProps = child?.props?.children?.props;
          const [language] = codeBlockProps.className
            .replace(/language-/, ``)
            .split(` `);
          // split off title from the props so it isn't used later, the title prop controls CodeBlock having a header and that's this component's responsibility now
          const { title, ...blockProps } = codeBlockProps;
          return {
            title: value?.title || title,
            label: value?.label || language,
            blockProps,
          };
        })
    );
  }, [children, values]);

  const [tabIndex, setTabindex] = useState(0);
  const handleTabsChange = (index) => {
    setTabindex(index);
  };

  return (
    <Tabs index={tabIndex} onChange={handleTabsChange}>
      <header
        sx={{
          display: `flex`,
          alignItems: `center`,
          variant: `styles.CodeBlock.title`,
        }}
      >
        <div sx={{ flex: 1 }}>{codeblocks[tabIndex].title}</div>
        <TabList
          sx={{
            color: `mutedText`,
            "[data-selected]": { color: `mutedPrimary` },
          }}
        >
          {codeblocks.map(({ label }) => (
            <Tab key={label}>{label}</Tab>
          ))}
        </TabList>
      </header>
      <TabPanels>
        {codeblocks.map((block) => {
          const { blockProps } = block;
          const preToCodeBlock = (preProps) => {
            if (preProps) {
              const {
                children: codeString,
                className = ``,
                ...props
              } = preProps;
              const match = className.match(/language-([\0-\uFFFF]*)/);

              return {
                codeString: codeString?.trim() ?? ``,
                className: className,
                language: match !== null ? match[1] : ``,
                ...props,
              };
            }

            return undefined;
          };
          const props = preToCodeBlock(blockProps);
          return (
            <TabPanel key={block.label}>
              <CodeBlock {...props} />
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
};

export { MultiLangCode };
