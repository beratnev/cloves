import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Clove's",
  description: "Cookie Policy for Clove's premium beauty and skincare.",
};

export default function CookiePolicyPage() {
  return (
    <div className="container max-w-4xl py-16 md:py-24">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: July 18, 2026</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p>
            This Cookie Policy explains how Clove's uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. What are cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Why do we use cookies?</h2>
          <p>
            Since this is a demo site, we use very few cookies. However, typically, we use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas (like the admin panel or your user profile).</li>
            <li><strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our website but are non-essential to their use.</li>
            <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How can I control cookies?</h2>
          <p>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Updates to this policy</h2>
          <p>
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Where can I get further information?</h2>
          <p>
            If you have any questions about our use of cookies or other technologies, please email us at <strong>beratnevcanoglu@outlook.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
