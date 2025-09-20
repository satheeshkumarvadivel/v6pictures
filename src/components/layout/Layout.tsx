import type { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

console.log('Layout component is being imported');

const Layout = ({ children }: LayoutProps) => {
  console.log('Layout component is rendering');
  
  try {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-6">
          {children}
        </main>
        <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} V6Pictures. All rights reserved.</p>
        </footer>
      </div>
    );
  } catch (error) {
    console.error('Error in Layout component:', error);
    return <div>Error loading the layout. Check console for details.</div>;
  }
};

export default Layout;
