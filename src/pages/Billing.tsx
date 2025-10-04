import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import companyInfo from '../data/companyInfo.json';
import eventTypes from '../data/eventTypes.json';
import services from '../data/services.json';
import deliverables from '../data/deliverables.json';
import complementary from '../data/complementary.json';
import unitOptions from '../data/unitOptions.json';

console.log('Billing component is being imported');

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

const Billing = () => {
  const navigate = useNavigate();
  // Track number of events for UI display
  const [, setEventCount] = useState(1);
  // Separate state for custom deliverable input to prevent character-by-character updates
  const [customDeliverableInput, setCustomDeliverableInput] = useState('');
  // Flag to prevent saving during initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Initialize invoice state with default values
  const getInitialInvoiceState = (): Invoice => ({
    invoiceNumber: '',
    customer: {
      customerName: '',
    },
    address: '',
    phonenumber: '',
    noOfEvents: '',
    engagementDate: '',
    seerDate: '',
    weddingDate: '',
    receptionDate: '',
    customDate: '',
    eventDate: '',
    customDateName: '',
    remarks: '',
    events: [{ eventName: '', services: [] }],
    deliverables: [],
    complementary: [],
    total: '',
    advance: '',
  });
  
  const [invoice, setInvoice] = useState<Invoice>(getInitialInvoiceState());

  // Load saved billing data on component mount
  useEffect(() => {
    const savedBillingData = sessionStorage.getItem('billing_form_data');
    if (savedBillingData) {
      try {
        const parsedData = JSON.parse(savedBillingData);
        setInvoice(parsedData.invoice);
        setCustomDeliverableInput(parsedData.customDeliverableInput || '');
        setEventCount(parsedData.invoice.events.length);
        console.log('Loaded billing data:', parsedData); // Debug log
      } catch (error) {
        console.error('Error loading saved billing data:', error);
        // If there's an error, clear the corrupted data
        sessionStorage.removeItem('billing_form_data');
      }
    }
    // Set flag to allow saving after initial load
    setIsInitialLoad(false);
  }, []);

  // Save billing data to sessionStorage whenever invoice or customDeliverableInput changes
  useEffect(() => {
    // Don't save during initial load to prevent overwriting loaded data
    if (!isInitialLoad) {
      const billingData = {
        invoice,
        customDeliverableInput
      };
      sessionStorage.setItem('billing_form_data', JSON.stringify(billingData));
      console.log('Saved billing data:', billingData); // Debug log
    }
  }, [invoice, customDeliverableInput, isInitialLoad]);

  // Format today's date
  const formatDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  // Handle input changes for main form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (id === 'customer_name') {
      setInvoice(prev => ({
        ...prev,
        customer: {
          ...prev.customer,
          customerName: value
        }
      }));
    } else {
      const fieldMapping: Record<string, string> = {
        'invoice_no': 'invoiceNumber',
        'address': 'address',
        'phone_no': 'phonenumber',
        'event_count': 'noOfEvents',
        'engagement_date': 'engagementDate',
        'seer_date': 'seerDate',
        'wedding_date': 'weddingDate',
        'reception_date': 'receptionDate',
        'custom_date': 'customDate',
        'event_date': 'eventDate',
        'custom_date_name': 'customDateName',
        'remarks': 'remarks',
        'total_amount': 'total',
        'advance_amount': 'advance'
      };
      
      const field = fieldMapping[id] || id;
      
      setInvoice(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle event type selection
  const handleEventTypeChange = (index: number, value: string) => {
    const updatedEvents = [...invoice.events];
    updatedEvents[index] = {
      ...updatedEvents[index],
      eventName: value
    };
    
    setInvoice(prev => ({
      ...prev,
      events: updatedEvents
    }));
  };

  // Handle service selection
  const handleServiceChange = (eventIndex: number, serviceId: string) => {
    const updatedEvents = [...invoice.events];
    const serviceObj = services.find(s => s.id === serviceId);
    
    if (!serviceObj || serviceId === '') return;
    
    // Check if service already exists
    const existingServiceIndex = updatedEvents[eventIndex].services.findIndex(
      s => s.serviceName === serviceObj.name
    );
    
    if (existingServiceIndex === -1) {
      // Add service
      updatedEvents[eventIndex].services.push({
        serviceName: serviceObj.name,
        unit: ''
      });
    }
    
    setInvoice(prev => ({
      ...prev,
      events: updatedEvents
    }));
  };

  // Handle service removal
  const handleServiceRemoval = (eventIndex: number, serviceName: string) => {
    const updatedEvents = [...invoice.events];
    updatedEvents[eventIndex].services = updatedEvents[eventIndex].services.filter(
      s => s.serviceName !== serviceName
    );
    
    setInvoice(prev => ({
      ...prev,
      events: updatedEvents
    }));
  };

  // Handle service unit change
  const handleServiceUnitChange = (eventIndex: number, serviceName: string, unit: string) => {
    const updatedEvents = [...invoice.events];
    
    const serviceIndex = updatedEvents[eventIndex].services.findIndex(
      s => s.serviceName === serviceName
    );
    
    if (serviceIndex !== -1) {
      updatedEvents[eventIndex].services[serviceIndex].unit = unit;
      
      setInvoice(prev => ({
        ...prev,
        events: updatedEvents
      }));
    }
  };

  // Handle deliverable selection
  const handleDeliverableChange = (deliverableId: string, checked: boolean, unit: string = '') => {
    const deliverableObj = deliverables.find(d => d.id === deliverableId);
    
    if (!deliverableObj) return;
    
    if (checked) {
      // Add deliverable
      setInvoice(prev => ({
        ...prev,
        deliverables: [
          ...prev.deliverables,
          {
            deliverableName: deliverableObj.name,
            unit: unit
          }
        ]
      }));
    } else {
      // Remove deliverable
      setInvoice(prev => ({
        ...prev,
        deliverables: prev.deliverables.filter(
          d => d.deliverableName !== deliverableObj.name
        )
      }));
    }
  };

  // Handle deliverable unit change
  const handleDeliverableUnitChange = (deliverableId: string, unit: string) => {
    const deliverableObj = deliverables.find(d => d.id === deliverableId);
    
    if (!deliverableObj) return;
    
    const updatedDeliverables = [...invoice.deliverables];
    const deliverableIndex = updatedDeliverables.findIndex(
      d => d.deliverableName === deliverableObj.name
    );
    
    if (deliverableIndex !== -1) {
      updatedDeliverables[deliverableIndex].unit = unit;
      
      setInvoice(prev => ({
        ...prev,
        deliverables: updatedDeliverables
      }));
    } else {
      // If deliverable wasn't checked yet, check it and add the unit
      handleDeliverableChange(deliverableId, true, unit);
    }
  };

  // Handle custom deliverable input change
  const handleCustomDeliverableChange = (value: string) => {
    setCustomDeliverableInput(value);
  };

  // Handle custom deliverable blur (when user finishes typing)
  const handleCustomDeliverableBlur = () => {
    if (customDeliverableInput.trim()) {
      const existingCustomIndex = invoice.deliverables.findIndex(
        d => d.deliverableName.startsWith('Custom:')
      );
      
      if (existingCustomIndex !== -1) {
        const updatedDeliverables = [...invoice.deliverables];
        updatedDeliverables[existingCustomIndex].deliverableName = `Custom: ${customDeliverableInput.trim()}`;
        
        setInvoice(prev => ({
          ...prev,
          deliverables: updatedDeliverables
        }));
      } else {
        setInvoice(prev => ({
          ...prev,
          deliverables: [
            ...prev.deliverables,
            {
              deliverableName: `Custom: ${customDeliverableInput.trim()}`,
              unit: ''
            }
          ]
        }));
      }
    } else {
      // Remove custom deliverable if input is empty
      setInvoice(prev => ({
        ...prev,
        deliverables: prev.deliverables.filter(
          d => !d.deliverableName.startsWith('Custom:')
        )
      }));
    }
  };

  // Handle complementary selection
  const handleComplementaryChange = (complementaryId: string, checked: boolean, unit: string = '') => {
    const complementaryObj = complementary.find(c => c.id === complementaryId);
    
    if (!complementaryObj) return;
    
    if (checked) {
      // Add complementary
      setInvoice(prev => ({
        ...prev,
        complementary: [
          ...prev.complementary,
          {
            complementaryName: complementaryObj.name,
            unit: unit
          }
        ]
      }));
    } else {
      // Remove complementary
      setInvoice(prev => ({
        ...prev,
        complementary: prev.complementary.filter(
          c => c.complementaryName !== complementaryObj.name
        )
      }));
    }
  };

  // Handle complementary unit change
  const handleComplementaryUnitChange = (complementaryId: string, unit: string) => {
    const complementaryObj = complementary.find(c => c.id === complementaryId);
    
    if (!complementaryObj) return;
    
    const updatedComplementary = [...invoice.complementary];
    const complementaryIndex = updatedComplementary.findIndex(
      c => c.complementaryName === complementaryObj.name
    );
    
    if (complementaryIndex !== -1) {
      updatedComplementary[complementaryIndex].unit = unit;
      
      setInvoice(prev => ({
        ...prev,
        complementary: updatedComplementary
      }));
    } else {
      // If complementary wasn't checked yet, check it and add the unit
      handleComplementaryChange(complementaryId, true, unit);
    }
  };

  // Add new event row
  const addEventRow = () => {
    setInvoice(prev => ({
      ...prev,
      events: [
        ...prev.events,
        { eventName: '', services: [] }
      ]
    }));
    setEventCount(prev => prev + 1);
  };

  // Remove event row
  const removeEventRow = (index: number) => {
    if (invoice.events.length <= 1) return;
    
    const updatedEvents = invoice.events.filter((_, i) => i !== index);
    
    setInvoice(prev => ({
      ...prev,
      events: updatedEvents
    }));
    setEventCount(prev => prev - 1);
  };

  // Handle form submission for invoice
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save invoice to session storage
    sessionStorage.setItem('current_invoice', JSON.stringify(invoice));
    
    // Navigate to print page
    navigate('/print');
  };

  // Handle quote creation
  const handleCreateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save invoice data to session storage (same data structure for quote)
    sessionStorage.setItem('current_invoice', JSON.stringify(invoice));
    
    // Navigate to quote page
    navigate('/quote');
  };

  // Clear form data
  const handleClearForm = () => {
    const confirmed = window.confirm('Are you sure you want to clear all form data? This action cannot be undone.');
    if (confirmed) {
      setInvoice(getInitialInvoiceState());
      setCustomDeliverableInput('');
      setEventCount(1);
      sessionStorage.removeItem('billing_form_data');
      // Reset the initial load flag to prevent immediate save
      setIsInitialLoad(true);
      setTimeout(() => setIsInitialLoad(false), 100);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-gray-50 rounded-t-lg">
          <CardTitle className="text-2xl sm:text-3xl mb-2">{companyInfo.name}</CardTitle>
          <CardDescription className="font-semibold text-lg mb-2">{companyInfo.tagline}</CardDescription>
          <CardDescription className="text-gray-600">
            {companyInfo.location} <br /> Ph: {companyInfo.phone}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-end mb-6">
              <div className="text-right bg-gray-50 px-4 py-2 rounded-lg">
                <p className="font-bold text-gray-700">
                  Date: {formatDate()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="col-span-1">
                <Label htmlFor="invoice_no" className="text-sm font-medium text-gray-700 mb-2 block">Invoice No:</Label>
                <Input 
                  id="invoice_no" 
                  value={invoice.invoiceNumber}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="customer_name" className="text-sm font-medium text-gray-700 mb-2 block">Couple Name:</Label>
                <Input 
                  id="customer_name" 
                  value={invoice.customer.customerName}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">Event Location:</Label>
                <Input 
                  id="address" 
                  value={invoice.address}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="phone_no" className="text-sm font-medium text-gray-700 mb-2 block">Phone No:</Label>
                <Input 
                  id="phone_no" 
                  value={invoice.phonenumber}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="event_count" className="text-sm font-medium text-gray-700 mb-2 block">No of Events:</Label>
                <Input 
                  id="event_count" 
                  value={invoice.noOfEvents}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="engagement_date" className="text-sm font-medium text-gray-700 mb-2 block">Engagement Date:</Label>
                <Input 
                  id="engagement_date" 
                  type="date" 
                  value={invoice.engagementDate}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="seer_date" className="text-sm font-medium text-gray-700 mb-2 block">Seer Date:</Label>
                <Input 
                  id="seer_date" 
                  type="date" 
                  value={invoice.seerDate}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="wedding_date" className="text-sm font-medium text-gray-700 mb-2 block">Wedding Date:</Label>
                <Input 
                  id="wedding_date" 
                  type="date" 
                  value={invoice.weddingDate}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="reception_date" className="text-sm font-medium text-gray-700 mb-2 block">Reception Date:</Label>
                <Input 
                  id="reception_date" 
                  type="date" 
                  value={invoice.receptionDate}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="event_date" className="text-sm font-medium text-gray-700 mb-2 block">Event Date:</Label>
                <Input 
                  id="event_date" 
                  type="date" 
                  value={invoice.eventDate}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="custom_date_name" className="text-sm font-medium text-gray-700 mb-2 block">Custom Date Name:</Label>
                <Input 
                  id="custom_date_name" 
                  value={invoice.customDateName}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="custom_date" className="text-sm font-medium text-gray-700 mb-2 block">Custom Date:</Label>
                <Input 
                  id="custom_date" 
                  type="date" 
                  value={invoice.customDate}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="border rounded-lg p-6 mb-8 bg-gray-50">
              <h3 className="font-semibold text-xl mb-6 text-gray-800 border-b border-gray-200 pb-2">Events & Services</h3>
              
              {invoice.events.map((event, eventIndex) => (
                <div key={eventIndex} className="mb-6 p-6 border rounded-lg bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-semibold text-lg text-gray-800">Event {eventIndex + 1}</h4>
                    <div className="flex space-x-2">
                      {eventIndex === invoice.events.length - 1 && (
                        <Button 
                          type="button" 
                          size="sm" 
                          onClick={addEventRow}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          +
                        </Button>
                      )}
                      {invoice.events.length > 1 && (
                        <Button 
                          type="button" 
                          size="sm" 
                          onClick={() => removeEventRow(eventIndex)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          -
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <Label htmlFor={`event_type_${eventIndex}`} className="text-sm font-medium text-gray-700 mb-2 block">Event Type</Label>
                    <select 
                      id={`event_type_${eventIndex}`}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={event.eventName}
                      onChange={(e) => handleEventTypeChange(eventIndex, e.target.value)}
                    >
                      <option value="">Select Event Type</option>
                      {eventTypes.map((type, i) => (
                        <option key={i} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <Label htmlFor={`service_select_${eventIndex}`} className="text-sm font-medium text-gray-700 mb-2 block">Add Service</Label>
                    <select 
                      id={`service_select_${eventIndex}`}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value=""
                      onChange={(e) => handleServiceChange(eventIndex, e.target.value)}
                    >
                      <option value="">Select Service to Add</option>
                      {services.filter(service => 
                        !event.services.some(s => s.serviceName === service.name)
                      ).map((service) => (
                        <option key={service.id} value={service.id}>{service.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {event.services.length > 0 && (
                    <div className="space-y-3">
                      <h5 className="font-medium text-sm">Selected Services:</h5>
                      {event.services.map((service, serviceIndex) => (
                        <div key={serviceIndex} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-md">
                          <div className="flex-1">
                            <span className="font-medium">{service.serviceName}</span>
                          </div>
                          <div className="flex-1">
                            <select
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              value={service.unit}
                              onChange={(e) => handleServiceUnitChange(eventIndex, service.serviceName, e.target.value)}
                            >
                              <option value="">Select Unit</option>
                              {unitOptions.map((unit, i) => (
                                <option key={i} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </div>
                          <Button 
                            type="button" 
                            size="sm" 
                            onClick={() => handleServiceRemoval(eventIndex, service.serviceName)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="border rounded-lg p-6 mb-8 bg-gray-50">
              <h3 className="font-semibold text-xl mb-6 text-gray-800 border-b border-gray-200 pb-2">Deliverables</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {deliverables.map((deliverable) => (
                  <div key={deliverable.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-white rounded-lg border shadow-sm">
                    <div className="flex items-center space-x-2 flex-1">
                      <Checkbox 
                        id={deliverable.id}
                        checked={invoice.deliverables.some(d => d.deliverableName === deliverable.name)}
                        onCheckedChange={(checked) => 
                          handleDeliverableChange(deliverable.id, checked === true)
                        }
                      />
                      <Label htmlFor={deliverable.id} className="text-sm leading-tight">
                        {deliverable.name}
                      </Label>
                    </div>
                    <div className="w-full sm:w-48">
                      <select
                        id={`${deliverable.id}_unit`}
                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={invoice.deliverables.find(d => d.deliverableName === deliverable.name)?.unit || ''}
                        onChange={(e) => handleDeliverableUnitChange(deliverable.id, e.target.value)}
                        disabled={!invoice.deliverables.some(d => d.deliverableName === deliverable.name)}
                      >
                        <option value="">Select Unit</option>
                        {unitOptions.map((unit, i) => (
                          <option key={i} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                
                <div className="col-span-1 lg:col-span-2 mt-6">
                  <Label htmlFor="custom_deliverable" className="text-sm font-medium text-gray-700 mb-2 block">Custom Deliverable:</Label>
                  <Input 
                    id="custom_deliverable" 
                    placeholder="Enter custom deliverable"
                    value={customDeliverableInput}
                    onChange={(e) => handleCustomDeliverableChange(e.target.value)}
                    onBlur={handleCustomDeliverableBlur}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 mb-8 bg-gray-50">
              <h3 className="font-semibold text-xl mb-6 text-gray-800 border-b border-gray-200 pb-2">Complementary</h3>
              
              <div className="space-y-4 sm:space-y-6">
                {complementary.map((complementaryItem) => (
                  <div key={complementaryItem.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-white rounded-lg border shadow-sm">
                    <div className="flex items-center space-x-2 flex-1">
                      <Checkbox 
                        id={complementaryItem.id}
                        checked={invoice.complementary.some(c => c.complementaryName === complementaryItem.name)}
                        onCheckedChange={(checked) => 
                          handleComplementaryChange(complementaryItem.id, checked === true)
                        }
                      />
                      <Label htmlFor={complementaryItem.id} className="text-sm leading-tight">
                        {complementaryItem.name}
                      </Label>
                    </div>
                    <div className="w-full sm:w-48">
                      <select
                        id={`${complementaryItem.id}_unit`}
                        className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={invoice.complementary.find(c => c.complementaryName === complementaryItem.name)?.unit || ''}
                        onChange={(e) => handleComplementaryUnitChange(complementaryItem.id, e.target.value)}
                        disabled={!invoice.complementary.some(c => c.complementaryName === complementaryItem.name)}
                      >
                        <option value="">Select Unit</option>
                        {unitOptions.map((unit, i) => (
                          <option key={i} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="remarks" className="text-sm font-medium text-gray-700 mb-2 block">Remarks:</Label>
                <Input 
                  id="remarks" 
                  value={invoice.remarks}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="total_amount" className="text-sm font-medium text-gray-700 mb-2 block">Total Amount:</Label>
                <Input 
                  id="total_amount" 
                  value={invoice.total}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="advance_amount" className="text-sm font-medium text-gray-700 mb-2 block">Advance Amount:</Label>
                <Input 
                  id="advance_amount" 
                  value={invoice.advance}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
              <Button 
                type="button" 
                onClick={handleClearForm}
                className="bg-red-500 hover:bg-red-600 w-full sm:w-auto order-2 sm:order-1"
              >
                Clear Form
              </Button>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto order-1 sm:order-2">
                <Button 
                  type="button" 
                  onClick={handleCreateQuote}
                  className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
                >
                  Create Quote
                </Button>
                <Button type="submit" className="bg-green-500 hover:bg-green-600 w-full sm:w-auto">
                  Print
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
