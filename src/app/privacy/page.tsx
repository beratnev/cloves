import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Clove's",
  description: "Privacy Policy for Clove's premium beauty and skincare.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl py-16 md:py-24">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: July 18, 2026</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p>
            Welcome to Clove's ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p>
            This is a demo application. Any data entered into this platform is used strictly for demonstration purposes. However, in a real-world scenario, we would collect various types of information, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Financial Data:</strong> includes payment card details (which are securely processed by our payment partners).</li>
            <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal or regulatory obligation.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Your Legal Rights</h2>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at <strong>beratnevcanoglu@outlook.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
