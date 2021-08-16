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
        {props.children.map((child) => {
          return <TabPanel>{child}</TabPanel>;
        })}
      </TabPanels>
    </Tabs>
  );
};

const TabsAboveCode = (props) => {
  return (
    <Tabs>
      <TabList>
        {props.children.map((child) => {
          const [language] = child.props.children.props.className
            .replace(/language-/, ``)
            .split(` `);
          return <Tab>{language}</Tab>;
        })}
      </TabList>

      <TabPanels>
        {props.children.map((child) => {
          return <TabPanel>{child}</TabPanel>;
        })}
      </TabPanels>
    </Tabs>
  );
};

const TabsInTitle = ({ children, values }) => {
  const codeTitles = children.map(
    (child) => child?.props?.children?.props?.title
  );
  const tabLabels = children.map((child) =>
    child?.props?.children?.props?.className.replace(/language-/, ``).split(` `)
  );

  const [tabIndex, setTabindex] = useState(0);
  const [title, setTitle] = useState(codeTitles[0]);

  const handleTabsChange = (index) => {
    setTabindex(index);
    setTitle(codeTitles[index]);
  };

  return (
    <Tabs index={tabIndex} onChange={handleTabsChange}>
      <div sx={{ display: "flex", variant: `styles.CodeBlock.title` }}>
        <div sx={{ flex: 1 }}>{title}</div>
        <TabList
          sx={{
            color: "mutedText",
            "[data-selected]": { color: "mutedPrimary" },
          }}
        >
          {tabLabels.map((label) => (
            <Tab key={label}>{label}</Tab>
          ))}
        </TabList>
      </div>
      <TabPanels>
        {children.map((child) => {
          // split off title so the CodeBlock from the theme doesn't render a header, this component does that and add language tabs
          const { title, ...blockProps } = child.props.children.props;
          return (
            <TabPanel key={blockProps.className}>
              <CodeBlock {...blockProps} />
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
};

export { FirstAttempt, HardCodedTabsAboveCode, TabsAboveCode, TabsInTitle };
