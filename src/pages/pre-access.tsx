import React, { useState } from 'react';
import Layout from '../components/Layout';

type FormData = {
  fullName: string;
  email: string;
  clubName: string;
  position: string;
  phoneNumber: string;
  country: string;
  message: string;
};

type InputFieldProps = {
  id: string;
  name: keyof FormData;
  label: string;
  value: string;
  error?: string;
  type?: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  value,
  error,
  type = 'text',
  placeholder,
  onChange,
}) => (
  <div className={`mb-6 ${error ? 'bg-red-50 border-l-4 border-red-500' : ''}`}>
    <label htmlFor={id} className="block text-sm font-semibold mb-2">
      {label}{!value.trim() && !error && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${error ? 'border-red-300' : 'border-gray-300'} focus:ring-blue-500`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const PreAccessPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    clubName: '',
    position: '',
    phoneNumber: '',
    country: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.clubName.trim()) newErrors.clubName = 'Club name is required';
    
    if (!formData.position.trim()) newErrors.position = 'Position or role is required';
    
    const phonePattern = /^[0-9+\-\s()]{10,}$/;
    if (formData.phoneNumber && !phonePattern.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid phone number';
    }

    if (!formData.country.trim()) newErrors.country = 'Country or region is required';
    
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.length < 10) newErrors.message = 'Message must have at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log('Submitted data:', formData);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Your request was sent successfully. You will receive a response by email soon.');
      
      setFormData({
        fullName: '',
        email: '',
        clubName: '',
        position: '',
        phoneNumber: '',
        country: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title="Request Access - Rotary Club HUB Projects">
      
      {/* Hero Section - Minimalist */}
      <section className="relative bg-gradient-to-br from-rotary-blue to-rotary-dark-blue text-white py-6 lg:py-8 overflow-hidden" aria-labelledby="hero-title">
        <div
          className="absolute inset-0 opacity-[3%] bg-radial-dots-white-60"
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 relative z-[5] text-center">
          <h1 id="hero-title" className="text-2xl lg:text-3xl font-bold mb-2 leading-tight animate-fade-in-down">Request Access</h1>
          <p 
            data-style="description-lg" 
            className="text-sm md:text-base text-gray-100 max-w-2xl mx-auto leading-relaxed transition-colors duration-[.75s] ease-in-out animate-fade-in-down delay-[.5s]"
          >Join our community and start creating impact with Rotary Club HUB Projects.</p>
        </div>

      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 -mt-6 relative z-[5]" aria-labelledby="hero-title">
        
        <div 
          id="pre-access-section"
          role="region"
          className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 min-h-min border-t-4 border-rotary-gold animate-fade-in-up max-w-2xl mx-auto"
        >

          {/* Header Section */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-rotary-blue mb-3">Pre-Access Request Form</h2>            
            <p className="text-gray-600 text-sm leading-relaxed">
              Fill out the form below to request access. Our team will review and respond within 48 business hours.
            </p>
          </div>


          {/* Form Fields */}
          
          <form className="w-full space-y-5" onSubmit={handleSubmit}> 

            {Object.keys(errors).length > 0 && ( 
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded" role="alert" aria-live="assertive">
                <p className="text-red-700 font-semibold">Please correct the errors below</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField id="fullName" name="fullName" label="Full Name" value={formData.fullName} error={errors.fullName} placeholder="Enter your full name" onChange={handleChange} />

              <InputField 
                id="email" 
                name="email" 
                label="Email" 
                value={formData.email}
                error={errors.email}
                type="email" 
                placeholder="you@example.com"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField id="clubName" name="clubName" label="Rotary Club Name" value={formData.clubName} error={errors.clubName} placeholder="Enter your club name" onChange={handleChange} />

              <InputField 
                id="position" 
                name="position" 
                label="Position in Club"
                value={formData.position}
                error={errors.position}
                placeholder="e.g., President, Member"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className={`${errors.phoneNumber ? 'bg-red-50 border-l-4 border-red-500 p-3 rounded' : ''}`}>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold mb-2 text-gray-700">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData(prev => ({ ...prev, phoneNumber: e.target.value }));
                    if (errors.phoneNumber) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.phoneNumber;
                        return newErrors;
                      });
                    }
                  }}
                  placeholder="(123) 456-7890"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${errors.phoneNumber ? 'border-red-300' : 'border-gray-300'} focus:ring-blue-500`}
                />
                {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>

              <InputField id="country" name="country" label="Country / Region" value={formData.country} error={errors.country} placeholder="Enter your country" onChange={handleChange} />
            </div>

            <div className={`${errors.message ? 'bg-red-50 border-l-4 border-red-500 p-3 rounded' : ''}`}>
              <label htmlFor="message" className="block text-sm font-semibold mb-2 text-gray-700">
                Request Reason {!formData.message.trim() && !errors.message && <span className="text-red-500 ml-1">*</span>}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setFormData(prev => ({ ...prev, message: e.target.value }));
                  if (errors.message) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.message;
                      return newErrors;
                    });
                  }
                }}
                rows={4}
                placeholder="Why do you need access to the HUB Projects portal?"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${errors.message ? 'border-red-300' : 'border-gray-300'} focus:ring-blue-500 resize-none`}
              />
              {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
            </div>

            {/* Button Submit */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg font-bold text-white shadow-md transition-all duration-300 ease-in-out ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed opacity-75' : 
                'bg-rotary-gold hover:bg-yellow-600 text-rotary-blue shadow-lg hover:-translate-y-1'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-x-2">
                  <svg className="inline w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : 'Submit Request'}
            </button>

          </form>


        </div>



      </main>


    </Layout>
  );
};

export default PreAccessPage;
