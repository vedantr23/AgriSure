
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, CheckCircle } from 'lucide-react';

const ConfirmationAnimation: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <style>{`
            @keyframes feedback-scale-in {
                0% { transform: scale(0.7); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-feedback-in { animation: feedback-scale-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        `}</style>
        <div className="animate-feedback-in text-center bg-white p-8 rounded-lg shadow-xl">
            <CheckCircle className="text-green-500 mx-auto" size={80} strokeWidth={1.5} />
            <p className="text-xl font-bold text-text-primary mt-4">Thank you for your feedback!</p>
        </div>
    </div>
);

export const FeedbackScreen: React.FC = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [category, setCategory] = useState('General Comment');
    const [comments, setComments] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        if (showConfirmation) {
            const timer = setTimeout(() => {
                setShowConfirmation(false);
                navigate('/');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [showConfirmation, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please provide a star rating.");
            return;
        }
        console.log({ rating, category, comments });
        setShowConfirmation(true);
    };

    const categories = ['Bug Report', 'Feature Request', 'General Comment'];

    return (
        <div className="space-y-6">
            {showConfirmation && <ConfirmationAnimation />}
            <button onClick={() => navigate(-1)} className="flex items-center text-primary font-semibold mb-4">
                <ArrowLeft size={18} className="mr-1" />
                Back
            </button>
            <h2 className="text-2xl font-bold">Submit Feedback</h2>
            <p className="text-text-secondary">We value your input! Let us know how we can improve.</p>

            <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-md p-6 space-y-6">
                {/* Star Rating */}
                <div>
                    <label className="block text-lg font-semibold text-text-primary mb-2">How was your experience?</label>
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={32}
                                className={`cursor-pointer transition-colors ${
                                    (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill={(hoverRating || rating) >= star ? '#facc15' : 'none'}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-lg font-semibold text-text-primary mb-2">What is this about?</label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                type="button"
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${
                                    category === cat
                                        ? 'bg-primary border-primary text-white'
                                        : 'bg-transparent border-gray-300 text-text-secondary hover:bg-gray-100'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Comments */}
                <div>
                    <label htmlFor="comments" className="block text-lg font-semibold text-text-primary mb-2">
                        Your Comments
                    </label>
                    <textarea
                        id="comments"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Tell us more..."
                        rows={5}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400"
                    disabled={rating === 0}
                >
                    Submit Feedback
                </button>
            </form>
        </div>
    );
};
