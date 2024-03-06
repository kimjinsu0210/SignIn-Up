interface LayoutProps {
  children: React.ReactNode;
}
export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      {children}
    </div>
  );
};
