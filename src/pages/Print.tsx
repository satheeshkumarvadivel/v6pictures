import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import companyInfo from '../data/companyInfo.json';

console.log('Print component is being imported');

interface Service {
  serviceName: string;
  unit: string;
}

interface Event {
  eventName: string;
  services: Service[];
}

interface Deliverable {
  deliverableName: string;
  unit: string;
}

interface Complementary {
  complementaryName: string;
  unit: string;
}

interface Invoice {
  invoiceNumber: string;
  customer: {
    customerName: string;
  };
  address: string;
  phonenumber: string;
  noOfEvents: string;
  engagementDate: string;
  seerDate: string;
  weddingDate: string;
  receptionDate: string;
  customDate: string;
  eventDate: string;
  customDateName: string;
  remarks: string;
  events: Event[];
  deliverables: Deliverable[];
  complementary: Complementary[];
  total: string;
  advance: string;
}

const Print = () => {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get invoice from session storage
    const storedInvoice = sessionStorage.getItem('current_invoice');
    
    if (!storedInvoice) {
      navigate('/billing');
      return;
    }
    
    try {
      const parsedInvoice = JSON.parse(storedInvoice);
      setInvoice(parsedInvoice);
      
      // Calculate balance
      const total = parseInt(parsedInvoice.total.replaceAll(',', '')) || 0;
      const advance = parseInt(parsedInvoice.advance.replaceAll(',', '')) || 0;
      const calculatedBalance = total - advance;
      
      setBalance(calculatedBalance.toLocaleString('en-IN'));
    } catch (error) {
      console.error('Error parsing invoice:', error);
      navigate('/billing');
    }
  }, [navigate]);

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  };

  const getTodaysDate = (): string => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const handlePrint = () => {
    window.print();
  };

  if (!invoice) {
    return <div className="container mx-auto py-12 text-center">Loading invoice...</div>;
  }

  return (
    <div ref={printRef} className="bg-white text-black">
      {/* Print Header */}
      <div className="hidden md:block print:block fixed top-24 right-4 print:hidden z-10">
        <button 
          onClick={handlePrint}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 shadow-lg font-medium transition-all duration-200 hover:shadow-xl"
        >
          Print Invoice
        </button>
      </div>

      {/* Header */}
      <div className="bg-gray-500 p-5 flex flex-col md:flex-row justify-between items-center">
        <div>
          <img src="/v6_logo.png" alt="V6Pictures Logo" className="w-32 h-32 object-contain" />
        </div>
        <div className="text-white text-center md:text-right mt-4 md:mt-0 md:mr-12">
          <p className="text-2xl font-bold font-display">{companyInfo.name.toUpperCase()}</p>
          <p className="text-lg font-display">PREMIUM WEDDING PHOTOGRAPHY</p>
          <p className="text-lg font-sans">{companyInfo.location}</p>
        </div>
      </div>

      {/* Invoice Title Section */}
      <div className="bg-gray-500 p-5 pb-8 flex flex-col md:flex-row justify-between items-start invoice-header-container">
        <div className="text-white ml-8 mb-4 md:mb-0 flex-shrink-0 invoice-left-column">
          <h2 className="text-4xl font-bold text-amber-400 mb-6 font-display">INVOICE</h2>
          <div className="space-y-1">
            <p><span className="date-label">INVOICE NO</span><span className="date-value">{invoice.invoiceNumber}</span></p>
            <p><span className="date-label">INVOICE DATE</span><span className="date-value">{getTodaysDate()}</span></p>
            <p><span className="date-label">INVOICE TO</span><span className="date-value">{invoice.customer.customerName.toUpperCase()}</span></p>
            <p><span className="date-label">MOBILE NO</span><span className="date-value">{invoice.phonenumber}</span></p>
            <p><span className="date-label">VENUE</span><span className="date-value">{invoice.address.toUpperCase()}</span></p>
          </div>
        </div>

        <div className="text-white mr-8 min-w-[280px] whitespace-nowrap invoice-date-column flex-shrink-0 invoice-right-column">
          <div className="space-y-1">
            {invoice.engagementDate && (
              <p><span className="date-label">ENGAGEMENT DATE</span><span className="date-value">{formatDate(invoice.engagementDate)}</span></p>
            )}
            {invoice.seerDate && (
              <p><span className="date-label">SEER DATE</span><span className="date-value">{formatDate(invoice.seerDate)}</span></p>
            )}
            {invoice.weddingDate && (
              <p><span className="date-label">WEDDING DATE</span><span className="date-value">{formatDate(invoice.weddingDate)}</span></p>
            )}
            {invoice.receptionDate && (
              <p><span className="date-label">RECEPTION DATE</span><span className="date-value">{formatDate(invoice.receptionDate)}</span></p>
            )}
            {invoice.eventDate && (
              <p><span className="date-label">EVENT DATE</span><span className="date-value">{formatDate(invoice.eventDate)}</span></p>
            )}
            {invoice.customDate && (
              <p><span className="date-label">{invoice.customDateName || 'Custom date'}</span><span className="date-value">{formatDate(invoice.customDate)}</span></p>
            )}
            <p><span className="date-label">NO OF EVENTS</span><span className="date-value">{invoice.noOfEvents}</span></p>
          </div>
        </div>
      </div>

      {/* Invoice Body */}
      <div className="p-12 pt-6">
        {invoice.events.map((event, eventIndex) => (
          <div key={eventIndex} className="mb-8">
            <div className="text-center my-4 font-display">
              <strong>EVENT TYPE: </strong> {event.eventName.toUpperCase()}
            </div>
            
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-500">
                  <th className="border p-2 text-left font-display text-white">S.NO</th>
                  <th className="border p-2 text-left font-display text-white">SERVICE</th>
                  <th className="border p-2 text-left font-display text-white">UNIT</th>
                </tr>
              </thead>
              <tbody>
                {event.services.map((service, serviceIndex) => (
                  <tr key={serviceIndex} className={serviceIndex % 2 === 0 ? 'bg-gray-100' : ''}>
                    <td className="border p-2">{serviceIndex + 1}</td>
                    <td className="border p-2">{service.serviceName}</td>
                    <td className="border p-2">{service.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <div className="text-right mb-6">
          <div className="inline-block bg-gray-500 p-2 font-bold text-white font-display">
            TOTAL PACKAGE: {invoice.total}
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="px-12 mb-4">
        <strong>Deliverables: </strong>
        <ul className="list-disc ml-8 mt-2">
          {invoice.deliverables.map((deliverable, index) => (
            <li key={index}>
              {deliverable.deliverableName}
              {deliverable.unit && `: ${deliverable.unit}`}
            </li>
          ))}
        </ul>
      </div>

      {/* Complementary */}
      {invoice.complementary && invoice.complementary.length > 0 && (
        <div className="px-12 mb-4">
          <strong>Complementary: </strong>
          <ul className="list-disc ml-8 mt-2">
            {invoice.complementary.map((complementaryItem, index) => (
              <li key={index}>
                {complementaryItem.complementaryName}
                {complementaryItem.unit && `: ${complementaryItem.unit}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Remarks */}
      {invoice.remarks && (
        <div className="px-12 mb-4">
          <strong>Remarks: </strong>
          {invoice.remarks}
        </div>
      )}

      {/* Thank You and Payment */}
      <div className="px-12 py-6 min-h-[400px] relative">
        <p className="italic">Thank you for your business</p>
        
        <div className="absolute right-12 top-6">
          <div className="bg-gray-500 p-2 mb-4 min-w-[215px] text-white">
            <strong>ADVANCE PAID: </strong> {invoice.advance}
          </div>
          
          <hr className="w-[250px] my-2" />
          
          <div className="bg-gray-500 p-2 min-w-[215px] mt-8 text-white">
            <strong>BALANCE: </strong> {balance}
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="px-12 mt-12">
        <p className="font-bold">Terms and Conditions:</p>
        <ul className="list-disc ml-8 mt-2">
          {companyInfo.termsAndConditions.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="bg-gray-500 text-white p-4 text-center mt-12">
        <p>Call Us +91 {companyInfo.phone} | {companyInfo.instagram}</p>
      </div>
    </div>
  );
};

export default Print;
