// todo: Prism? because https://stackoverflow.com/a/76171632

interface Props {
  codeString: string;
  title: string | undefined;
  lang: string | undefined;
}

const CodeBlock: React.FC<Props> = ({ codeString, title, lang }) => {
  return (
    <div className={`language-${lang} m-4`}>
      {title && <div>{title}</div>}
      {codeString}
    </div>
  );
};

export default CodeBlock;
