import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Billing from './pages/Billing';
import Print from './pages/Print';

console.log('App component is being imported');

function App() {
  console.log('App component is rendering');
  
  try {
    return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/print" element={<Print />} />
            <Route path="/invoice" element={<Billing />} /> {/* Redirect to billing for now */}
            <Route path="/logout" element={<Home />} /> {/* Redirect to home for now */}
          </Routes>
        </Layout>
      </Router>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return <div>Error loading the application. Check console for details.</div>;
  }
}

export default App
