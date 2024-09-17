import React from "react";
import { Link } from "react-router-dom";
import Contact from "../components/HomePage/Contact";
import Testimonials from "../components/HomePage/Testimonials";

const TermsAndCondition = () => {
    return (
        <>
            <section className="about-area  pd-top-100 pd-bottom-70">
                <div className="container">
                    <div>
                        <h3>Terms & Conditions</h3>
                        <h4>Welcome to FlipBundle.com</h4>
                        <p>By accessing and using FlipBundle.com ("Website"), you agree to comply with and be bound by the following terms and conditions ("Terms"). Please read them carefully before using our Website.</p>
                    </div>

                    <div>
                        <h4>1. Acceptance of Terms</h4>
                        <p>By registering, accessing, or using any services provided on FlipBundle.com, you agree to these Terms. If you do not agree, you must not use the Website.</p>
                    </div>
                    <div>
                        <h4>2. Eligibility</h4>
                        <p>You must be at least 18 years old to use our services. By using our Website, you represent and warrant that you are of legal age to form a binding contract.</p>
                    </div>
                    <div>
                        <h4>3. Account Registration</h4>
                        <p>To sell or purchase products, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.</p>
                    </div>
                    <div>
                        <h4>4. User Responsibilities</h4>
                        <li>Accuracy of Information: You agree to provide accurate, current, and complete information during the registration process and keep your account information updated.</li>
                        <li>Prohibited Activities: You agree not to use the Website for any unlawful or prohibited activities, including, but not limited to, distributing malware, spamming, or violating intellectual property rights.</li>
                    </div>
                    
                    <div>
                        <h4>5. Product Listings</h4>
                        <li>Sellers: Must ensure that all products listed comply with our guidelines and do not infringe on any third-party rights. Sellers are responsible for the accuracy and legality of their listings.</li>
                        <li>Buyers: Should review product details carefully before making a purchase. All sales are final, and refunds are only provided under specific conditions as outlined in our Refund Policy.</li>
                    </div>
                    <div>
                        <h4>6. Payments and Fees</h4>
                        <p>All transactions must be completed through our secure payment gateway. We may charge fees for transactions, which will be clearly stated at the time of purchase or sale.</p>
                    </div>
                    <div>
                        <h4>7. Intellectual Property</h4>
                        <p>All content on FlipBundle.com, including logos, designs, text, graphics, and software, is the property of FlipBundle.com or its licensors and is protected by intellectual property laws. You may not use any content without our explicit permission.</p>
                    </div>
                    <div>
                        <h4>8. Privacy Policy</h4>
                        <p>Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your information.</p>
                    </div>
                    <div>
                        <h4>9. Termination</h4>
                        <p>We reserve the right to suspend or terminate your account and access to our services at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or our business interests.</p>
                    </div>
                    <div>
                        <h4>10. Limitation of Liability</h4>
                        <p>FlipBundle.com is not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Website or our services. Our total liability to you for any claim arising from your use of the Website is limited to the amount you paid for the service.</p>
                    </div>
                    <div>
                        <h4>11. Changes to Terms</h4>
                        <p>We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting on the Website. Your continued use of the Website after changes are posted constitutes your acceptance of the new Terms.</p>
                    </div>
                    <div>
                        <h4>12. Governing Law</h4>
                        <p>These Terms are governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.</p>
                    </div>
                    <div>
                        <h4>Contact Us</h4>
                        <p>If you have any questions or concerns about these Terms, please contact us at [support@flipbundle.com].</p>
                    </div>
                    <div>
                        <h4>Seller Conditions</h4>
                        <p>FlipBundle.com will take a 20% commission from the seller when an item is successfully sold.</p>
                        <p>If a seller accidentally opens a dispute from their bank, card, or PayPal and the dispute is resolved in favor of the buyer, we will also refund the amount from the seller.</p>
                        <p>Sellers can sell bulk digital assets like bulk templates, bulk databases, bulk photography, bulk images, bulk email databases, etc. Sellers cannot sell any illegal items.</p>
                    </div>
                    <div>
                        <h4>Buyer Conditions</h4>
                        <p>All sales are final, and refunds are only provided under specific conditions as outlined in our Refund Policy.</p>
                        <p>Buyers should review product details carefully before making a purchase.</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default TermsAndCondition;
