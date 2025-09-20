import { useState } from 'react';
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

interface Invoice {
  invoiceNumber: string;
  customer: {
    customerName: string;
  };
  address: string;
  phonenumber: string;
  noOfEvents: string;
  eventDate: string;
  customDateName: string;
  customDate: string;
  weddingDate: string;
  receptionDate: string;
  remarks: string;
  events: Event[];
  deliverables: Deliverable[];
  total: string;
  advance: string;
}

const Billing = () => {
  const navigate = useNavigate();
  // Track number of events for UI display
  const [, setEventCount] = useState(1);
  // Separate state for custom deliverable input to prevent character-by-character updates
  const [customDeliverableInput, setCustomDeliverableInput] = useState('');
  const [invoice, setInvoice] = useState<Invoice>({
    invoiceNumber: '',
    customer: {
      customerName: '',
    },
    address: '',
    phonenumber: '',
    noOfEvents: '',
    eventDate: '',
    customDateName: '',
    customDate: '',
    weddingDate: '',
    receptionDate: '',
    remarks: '',
    events: [{ eventName: '', services: [] }],
    deliverables: [],
    total: '',
    advance: '',
  });

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
        'event_date': 'eventDate',
        'custom_date_name': 'customDateName',
        'custom_date': 'customDate',
        'wedding_date': 'weddingDate',
        'reception_date': 'receptionDate',
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save invoice to session storage
    sessionStorage.setItem('current_invoice', JSON.stringify(invoice));
    
    // Navigate to print page
    navigate('/print');
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{companyInfo.name}</CardTitle>
          <CardDescription className="font-semibold">{companyInfo.tagline}</CardDescription>
          <CardDescription>
            {companyInfo.location} <br /> Ph: {companyInfo.phone}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-end mb-4">
              <div className="text-right">
                <p className="font-bold">
                  Date: {formatDate()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="col-span-1">
                <Label htmlFor="invoice_no">Invoice No:</Label>
                <Input 
                  id="invoice_no" 
                  value={invoice.invoiceNumber}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="customer_name">Customer Name:</Label>
                <Input 
                  id="customer_name" 
                  value={invoice.customer.customerName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="address">Address:</Label>
                <Input 
                  id="address" 
                  value={invoice.address}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="phone_no">Phone No:</Label>
                <Input 
                  id="phone_no" 
                  value={invoice.phonenumber}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="event_count">No of Events:</Label>
                <Input 
                  id="event_count" 
                  value={invoice.noOfEvents}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="custom_date_name">Custom Date Name:</Label>
                <Input 
                  id="custom_date_name" 
                  value={invoice.customDateName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="custom_date">Custom Date:</Label>
                <Input 
                  id="custom_date" 
                  type="date" 
                  value={invoice.customDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="event_date">Event Date:</Label>
                <Input 
                  id="event_date" 
                  type="date" 
                  value={invoice.eventDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="wedding_date">Wedding Date:</Label>
                <Input 
                  id="wedding_date" 
                  type="date" 
                  value={invoice.weddingDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="reception_date">Reception Date:</Label>
                <Input 
                  id="reception_date" 
                  type="date" 
                  value={invoice.receptionDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="border rounded-md p-4 mb-6">
              <h3 className="font-semibold text-lg mb-4">Events & Services</h3>
              
              {invoice.events.map((event, eventIndex) => (
                <div key={eventIndex} className="mb-6 p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Event {eventIndex + 1}</h4>
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
                  
                  <div className="mb-4">
                    <Label htmlFor={`event_type_${eventIndex}`}>Event Type</Label>
                    <select 
                      id={`event_type_${eventIndex}`}
                      className="w-full p-2 border rounded-md"
                      value={event.eventName}
                      onChange={(e) => handleEventTypeChange(eventIndex, e.target.value)}
                    >
                      <option value="">Select Event Type</option>
                      {eventTypes.map((type, i) => (
                        <option key={i} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor={`service_select_${eventIndex}`}>Add Service</Label>
                    <select 
                      id={`service_select_${eventIndex}`}
                      className="w-full p-2 border rounded-md"
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
                              className="w-full p-2 border rounded-md"
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
            
            <div className="border rounded-md p-4 mb-6">
              <h3 className="font-semibold text-lg mb-4">Deliverables</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deliverables.map((deliverable) => (
                  <div key={deliverable.id} className="flex items-start space-x-2">
                    <div className="flex items-center h-10 space-x-2">
                      <Checkbox 
                        id={deliverable.id}
                        checked={invoice.deliverables.some(d => d.deliverableName === deliverable.name)}
                        onCheckedChange={(checked) => 
                          handleDeliverableChange(deliverable.id, checked === true)
                        }
                      />
                      <Label htmlFor={deliverable.id}>{deliverable.name}</Label>
                    </div>
                    <div className="flex-1">
                      <select
                        id={`${deliverable.id}_unit`}
                        className="w-full p-2 border rounded-md"
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
                
                <div className="col-span-1 md:col-span-2">
                  <Label htmlFor="custom_deliverable">Custom Deliverable:</Label>
                  <Input 
                    id="custom_deliverable" 
                    placeholder="Enter custom deliverable"
                    value={customDeliverableInput}
                    onChange={(e) => handleCustomDeliverableChange(e.target.value)}
                    onBlur={handleCustomDeliverableBlur}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="col-span-1 md:col-span-2">
                <Label htmlFor="remarks">Remarks:</Label>
                <Input 
                  id="remarks" 
                  value={invoice.remarks}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="total_amount">Total Amount:</Label>
                <Input 
                  id="total_amount" 
                  value={invoice.total}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="advance_amount">Advance Amount:</Label>
                <Input 
                  id="advance_amount" 
                  value={invoice.advance}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" className="bg-green-500 hover:bg-green-600">
                Print
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
