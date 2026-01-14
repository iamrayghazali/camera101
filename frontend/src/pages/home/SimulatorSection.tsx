import {Link} from "react-router-dom";
import iPhoneSimDesktop from "../../assets/images/iphone-sim-desktop.png";
import iPhoneSimMobile from "../../assets/images/iphone-sim-mobile.png";

export default function SimulatorSection() {
    return (
        <section className="py-16 md:py-24 px-12 bg-dots bg-fixed bg-center bg-cover">
            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Content */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-rama font-bold text-gray-100 mb-6">
                            Check out our iPhone Simulator!
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                            Can't take pictures now? Try our iPhone Simulator and practice your photography skills
                            anywhere!
                        </p>
                        <div className="flex justify-center lg:justify-start">
                            <Link
                                to="/simulators/iphone"
                                className="inline-flex items-center  glass-thick text-white py-4 px-8 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Try Simulator for Free
                            </Link>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="relative">
                        <div className="hidden md:block">
                            <img
                                src={iPhoneSimDesktop}
                                alt="iPhone Simulator Desktop Preview"
                                className="w-full h-auto object-cover rounded-xl shadow-2xl"
                            />
                        </div>
                        <div className="block md:hidden">
                            <img
                                src={iPhoneSimMobile}
                                alt="iPhone Simulator Mobile Preview"
                                className="w-full h-auto object-cover rounded-xl shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}