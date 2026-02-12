import { useState } from 'react';
import { api } from '../../services/api';
import { supabase } from '../../services/supabaseClient';

export default function FeedbackForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // Try backend API first
      await api.submitFeedback(form);
      setSuccessMsg('Your message has been sent! Thanks for reaching out.');
      setForm({ name: '', email: '', message: '' });

      // Create feedback circle in aquarium
      if (window.feedbackCirclesInstance) {
        window.feedbackCirclesInstance.createFeedbackCircle(form);
      }
    } catch {
      // Fallback: submit directly to Supabase
      try {
        const { error } = await supabase.from('feedback').insert([form]).select();
        if (error) throw error;
        setSuccessMsg('Your message has been sent! Thanks for reaching out.');
        setForm({ name: '', email: '', message: '' });
      } catch (err) {
        setErrorMsg('Failed to send message. Please try again.');
        console.error('Form error:', err);
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h3 className="feedback-title">Leave a thought. Watch it float.</h3>
      <input
        type="text"
        placeholder="Your Name"
        className="form-input"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        className="form-input"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <textarea
        placeholder="Your Message"
        className="form-textarea"
        rows="4"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        required
      />
      <button type="submit" className="form-submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
      {successMsg && <div className="success-message">{successMsg}</div>}
      {errorMsg && <div className="error-message">{errorMsg}</div>}
    </form>
  );
}
