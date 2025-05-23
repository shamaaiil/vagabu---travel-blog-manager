import { useState } from 'react';
import { usePostMutation } from '@/services/apiService';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';

const Email = () => {
  const [userType, setUserType] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Use the same postMutation hook as in Customers component
  const [sendEmail, { isLoading: isSending }] = usePostMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form fields
    if (!userType || !emailSubject || !emailBody) {
      setMessage({
        text: 'Please fill all required fields',
        type: 'error'
      });
      return;
    }
    
    // Prepare data for API
    const emailData = {
      marketingType: 'email',
      userType: userType,
      subject: emailSubject,
      body: emailBody
    };
    
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      // Send request using the usePostMutation hook instead of axios
      const res = await sendEmail({
        path: 'admin/marketing/send',
        method: 'POST',
        body: emailData
      });
      
      if (!res.error) {
        // Handle successful response
        toast.success('Email sent successfully!', { theme: 'colored' });
        setMessage({
          text: 'Email sent successfully!',
          type: 'success'
        });
        
        // Reset form fields after successful submission
        setUserType('');
        setEmailSubject('');
        setEmailBody('');
      } else {
        // Handle error from API
        const errorMessage = res.error?.data?.message || 'Failed to send email. Please try again.';
        toast.error(errorMessage, { theme: 'colored' });
        setMessage({
          text: errorMessage,
          type: 'error'
        });
      }
    } catch (error) {
      // Handle unexpected errors
      const errorMessage = 'An unexpected error occurred while sending email';
      toast.error(errorMessage, { theme: 'colored' });
      setMessage({
        text: errorMessage,
        type: 'error'
      });
      console.error('Error sending email:', error);
    } finally {
      setIsLoading(false);
    }
  };

   const handleQuillChange = (value) => {
    setEmailForm((prev) => ({
      ...prev,
      message: value,  // Update the message field with Quill's value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-[95%] mx-auto mt-6">
      <h1 className="text-pinkclr text-xl font-bold mb-6">Bulk Email</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">
              Select User Type
            </label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
            >
              <option value="">Select User Type</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="emailSubject" className="block text-gray-700 mb-2">
              Email Subject
            </label>
            <input
              type="text"
              id="emailSubject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Email Subject"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
            />
          </div>
        </div>
        
          <div className="w-full px-4">
              <ReactQuill
                value={emailBody} // Bind React Quill's value to the message field
                onChange={handleQuillChange}
                placeholder="Enter your message"
                className="w-full mt-1 border rounded-md text-sm sm:text-base"
                modules={{
                  toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['bold', 'italic', 'underline'],
                    [{ 'align': [] }],
                    ['link'],
                  ],
                }}
              />
          </div>
        
        <div className="flex justify-center py-10">
          <button
            type="submit"
            className="bg-teelclr hover:bg-teal-600 text-white font-medium px-6 py-2 rounded-md transition-colors "
          >
            Send Email
          </button>
        </div>
      </form>
    </div>
  );
};

export default Email;