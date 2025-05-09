import React, {useEffect, useRef, useState} from "react";
import emailjs from '@emailjs/browser';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function LandingPage() {
    const form = useRef();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    const sendMail = (e) => {
        e.preventDefault();
        setSuccess(false);
        setError(false);

        emailjs
            .sendForm(
                "service_h5t3yre",
                "template_ct4mzos",
                form.current,
                "fMSF5z3lM93bEf6HJ"
            )
            .then(
                (result) => {
                    console.log(result.text);
                    setSuccess(true);
                    form.current.reset();
                },
                (error) => {
                    console.log(error.text);
                    setError(true);
                }
            );
    };


    return (
        <main className="bg-[#0f0f0f] text-white min-h-screen font-sans scroll-smooth">
            {/* Hero Section */}
            <section className="text-center py-24 px-6 md:px-16">
                <h1 className="text-5xl md:text-6xl font-bold mb-4" data-aos="fade-up">
                    You are a Vendor, Not a Developer!
                </h1>
                <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto" data-aos="fade-up">
                    Launch, grow, and scale your eCommerce business with no coding required. Enjoy custom storefronts, AI-powered tools, marketing, WhatsApp automation, shipping, and more.
                </p>
                <div className="mt-10" data-aos="fade-up">
                    <a
                        href="#contact"
                        className="text-lg px-6 py-4 bg-indigo-600 hover:bg-indigo-700 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] rounded-xl transition-all"
                    >
                        Get Started Free
                    </a>

                </div>
            </section>

            <div className="flex w-6/12 m-auto py-6" data-aos="fade-up">
            <img
                src="../../public/Analytics.svg"
                alt="Analytics"
                className="w-full rounded-lg transition-transform duration-500 hover:scale-105"
            />
            </div>


            {/* Journey Hierarchy */}
            <section className="py-16 px-6 md:px-20 bg-[#1a1a1a]">
                <h2 className="text-4xl font-bold mb-10 text-center" data-aos="fade-up">Your Journey With Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    {[
                        { step: "1. Join Us", desc: "Sign up in minutes. No upfront cost, no hassle." },
                        { step: "2. Grow Your Sales", desc: "Use smart tools to attract and convert customers." },
                        { step: "3. Achieve Profit", desc: "Maximize revenue through automation and data insights." },
                        { step: "4. Create Your Branch", desc: "Expand into new markets and launch sub-brands." }
                    ].map((item, i) => (
                        <div key={i} data-aos="fade-up">
                            <h3 className="text-xl font-semibold mb-2">{item.step}</h3>
                            <p className="text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 md:px-20 bg-[#0f0f0f]">
                <h2 className="text-4xl font-bold mb-10 text-center">What We Offer</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Custom Website", desc: "Get your own beautifully branded storefront." },
                        { title: "Marketplace Access", desc: "List your products in our growing vendor ecosystem." },
                        { title: "Conversion Optimized", desc: "Boost sales with smart product listings and user flows." },
                        { title: "WhatsApp Integration", desc: "Automated order updates, chats, and customer support." },
                        { title: "Shipping Integrations", desc: "Link with top couriers for fast & trackable delivery." },
                        { title: "Social Media Handle", desc: "Connect and convert via Instagram, Facebook & more." },
                        { title: "AI Post & Content", desc: "Generate stunning social media posts and product descriptions instantly." },
                        { title: "AI Campaign Assistant", desc: "Create, schedule, and optimize marketing with AI suggestions." },
                        { title: "0 Maintenance", desc: "We handle everything so you can focus on selling." }
                    ].map((item, i) => (
                        <div key={i} className="bg-[#1f1f1f] p-6 rounded-2xl shadow-md text-center transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(256,256,256,0.4)]" data-aos="fade-up">
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-20 px-6 md:px-20 bg-[#1a1a1a] text-center">
                <h2 className="text-4xl font-bold mb-10" data-aos="fade-up">Transparent Pricing</h2>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-[#2a2a2a] p-6 rounded-xl" data-aos="fade-up">
                        <h3 className="text-2xl font-bold mb-2">₹0 Setup</h3>
                        <p className="text-gray-400">Start without any setup fees.</p>
                    </div>
                    <div className="bg-[#2a2a2a] p-6 rounded-xl" data-aos="fade-up">
                        <h3 className="text-2xl font-bold mb-2">₹0 Subscription</h3>
                        <p className="text-gray-400">No monthly charges. Pay as you grow.</p>
                    </div>
                    <div className="bg-[#2a2a2a] p-6 rounded-xl" data-aos="fade-up">
                        <h3 className="text-2xl font-bold mb-2">0% Commission</h3>
                        <p className="text-gray-400">Keep 100% of your revenue.</p>
                    </div>
                </div>
                <p className="text-gray-500 mt-6 text-lg" data-aos="fade-up">
                    Pay-as-you-go model. Ideal for D2C brands and small sellers looking to scale smartly.
                </p>
            </section>


            {/* Mission Section */}
            <section className="py-20 px-6 md:px-20 bg-[#0f0f0f] text-center">
                <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-gray-400 max-w-3xl mx-auto text-lg" data-aos="fade-up">
                    We empower small businesses and solo entrepreneurs to scale eCommerce without the burden
                    of technical knowledge. Our mission is to democratize digital selling by offering a
                    plug-and-play SaaS platform that’s as powerful as Shopify and as simple as flipping a
                    switch. Built for the D2C generation.
                </p>
            </section>

            {/* Contact Section */}
            <section className="bg-[#0f0f0f] text-white py-20 px-6 md:px-20" id="contact">
                <h2 className="text-4xl font-bold mb-6 text-center">Contact Us</h2>
                <p className="text-gray-400 text-center mb-12">
                    Have questions or want to collaborate? Drop us a message below.
                </p>

                <form ref={form} onSubmit={sendMail} className="max-w-2xl mx-auto space-y-6" data-aos="fade-up">
                    <div>
                        <label className="block mb-2 text-sm font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full p-3 rounded bg-[#1a1a1a] border border-gray-600 text-white"

                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            className="w-full p-3 rounded bg-[#1a1a1a] border border-gray-600 text-white"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full p-3 rounded bg-[#1a1a1a] border border-gray-600 text-white"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium">Message</label>
                        <textarea
                            name="message"
                            rows="5"
                            required
                            className="w-full p-3 rounded bg-[#1a1a1a] border border-gray-600 text-white"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-semibold transition"
                    >
                        Send Message
                    </button>

                    {success && (
                        <p className="text-green-400 mt-4 text-center">Message sent successfully!</p>
                    )}
                    {error && (
                        <p className="text-red-500 mt-4 text-center">Oops! Something went wrong.</p>
                    )}
                </form>

                <p className="text-center mt-12 text-gray-500">
                    Or email us directly:{" "}
                    <a href="mailto:mrxguptaaa@gmail.com" className="text-indigo-400 underline">
                        mrxguptaaa@gmail.com
                    </a>
                </p>
            </section>

            {/* Footer */}
            <footer className="bg-[#0f0f0f] text-center py-10 border-t border-gray-700">
                <p className="text-gray-500">&copy; 2025 YourSaaSCommerce. All rights reserved.</p>
            </footer>
        </main>
    );
}
