import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import companyInfo from '../data/companyInfo.json';

console.log('Home component is being imported');

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-8">
        <img 
          src="/v6_logo.png" 
          alt={companyInfo.name} 
          className="w-32 h-32 object-contain"
        />
      </div>
      
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">{companyInfo.name}</CardTitle>
          <p className="text-xl font-medium mt-2">{companyInfo.tagline}</p>
          <p className="mt-2">{companyInfo.location}</p>
          <p className="mt-1">Ph: {companyInfo.phone}</p>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">Welcome to the V6Pictures management system</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/billing" className="block">
              <div className="bg-primary text-primary-foreground p-6 rounded-md hover:opacity-90 transition-opacity">
                Create Billing
              </div>
            </a>
            <a href="/invoice" className="block">
              <div className="bg-primary text-primary-foreground p-6 rounded-md hover:opacity-90 transition-opacity">
                View Invoices
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
