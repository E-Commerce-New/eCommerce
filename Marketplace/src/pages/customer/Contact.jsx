import React, {useRef, useState} from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const formRef = useRef();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const sendMail = (e) => {
        e.preventDefault();
        setSuccess(false);
        setError(false);

        emailjs
            .sendForm(
                "service_h5t3yre",
                "template_qo87sfc",
                formRef.current, // correct usage
                "fMSF5z3lM93bEf6HJ"
            )
            .then(
                (result) => {
                    console.log(result.text);
                    setSuccess(true);
                    setFormData({ name: "", email: "", subject: "", message: "" }); // reset form data
                },
                (error) => {
                    console.log(error);
                    setError(true);
                }
            );
    };


    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.subject.trim()) newErrors.subject = "Subject is required";
        if (!formData.message.trim()) newErrors.message = "Message is required";
        return newErrors;
    };


    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
            <form ref={formRef} onSubmit={sendMail} className="space-y-4">
            <div>
                    <label className="block text-gray-700">Your Name</label>
                    <input
                        type="text"
                        name="name"
                        className="w-full p-2 border rounded-md focus:outline-0"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Your Email</label>
                    <input
                        type="email"
                        name="email"
                        className="w-full p-2 border rounded-md focus:outline-0"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Subject</label>
                    <input
                        type="text"
                        name="subject"
                        className="w-full p-2 border rounded-md focus:outline-0"
                        value={formData.subject}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Message</label>
                    <textarea
                        name="message"
                        rows="5"
                        className="w-full p-2 border rounded-md focus:outline-0"
                        value={formData.message}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition"
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
        </div>
    );
};

export default Contact;
