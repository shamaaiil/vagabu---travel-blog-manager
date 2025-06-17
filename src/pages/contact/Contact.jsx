import { useState } from "react";
import { Send, User, Mail, MessageSquare, CheckCircle, X } from "lucide-react";
import Header from "@/ui/Header";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Mock API call for demo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (Math.random() > 0.1) { // 90% success rate for demo
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setIsError(true);
      }
    }, 2000);
  };

  const closeSuccess = () => {
    setSuccess(false);
  };

  const closeError = () => {
    setIsError(false);
  };

  return (
    <>
    <Header title="Contact Us"/>
    <div className="min-h-screen bg-grey p-6 flex items-center justify-center relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pastelgrey rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-blue opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-grey border-2 border-blue rounded-2xl flex items-center gap-3 shadow-lg backdrop-blur-sm transition-all duration-500 animate-in slide-in-from-top relative">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-blue" />
            <p className="font-medium flex-1 text-blue">
              Message sent successfully! We'll get back to you soon.
            </p>
            <button
              onClick={closeSuccess}
              className="p-1 rounded-full hover:bg-blue hover:bg-opacity-20 transition-colors text-blue"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Message */}
        {isError && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-2xl flex items-center gap-3 shadow-lg backdrop-blur-sm transition-all duration-500 animate-in slide-in-from-top relative">
            <X className="text-red-600 w-5 h-5 flex-shrink-0" />
            <p className="text-red-800 font-medium flex-1">
              Failed to send message. Please try again.
            </p>
            <button
              onClick={closeError}
              className="p-1 rounded-full hover:bg-red-100 transition-colors text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white/95 p-8 rounded-3xl shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-3xl border border-pastelgrey/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2 tracking-tight text-blue">
              Get in Touch
            </h2>
            <p className="text-lg opacity-80 text-blue">
              We'd love to hear from you. Send us a message!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="relative group">
              <div className="relative">
                <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'name' ? 'text-blue' : 'text-pastelgrey'
                }`} />
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`w-full pl-12 pr-4 py-4 bg-grey rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.02] text-lg font-medium placeholder:opacity-60 text-black ${
                    focusedField === 'name' ? 'border-blue' : 'border-pastelgrey'
                  }`}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative group">
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'email' ? 'text-blue' : 'text-pastelgrey'
                }`} />
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className={`w-full pl-12 pr-4 py-4 bg-grey rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.02] text-lg font-medium placeholder:opacity-60 text-black ${
                    focusedField === 'email' ? 'border-blue' : 'border-pastelgrey'
                  }`}
                />
              </div>
            </div>

            {/* Message Field */}
            <div className="relative group">
              <div className="relative">
                <MessageSquare className={`absolute left-4 top-6 w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'message' ? 'text-blue' : 'text-pastelgrey'
                }`} />
                <textarea
                  name="message"
                  placeholder="Let us know your thoughts, suggestions, or favorite destinations.."
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  required
                  rows={5}
                  className={`w-full pl-12 pr-4 py-4 bg-grey rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:scale-[1.02] text-lg font-medium placeholder:opacity-60 resize-none text-black ${
                    focusedField === 'message' ? 'border-blue' : 'border-pastelgrey'
                  }`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue hover:bg-blue/90 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-70 disabled:cursor-not-allowed transform-gpu"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending Message...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm opacity-70 text-blue">
              We typically respond within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
        </>
  );
};

export default Contact;