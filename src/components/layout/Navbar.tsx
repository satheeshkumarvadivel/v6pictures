import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import companyInfo from '../../data/companyInfo.json';

console.log('Navbar component is being imported');

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-bold text-xl">
            {companyInfo.name.toUpperCase()}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            <Link to="/billing" className="hover:underline">
              Billing
            </Link>
            <Link to="/invoice" className="hover:underline">
              Invoice
            </Link>
            <Link to="/logout" className="hover:underline">
              Logout
            </Link>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="text-primary-foreground hover:bg-primary/90"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 space-y-2">
            <Link 
              to="/billing" 
              className="block hover:bg-primary/90 px-4 py-2 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Billing
            </Link>
            <Link 
              to="/invoice" 
              className="block hover:bg-primary/90 px-4 py-2 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Invoice
            </Link>
            <Link 
              to="/logout" 
              className="block hover:bg-primary/90 px-4 py-2 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Logout
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
