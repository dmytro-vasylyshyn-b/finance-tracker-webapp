export const Card = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className="rounded-xl border shadow-sm p-4" {...props}>{children}</div>
  );
  
  export const CardHeader = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className="mb-4" {...props}>{children}</div>
  );
  
  export const CardTitle = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-xl font-semibold" {...props}>{children}</h2>
  );
  
  export const CardContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
  );