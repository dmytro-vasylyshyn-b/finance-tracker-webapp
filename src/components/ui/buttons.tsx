export const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md" {...props}>{children}</button>
  );