/*eslint-disable */
/** @jsx jsx */
import { jsx } from "theme-ui";
import { useState } from "react";
import { CodeBlock } from "@nickymeuleman/gatsby-theme-blog";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import "@reach/tabs/styles.css";

const FirstAttempt = (props) => {
  return (
    <Tabs>
      <TabList>
        <Tab>1</Tab>
        <Tab>2</Tab>
        <Tab>3</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>{props.children[0]}</TabPanel>
        <TabPanel>{props.children[1]}</TabPanel>
        <TabPanel>{props.children[2]}</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

const HardCodedTabsAboveCode = (props) => {
  return (
    <Tabs>
      <TabList>
        <Tab>1</Tab>
        <Tab>2</Tab>
        <Tab>3</Tab>
      </TabList>

      <TabPanels>
        {props.children.map((child, idx) => {
          return <TabPanel key={idx}>{child}</TabPanel>;
        })}
      </TabPanels>
    </Tabs>
  );
};

const TabsAboveCode = (props) => {
  return (
    <Tabs>
      <TabList>
        {props.children.map((child, idx) => {
          const [language] = child.props.children.props.className
            .replace(/language-/, ``)
            .split(` `);
          return <Tab key={idx}>{language}</Tab>;
        })}
      </TabList>

      <TabPanels>
        {props.children.map((child, idx) => {
          return <TabPanel key={idx}>{child}</TabPanel>;
        })}
      </TabPanels>
    </Tabs>
  );
};

const TabsInTitle = ({ children }) => {
  const codeblocks = children.map((child) => {
    const codeBlockProps = child?.props?.children?.props;
    const [language] = codeBlockProps.className
      .replace(/language-/, ``)
      .split(` `);
    // split off title from the props so it isn't used later, the title prop controls CodeBlock having a header and that's this component's responsibility now
    const { title, ...blockProps } = codeBlockProps;
    return {
      title,
      label: language,
      blockProps,
    };
  });

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
          {codeblocks.map(({ label }, idx) => (
            <Tab key={idx}>{label}</Tab>
          ))}
        </TabList>
      </header>
      <TabPanels>
        {codeblocks.map((block, idx) => {
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
            <TabPanel key={idx}>
              <CodeBlock {...props} />
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
};

export { FirstAttempt, HardCodedTabsAboveCode, TabsAboveCode, TabsInTitle };
