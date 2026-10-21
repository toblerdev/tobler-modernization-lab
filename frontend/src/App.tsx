import { useEffect, useState } from 'react';
import './App.css';
import { validationMessages } from './utils/validationMessages';


type Company = {
  companyId: number;
  companyName: string;
  officeLocation: string;
  industry: string;
};

type Contact = {
  contactId: number;
  companyId: number;
  contactName: string;
  email: string;
  phone: string;
  role: string | null;
};

function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [officeLocation, setOfficeLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [error, setError] = useState('');
  const [contactErrors, setContactErrors] = useState<string[]>([]);
  const [editingCompanyID, setEditingCompanyID] = useState<number | null>(null);
  const [editingContactID, setEditingContactID] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

function resetContactForm() {
  setEditingContactID(null);
  setContactName('');
  setContactEmail('');
  setContactPhone('');
  setContactRole('');
  setContactErrors([]);
}

async function fetchContacts(companyId?: number) {
    try {
      setError('');

      const url = companyId

        ? `/crm/contacts?companyId=${companyId}`
        : '/crm/contacts';
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to load contacts');
      }

      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError('Could not load contacts.');
    }
  }

async function fetchCompanies() {
    try {
      setError('');
      setLoading(true);

      const response = await fetch('/crm/companies');

      if (!response.ok) {
        throw new Error('Failed to load companies');
      }

      const data = await response.json();
      setCompanies(data);
    } 
    catch (err) {
    setError('Could not connect to the backend API.');
    } finally {
      setLoading(false);
    }
  }
  async function saveCompany() {
    try {
      setError('');

      const method = editingCompanyID ? 'PATCH' : 'POST';

      const url = editingCompanyID 
        ? `/crm/companies/${editingCompanyID}` 
        : '/crm/companies';

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      companyName,
      officeLocation,
      industry,
    }),
  });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Please fill in all the required fields.');
        }

        throw new Error('Failed to add company');
      }

      setEditingCompanyID(null);
      setCompanyName('');
      setOfficeLocation('');
      setIndustry('');
      await fetchCompanies();
    } 
    catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Could not save company.');
      }
    }
  }

  async function deleteCompany(companyId: number) {
    try {
      setError('');
      
      const response = await fetch(
        `/crm/companies/${companyId}`, 
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete company');
      }
      
      fetchCompanies();
    } 
    catch (err) {
      setError('Could not delete company.');
    }
  }

  async function deleteContact(contactId: number) {
    try {
      setError('');
      
      const response = await fetch(
        `/crm/contacts/${contactId}`, 
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }
      
      if (selectedCompany) {
        fetchContacts(selectedCompany.companyId);
      }
    } 
    catch (err) {
      setError('Could not delete contact.');
    }
  }

  async function saveContact() {
    setContactErrors([]);

    if (!selectedCompany) {
      setError('Please select a company first');
      return;
    }

    try {
      setError('');

      // Determine whether to use POST or PATCH based on whether we're editing an existing contact
      const method = editingContactID ? 'PATCH' : 'POST';

      // Determine the URL based on whether we're editing an existing contact or creating a new one
      const url = editingContactID !== null
        ? `/crm/contacts/${editingContactID}`
        : '/crm/contacts';

      // Send the request to the backend API  
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contactName,
          email: contactEmail,
          phone: contactPhone,
          role: contactRole,
          companyId: selectedCompany.companyId,
        }),
      });

      // Check if the response is not ok and handle the error
      if (!response.ok) {

        const errorData = await response.json();
        console.log('HTTP status:', response.status);
        console.log('Backend error:', errorData);
        console.log('Backend messages:', errorData.message);
        console.log('Is array:', Array.isArray(errorData.message));
        if (
          response.status === 400 &&
          Array.isArray(errorData.message)
        ) {
          const messages: string[] = errorData.message.filter((message: string) => 
                               Object.prototype.hasOwnProperty.call(validationMessages, message)).map(
                                (message: string) => validationMessages[message]
                              );
          if (messages.length > 0) {
            setContactErrors([...new Set(messages)]);
            return; 
          }

          throw new Error('Could not save contact.');
        }
      }

      resetContactForm();

      await fetchContacts(selectedCompany.companyId);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Could not save contact.');
      }
    }

  }

  const startEditCompany = (company: Company) => {
    setEditingCompanyID(company.companyId);
    setCompanyName(company.companyName);
    setOfficeLocation(company.officeLocation);
    setIndustry(company.industry);
  };

  const startEditContact = (contact: Contact) => {
    setEditingContactID(contact.contactId);
    setContactName(contact.contactName);
    setContactEmail(contact.email);
    setContactPhone(contact.phone);
    setContactRole(contact.role || '');
  };

  useEffect(() => {
    fetchCompanies();
    // fetchContacts();
  }, []);

  if (selectedCompany) {
    const company = selectedCompany;
    
    return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
        <button onClick={() => {
          resetContactForm();
          setSelectedCompany(null );
        }}
        >
          Back to Companies
        </button>

        <h1 className="company-title">
          Contacts for {company.companyName}
        </h1>

      <h2>Add Contact</h2>

      {contactErrors.length > 0 && (
        <div role="alert" style={{ color: 'red' }}>
          <ul>
            {contactErrors.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <input
        type='text'
        placeholder='Contact Name'
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
      />
      
      <input
        type='email'
        placeholder='Contact Email'
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
      />
      
      <input
        type="text"
        placeholder='Phone'
        value={contactPhone}
        onChange={(e) => setContactPhone(e.target.value)}
      />

      <input
        type="text"
        placeholder='Role'
        value={contactRole}
        onChange={(e) => setContactRole(e.target.value)}
      />

      <button onClick={saveContact}>
        {editingContactID ? 'Update Contact' : 'Add Contact'}
        {/* Add Contact */}
      </button>

      <h2>Contacts</h2>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.contactId}>
              <td>{contact.contactName}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>{contact.role}</td>
              <td>
                <button onClick={() => startEditContact(contact)}>Edit</button>
                <button onClick={() => {
                  if (confirm('Are you sure you want to delete this contact?')){
                  deleteContact(contact.contactId)}
                }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );
    }


  return (

    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>CRM Companies</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <input
          placeholder="Office Location"
          value={officeLocation}
          onChange={(e) => setOfficeLocation(e.target.value)}
        />

        <input
          placeholder="Industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />


        <button onClick={saveCompany}>
          {editingCompanyID ? 'Update Company' : 'Add Company'}
          </button>

      </div>

    {loading && <p>Loading companies...</p>}

      <input
        type="text"
        placeholder="Search Companies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button onClick={() => setSearchTerm('')}>
        Clear
      </button>

      {filteredCompanies.length === 0 && !loading && (
        <p>No companies found.</p>
      )}



      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Company Name</th>
            <th>Office Location</th>
            <th>Industry</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredCompanies.map((company) => (
            <tr key={company.companyId}>
              <td>{company.companyId}</td>
              <td>{company.companyName}</td>
              <td>{company.officeLocation}</td>
              <td>{company.industry}</td>
              <td>
                <button onClick={() => {
                  if (confirm('Are you sure you want to delete this company?')){
                      deleteCompany(company.companyId);
                    }
                  }}
                >
                  Delete
                </button>
                <button onClick={() => startEditCompany(company)}>
                  Edit
                </button>
                <button onClick={() => { 
                  setSelectedCompany(company);
                  fetchContacts(company.companyId);
                 }}
                >
                  View Contacts
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}

export default App;
