import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Zod schema for validation
const preAccessSchema = z.object({
  fullName: z.string().min(2, "Name completo deve ter pelo menos 2 caracteres"),
  email: z.string().email("Invalid email"),
  clubName: z.string().min(2, "Club name deve ter pelo menos 2 caracteres"),
  position: z.string().min(2, "Role or position must have at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must have at least 10 digits"),
  country: z.string().min(2, "Country/Region deve ter pelo menos 2 caracteres"),
  message: z.string().min(10, "Message deve ter pelo menos 10 caracteres"),
});

type PreAccessFormDate = z.infer<typeof preAccessSchema>;

interface PreAccessFormProps {
  onSubmit: (data: PreAccessFormDate) => void;
}

const PreAccessForm: React.FC<PreAccessFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PreAccessFormDate>({
    resolver: zodResolver(preAccessSchema),
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmitHandler = async (data: PreAccessFormDate) => {
    try {
      await onSubmit(data);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-rotary-blue mb-4">Request Sent Successfully!</h2>
        <p className="mb-4">
          Your pre-access request was sent successfully. Please wait for administrator approval.
        </p>
        <p className="mb-4">
          You will receive an email when your request is reviewed.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="btn-primary"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-rotary-blue mb-6">Pre-Access Request</h2>
      
      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            {...register("fullName")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-rotary-blue'
            }`}
            placeholder="Your full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-rotary-blue'
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 mb-1">
            Name do Club Rotary *
          </label>
          <input
            id="clubName"
            type="text"
            {...register("clubName")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.clubName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-rotary-blue'
            }`}
            placeholder="Name do seu clube Rotary"
          />
          {errors.clubName && (
            <p className="mt-1 text-sm text-red-600">{errors.clubName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
            Role or Function *
          </label>
          <input
            id="position"
            type="text"
            {...register("position")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.position ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-rotary-blue'
            }`}
            placeholder="Your role or position in the club"
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            id="phoneNumber"
            type="tel"
            {...register("phoneNumber")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-rotary-blue'
            }`}
            placeholder="(11) 99999-9999"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country / Region *
          </label>
          <input
            id="country"
            type="text"
            {...register("country")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.country ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-rotary-blue'
            }`}
            placeholder="Country or region"
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            id="message"
            rows={4}
            {...register("message")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-rotary-blue'
            }`}
            placeholder="Explain why you need access to the HUB Projects portal..."
          ></textarea>
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full btn-primary ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Sending...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreAccessForm;