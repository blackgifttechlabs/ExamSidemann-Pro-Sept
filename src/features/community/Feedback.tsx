import React, { useState } from 'react';
import { Send, Star } from 'lucide-react';

export const Feedback: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;

    const subject = `Exam Sidemann feedback${rating ? ` (${rating}/5)` : ''}`;
    const body = [`Rating: ${rating || 'Not provided'}/5`, '', message.trim()].join('\n');
    window.location.href = `mailto:blackgiftechlabs@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 max-w-2xl mx-auto animate-dropdown-reveal">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">We value your feedback</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Help us improve Exam Sidemann. Tell us what you love or what could be better.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full bg-white dark:bg-navy-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-navy-700">
        
        {/* Rating */}
        <div className="flex flex-col items-center mb-8">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Rate your experience</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110 focus:outline-none"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  size={32} 
                  className={`${(hoveredRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'} transition-colors`} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your message
          </label>
          <textarea 
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
            maxLength={3000}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-navy-900 border border-gray-200 dark:border-navy-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-android-blue dark:focus:ring-orange-500 outline-none resize-none transition-all"
            placeholder="Tell us about your experience..."
          ></textarea>
        </div>

        <p className="mb-4 text-xs leading-5 text-gray-500 dark:text-gray-400">
          This opens your email app with the feedback filled in. Exam Sidemann does not receive it until you send that email.
        </p>

        <button type="submit" disabled={!message.trim()} className="w-full flex items-center justify-center gap-2 bg-android-blue dark:bg-orange-600 hover:bg-blue-600 dark:hover:bg-orange-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50">
          <Send size={18} />
          Continue in Email
        </button>
      </form>
    </div>
  );
};
