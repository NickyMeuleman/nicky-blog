/** @jsx jsx */
import { jsx } from "theme-ui";
import { useState } from "react";
import { CodeBlock } from "@nickymeuleman/gatsby-theme-blog";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import "@reach/tabs/styles.css";

const MultiLangCode = ({ children, values }) => {
  const [tabIndex, setTabindex] = useState(0);
  const [title, setTitle] = useState(() => {
    // give priority to titles passed via to values prop
    // there is a clean way to write this but I just want this to work.
    let firstTitle = "";
    if (children && children[0]?.props?.children?.props?.title) {
      firstTitle = children[0]?.props?.children?.props?.title;
    }
    if (values && values[0].title) {
      firstTitle = values[0].title;
    }
    return firstTitle;
  });

  const codeTitles =
    values?.map((value) => value.title) ??
    children.map((child) => child?.props?.children?.props?.title);

  const tabLabels =
    values?.map((value) => value.label) ??
    children.map((child) =>
      child?.props?.children?.props?.className
        .replace(/language-/, ``)
        .split(` `)
    );

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
          // eslint-disable-next-line
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

export { MultiLangCode };
