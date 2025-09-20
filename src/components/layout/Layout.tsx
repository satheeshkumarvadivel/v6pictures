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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-600 mt-auto">
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
