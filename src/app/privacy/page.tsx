// src/app/privacy/page.tsx
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: May 15, 2026</p>

      <div className="space-y-8 text-gray-600 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
          <p>SmartNutrix ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit smartnutrix.com.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
          <p><strong>Information you provide directly:</strong></p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Name and email address (when using the contact form)</li>
            <li>Health data you enter into calculators (weight, height, age) — this is processed in your browser and NOT stored on our servers</li>
          </ul>
          <p className="mt-3"><strong>Information collected automatically:</strong></p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Browser type and version</li>
            <li>Device type (mobile, desktop)</li>
            <li>Pages visited and time spent</li>
            <li>Referring website</li>
            <li>IP address (anonymized)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To respond to your contact form submissions</li>
            <li>To improve our website content and user experience</li>
            <li>To analyze website traffic and usage patterns</li>
            <li>To display relevant advertisements (Google AdSense)</li>
            <li>To prevent fraud and ensure website security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Calculator Data Privacy</h2>
          <p>When you use our health calculators (BMI, BMR, Calorie, Water Intake, Protein Intake), all calculations are performed <strong>directly in your browser</strong>. Your personal health data (weight, height, age, gender) is <strong>never sent to or stored on our servers</strong>. This data stays on your device only.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies and Tracking</h2>
          <p>SmartNutrix uses cookies and similar technologies for:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
            <li><strong>Analytics cookies:</strong> Google Analytics to understand how visitors use our site</li>
            <li><strong>Advertising cookies:</strong> Google AdSense to display relevant advertisements</li>
          </ul>
          <p className="mt-2">You can control cookie preferences through your browser settings. Disabling cookies may affect some website functionality.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Google AdSense</h2>
          <p>We use Google AdSense to display advertisements on our website. Google may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{color: '#1D9E75'}}>Google Ad Settings</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>USDA FoodData Central:</strong> For nutrition data</li>
            <li><strong>Google Analytics:</strong> For website traffic analysis</li>
            <li><strong>Google AdSense:</strong> For displaying advertisements</li>
            <li><strong>Vercel:</strong> For website hosting</li>
            <li><strong>Supabase:</strong> For database services</li>
          </ul>
          <p className="mt-2">Each service has its own privacy policy governing data usage.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information. Our website uses HTTPS encryption for all data transmission. However, no method of internet transmission is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Children's Privacy</h2>
          <p>SmartNutrix is not directed at children under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us and we will promptly delete it.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Opt out of marketing communications</li>
            <li>Disable cookies through your browser settings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. We encourage you to review this page periodically.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Us</h2>
          <p>For any questions or concerns about this Privacy Policy, please contact us:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Email: <a href="mailto:smartnutrix9@gmail.com" style={{color: '#1D9E75'}}>smartnutrix9@gmail.com</a></li>
            <li>Contact form: <Link href="/contact" style={{color: '#1D9E75'}}>smartnutrix.com/contact</Link></li>
          </ul>
        </section>

      </div>
    </div>
  );
}