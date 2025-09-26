import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";

export default function FAQ() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-4xl py-20 px-4">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Everything you need to know about our photography courses
                        </p>
                    </div>

                    <div className="join join-vertical w-full">
                        <div className="collapse collapse-arrow join-item border border-gray-200 bg-white shadow-sm">
                            <input type="radio" name="faq-accordion" defaultChecked />
                            <div className="collapse-title text-lg font-semibold text-gray-900">
                                Do I need expensive camera equipment to start?
                            </div>
                            <div className="collapse-content">
                                <p className="text-gray-600 leading-relaxed">
                                    Not at all! Our courses are designed to work with any camera, from smartphones to professional DSLRs. 
                                    We'll teach you the fundamentals that apply to all photography equipment.
                                </p>
                            </div>
                        </div>

                        <div className="collapse collapse-arrow join-item border border-gray-200 bg-white shadow-sm">
                            <input type="radio" name="faq-accordion" />
                            <div className="collapse-title text-lg font-semibold text-gray-900">
                                How long do I have access to the courses?
                            </div>
                            <div className="collapse-content">
                                <p className="text-gray-600 leading-relaxed">
                                    Once you purchase a course, you have lifetime access. You can learn at your own pace and 
                                    revisit the material anytime, even years from now.
                                </p>
                            </div>
                        </div>

                        <div className="collapse collapse-arrow join-item border border-gray-200 bg-white shadow-sm">
                            <input type="radio" name="faq-accordion" />
                            <div className="collapse-title text-lg font-semibold text-gray-900">
                                Are there any prerequisites for the courses?
                            </div>
                            <div className="collapse-content">
                                <p className="text-gray-600 leading-relaxed">
                                    No prior photography experience is required. Our courses start from the basics and gradually 
                                    build up to advanced techniques, making them perfect for complete beginners.
                                </p>
                            </div>
                        </div>

                        <div className="collapse collapse-arrow join-item border border-gray-200 bg-white shadow-sm">
                            <input type="radio" name="faq-accordion" />
                            <div className="collapse-title text-lg font-semibold text-gray-900">
                                Can I get a refund if I'm not satisfied?
                            </div>
                            <div className="collapse-content">
                                <p className="text-gray-600 leading-relaxed">
                                    Yes! We offer a 30-day money-back guarantee. If you're not completely satisfied 
                                    with your course, we'll refund your purchase, no questions asked.
                                </p>
                            </div>
                        </div>

                        <div className="collapse collapse-arrow join-item border border-gray-200 bg-white shadow-sm">
                            <input type="radio" name="faq-accordion" />
                            <div className="collapse-title text-lg font-semibold text-gray-900">
                                What's included in the free preview lessons?
                            </div>
                            <div className="collapse-content">
                                <p className="text-gray-600 leading-relaxed">
                                    Free preview lessons give you access to the first lesson of each course, allowing you to 
                                    experience our teaching style and course quality before making a purchase.
                                </p>
                            </div>
                        </div>

                        <div className="collapse collapse-arrow join-item border border-gray-200 bg-white shadow-sm">
                            <input type="radio" name="faq-accordion" />
                            <div className="collapse-title text-lg font-semibold text-gray-900">
                                How do I access my courses after purchase?
                            </div>
                            <div className="collapse-content">
                                <p className="text-gray-600 leading-relaxed">
                                    After purchasing, you'll receive an email with login instructions. Simply log in to your 
                                    account and navigate to the "My Courses" section to access all your purchased content.
                                </p>
                            </div>
                        </div>

                        <div className="collapse collapse-arrow join-item border border-gray-200 bg-white shadow-sm">
                            <input type="radio" name="faq-accordion" />
                            <div className="collapse-title text-lg font-semibold text-gray-900">
                                What makes your courses different from free YouTube tutorials?
                            </div>
                            <div className="collapse-content">
                                <p className="text-gray-600 leading-relaxed">
                                    Our courses are structured, comprehensive, and designed for progression. Unlike scattered 
                                    YouTube tutorials, we provide a complete learning path from beginner to advanced, with 
                                    hands-on exercises and professional feedback.
                                </p>
                            </div>
                        </div>

                        <div className="collapse collapse-arrow join-item border border-gray-200 bg-white shadow-sm">
                            <input type="radio" name="faq-accordion" />
                            <div className="collapse-title text-lg font-semibold text-gray-900">
                                Do you offer certificates of completion?
                            </div>
                            <div className="collapse-content">
                                <p className="text-gray-600 leading-relaxed">
                                    Yes! Upon completing any course, you'll receive a certificate of completion that you can 
                                    add to your portfolio or LinkedIn profile to showcase your photography skills.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}