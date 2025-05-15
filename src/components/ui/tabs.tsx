export const Tabs = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
);

export const TabsList = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className="flex border-b" {...props}>{children}</div>
);

export const TabsTrigger = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button className="px-4 py-2" {...props}>{children}</button>
);

export const TabsContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className="p-4" {...props}>{children}</div>
);