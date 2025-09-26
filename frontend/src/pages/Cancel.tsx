import { Link } from 'react-router-dom';
import { AiOutlineExclamationCircle, AiOutlineHome, AiOutlineShoppingCart } from 'react-icons/ai';

export default function Cancel() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="mb-6">
                    <AiOutlineExclamationCircle className="text-6xl text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Canceled</h1>
                    <p className="text-gray-600 text-lg">
                        Something went wrong and your card was not charged.
                    </p>
                </div>
                
                <div className="space-y-4">
                    <p className="text-gray-500">
                        Don't worry - no payment was processed. You can try again or contact support if you need help.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <Link
                            to="/learn"
                            className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                        >
                            <AiOutlineShoppingCart className="text-lg" />
                            Browse Courses
                        </Link>
                        <Link
                            to="/"
                            className="btn btn-outline text-primary flex-1 flex items-center justify-center gap-2"
                        >
                            <AiOutlineHome className="text-lg" />
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}