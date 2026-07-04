import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rotary-blue to-rotary-dark-blue text-white py-16 lg:py-24 overflow-hidden" aria-labelledby="hero-title">
        <div 
          className="absolute inset-0 opacity-[3%]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '60px 60px' }}
          aria-hidden="true"
        />

        {/* Logo */}
        <div className="container mx-auto px-4 relative z-[5] text-center mb-8">
          <Link href="/" 
            className="inline-flex items-center space-x-3 group transition-all duration-300 hover:bg-white/10 rounded-lg p-2" 
            aria-label="Go to home page"
          >
            <div role="img" 
              className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border-2 border-white/30 overflow-hidden cursor-pointer"
            >
              <Image src="/rotary-logo.png" alt="Rotary logo" width={64} height={64} className="h-full w-full object-contain" priority />
            </div>
          </Link>

          <h1 id="hero-title" className="text-4xl lg:text-[3rem] font-bold mb-4 leading-tight mt-2 animate-fade-in-down">Join Our Community</h1>
          <p 
            data-style="description-lg" 
            className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed pt-5 transition-colors duration-[.75s] ease-in-out animate-fade-in-down delay-[.5s]"
          >Request free access to Rotary Club HUB Projects and start creating impact.</p>

        </div>

      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 lg:py-[7rem] -mt-8 relative z-[5]" aria-labelledby="hero-title">
        
        <div 
          id="pre-access-section"
          role="region"
          className="bg-white rounded-xl shadow-lg p-8 lg:p-12 min-h-min border-t-[5px] border-yellow-500 animate-fade-in-up max-w-4xl mx-auto"
        >

          {/* Header Section */}
          <div className="mb-8">
            <h2 id="form-title-class" role="heading" tabIndex={1}>Pre-Access Request</h2>            
            <p 
              data-style="description-lg" 
              aria-labelledby="hero-title"
              className="text-gray-600 mb-8 leading-relaxed text-base lg:text-lg tracking-wide pt-3 transition-colors duration-[.75s] px-2 md:pt-4 animate-fade-in-up"
            >
              Fill out the form below to request access to the HUB Projects portal. 
              An administrator will review your request and respond within 48 business hours.
            </p>

          </div>


          {/* Form Fields */}
          
          <form className="flex-grow w-full max-w-md mx-auto space-y-6" onSubmit={handleSubmit}> 

            {Object.keys(errors).length > 0 && ( 
              <strong role="alert" aria-live="assertive">Please correct the errors below.</strong>
            )}

            <InputField id="fullName" name="fullName" label="Full Name" value={formData.fullName} error={errors.fullName} placeholder="Enter your full name" onChange={handleChange} />

            {/* Email */}
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

            <InputField id="clubName" name="clubName" label="Rotary Club Name" value={formData.clubName} error={errors.clubName} placeholder="Enter your club name" onChange={handleChange} />

            <InputField 
              id="position" 
              name="position" 
              label="Position or Role in the Club"
              value={formData.position}
              error={errors.position}
              placeholder="Example: President, Member, etc."
              onChange={handleChange}
            />

            <div className={`mb-6 ${errors.phoneNumber ? 'bg-red-50 border-l-4 border-red-500' : ''}`}>
              <label htmlFor="phoneNumber" className="block text-sm font-semibold mb-2">
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

            <InputField id="country" name="country" label="Country or Region" value={formData.country} error={errors.country} placeholder="Enter your country or region" onChange={handleChange} />

            <div className={`mb-8 ${errors.message ? 'bg-red-50 border-l-4 border-red-500' : ''}`}>
              <label htmlFor="message" className="block text-sm font-semibold mb-2">
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
                rows={5}
                placeholder="Explain why you need access to the HUB Projects portal..."
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none ${errors.message ? 'border-red-300' : 'border-gray-300'} focus:ring-blue-500`}
              />
              {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
            </div>

            {/* Button Submit */}
            <button 
              type="submit" 
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className={`w-full py-4 px-6 rounded-lg font-bold text-white shadow-md transition-all duration-[.9s] ease-in-out ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed opacity-75' : 
                Object.keys(errors).length > 0 ? 'bg-red-500 cursor-not-allowed opacity-75' : 
                'bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-600 hover:from-yellow-400 hover:via-purple-600 shadow-lg hover:-translate-y-1'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-x-2">
                  Sending your request...
                  <svg className={`inline w-5 h-5 text-white animate-spin`}>
                    <circle cx="12" cy="12" r="9" fill="none" strokeWidth={3} />
                  </svg>
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
