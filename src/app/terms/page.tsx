import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Clove's",
  description: "Terms of Service for Clove's premium beauty and skincare.",
};

export default function TermsOfServicePage() {
  return (
    <div className="container max-w-4xl py-16 md:py-24">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: July 18, 2026</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p>
            Welcome to Clove's. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our platform, you agree to comply with and be bound by these Terms.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use Clove's if you do not agree to take all of the terms and conditions stated on this page. This website is a demo and primarily serves as a template or portfolio project.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Products and Services</h2>
          <p>
            All products and services listed on this site are for demonstration purposes only. You cannot actually purchase any physical products through this platform. Prices, descriptions, and stock levels are simulated to showcase platform capabilities.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password, whether your password is with our service or a third-party service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are and will remain the exclusive property of Clove's and its licensors. The service is protected by copyright, trademark, and other laws of both the country and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Clove's.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Termination</h2>
          <p>
            We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at <strong>beratnevcanoglu@outlook.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
