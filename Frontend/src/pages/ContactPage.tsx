import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, FileText, Star } from 'lucide-react';
import {Button} from '../components/ui/button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    contactType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Handle success
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      contactType: 'general'
    });
    setIsSubmitting(false);
  };

  const contactTypes = [
    { value: 'general', label: 'General Inquiry', icon: MessageSquare },
    { value: 'recipe_request', label: 'Recipe Request', icon: FileText },
    { value: 'feedback', label: 'Feedback', icon: Star },
    { value: 'technical', label: 'Technical Support', icon: MessageSquare },
    { value: 'partnership', label: 'Partnership', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have a question, recipe request, or feedback? We'd love to hear from you! 
            Our team is here to help and always excited to connect with fellow food enthusiasts.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#78C841]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-[#78C841]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-2">We typically respond within 24 hours</p>
              <a href="mailto:contact@foodfusion.com" className="text-[#78C841] hover:text-[#6bb03a] font-medium">
                contact@foodfusion.com
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#B4E50D]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-[#B4E50D]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-2">Monday - Friday, 9 AM - 6 PM EST</p>
              <a href="tel:+1-555-123-4567" className="text-[#B4E50D] hover:text-[#a3d40c] font-medium">
                +1 (555) 123-4567
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF9B2F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-[#FF9B2F]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-2">FoodFusion Headquarters</p>
              <p className="text-gray-600">
                123 Culinary Street<br />
                Foodie City, FC 12345
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Office Hours</h3>
            <div className="flex items-center justify-center space-x-8 text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Monday - Friday: 9:00 AM - 6:00 PM EST</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Saturday: 10:00 AM - 4:00 PM EST</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Closed on Sundays and major holidays</p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78C841] focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78C841] focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactType" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Type *
                </label>
                                  <select
                    id="contactType"
                    name="contactType"
                    value={formData.contactType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78C841] focus:border-transparent"
                  >
                  {contactTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78C841] focus:border-transparent"
                    placeholder="Brief description of your inquiry"
                  />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78C841] focus:border-transparent"
                    placeholder="Please provide details about your inquiry, recipe request, or feedback..."
                  />
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-4"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How can I submit my own recipe?
              </h3>
              <p className="text-gray-600">
                You can submit your recipe through our Community Cookbook page. Simply click on "Share Your Recipe" 
                and fill out the form with your recipe details, ingredients, and instructions.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I request a specific recipe?
              </h3>
              <p className="text-gray-600">
                Absolutely! Use the contact form above and select "Recipe Request" as the contact type. 
                We'll do our best to find or create the recipe you're looking for.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How do I report an issue with the website?
              </h3>
              <p className="text-gray-600">
                For technical issues, please select "Technical Support" as the contact type when sending us a message. 
                Include details about the problem and your device/browser information.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Are you looking for content contributors?
              </h3>
              <p className="text-gray-600">
                Yes! We're always looking for passionate food enthusiasts to contribute recipes, tips, and articles. 
                Select "Partnership" as the contact type and tell us about your culinary expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#78C841]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Don't just browse recipes - become part of our growing community of food lovers, 
            share your knowledge, and discover new culinary adventures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" size="lg" className="bg-white text-[#78C841] hover:bg-gray-100">
              Sign Up Now
            </Button>
            <Button size="lg" className="bg-white text-[#78C841] hover:bg-gray-100">
              Explore Recipes
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
