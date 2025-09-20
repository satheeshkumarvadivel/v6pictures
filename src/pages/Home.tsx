import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import companyInfo from '../data/companyInfo.json';

console.log('Home component is being imported');

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-8 sm:py-12">
      <div className="mb-8 sm:mb-12">
        <img 
          src="/v6_logo.png" 
          alt={companyInfo.name} 
          className="w-24 h-24 sm:w-32 sm:h-32 object-contain mx-auto"
        />
      </div>
      
      <Card className="w-full max-w-2xl mx-4 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl mb-3">{companyInfo.name}</CardTitle>
          <p className="text-lg sm:text-xl font-medium text-gray-700 mb-3">{companyInfo.tagline}</p>
          <div className="space-y-1 text-gray-600">
            <p className="text-sm sm:text-base">{companyInfo.location}</p>
            <p className="text-sm sm:text-base">Ph: {companyInfo.phone}</p>
          </div>
        </CardHeader>
        <CardContent className="text-center pt-0">
          <p className="mb-8 text-gray-600 text-sm sm:text-base">Welcome to the V6Pictures management system</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <a href="/billing" className="block group">
              <div className="bg-primary text-primary-foreground p-6 sm:p-8 rounded-lg hover:bg-primary/90 transition-all duration-200 group-hover:shadow-md group-hover:scale-105">
                <div className="text-lg sm:text-xl font-semibold">Create Billing</div>
                <div className="text-sm opacity-90 mt-2">Generate new invoices</div>
              </div>
            </a>
            <a href="/invoice" className="block group">
              <div className="bg-primary text-primary-foreground p-6 sm:p-8 rounded-lg hover:bg-primary/90 transition-all duration-200 group-hover:shadow-md group-hover:scale-105">
                <div className="text-lg sm:text-xl font-semibold">View Invoices</div>
                <div className="text-sm opacity-90 mt-2">Manage existing invoices</div>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
