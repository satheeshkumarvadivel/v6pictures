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
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="font-semibold text-2xl text-gray-800 hover:text-gray-600 transition-colors duration-200"
          >
            {companyInfo.name}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/billing" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
            >
              Billing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link 
              to="/invoice" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
            >
              Invoice
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link 
              to="/logout" 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-sm"
            >
              Logout
            </Link>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 py-4 border-t border-gray-200 bg-gray-50 rounded-lg mx-2">
            <div className="space-y-2 px-2">
              <Link 
                to="/billing" 
                className="block text-gray-600 hover:text-gray-900 hover:bg-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Billing
              </Link>
              <Link 
                to="/invoice" 
                className="block text-gray-600 hover:text-gray-900 hover:bg-white px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Invoice
              </Link>
              <Link 
                to="/logout" 
                className="block bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Logout
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
