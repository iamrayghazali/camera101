import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AiOutlineCheckCircle, AiOutlinePlayCircle } from 'react-icons/ai';

export default function Success() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [courseSlug, setCourseSlug] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get course slug from URL parameters
        const slug = searchParams.get('course');
        setCourseSlug(slug);
        setLoading(false);

        // Auto-redirect to course after 3 seconds
        if (slug) {
            const timer = setTimeout(() => {
                navigate(`/${slug}`);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [searchParams, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="mb-6">
                    <AiOutlineCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
                    <p className="text-gray-600 text-lg">
                        Welcome to your new course! You now have lifetime access.
                    </p>
                </div>
                
                <div className="space-y-4">
                    <p className="text-gray-500">
                        {courseSlug 
                            ? `Redirecting you to your course in a few seconds...`
                            : 'You can now access your course from the lessons page.'
                        }
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        {courseSlug && (
                            <button
                                onClick={() => navigate(`/${courseSlug}`)}
                                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                            >
                                <AiOutlinePlayCircle className="text-lg" />
                                Start Learning Now
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/lessons')}
                            className="btn btn-outline flex-1 flex items-center justify-center gap-2"
                        >
                            View All Courses
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}