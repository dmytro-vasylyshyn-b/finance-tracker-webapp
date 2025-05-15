export const Label = ({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label className="block text-sm font-medium mb-1" {...props}>{children}</label>
  );