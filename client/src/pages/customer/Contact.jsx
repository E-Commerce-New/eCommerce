import {useState} from "react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState({});

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        console.log("Form submitted:", formData);

        setFormData({name: "", email: "", subject: "", message: ""});
        setErrors({});
        alert("Message sent!");
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Your Name</label>
                    <input
                        type="text"
                        name="name"
                        className="w-full p-2 border rounded-md focus:outline-0"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
                    {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
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
                    {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition"
                >
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default Contact;
