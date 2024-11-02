type Variant = "default" | "info" | "danger" | "success";
const Aside = ({
  variant = "default",
  children,
}: {
  variant: Variant;
  children: any;
}) => {
  return (
    <aside className={variant == "danger" ? "bg-red-600" : "bg-green-400"}>
      {children}
    </aside>
  );
};

export { Aside };
