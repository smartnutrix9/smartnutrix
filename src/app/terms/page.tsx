// src/app/terms/page.tsx
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: May 15, 2026</p>

      <div className="space-y-8 text-gray-600 leading-relaxed">

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
          <p>Welcome to SmartNutrix (smartnutrix.com). By accessing and using this website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Educational Purpose Only</h2>
          <p>All content on SmartNutrix — including nutrition facts, health calculators, food comparisons, blog articles, and AI-powered recommendations — is provided for <strong>educational and informational purposes only</strong>.</p>
          <p className="mt-2">Our content is <strong>NOT</strong> intended to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Replace professional medical advice, diagnosis, or treatment</li>
            <li>Serve as a substitute for consultation with a qualified healthcare provider</li>
            <li>Be used for diagnosing or treating any medical condition</li>
            <li>Provide personalized medical or dietary prescriptions</li>
          </ul>
          <p className="mt-2">Always consult a qualified healthcare professional, registered dietitian, or nutritionist before making changes to your diet, especially if you have existing health conditions, allergies, or are taking medication.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Nutrition Data Accuracy</h2>
          <p>Nutrition information displayed on SmartNutrix is sourced from the USDA FoodData Central database and other reliable sources. While we strive for accuracy, nutritional values may vary based on:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Food preparation methods and cooking techniques</li>
            <li>Brand-specific variations in ingredients</li>
            <li>Regional differences in food composition</li>
            <li>Natural variations in agricultural products</li>
            <li>Serving size estimations</li>
          </ul>
          <p className="mt-2">SmartNutrix does not guarantee the completeness or accuracy of any nutritional information and is not liable for any errors or omissions.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Health Calculators Disclaimer</h2>
          <p>Our health calculators (BMI, BMR, Calorie, Water Intake, Protein Intake) use standard formulas and equations widely accepted in the nutrition and fitness community. Results are <strong>general estimates</strong> and may not accurately reflect individual needs. Factors such as genetics, medical conditions, medications, and lifestyle variations can significantly affect individual requirements.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. User Responsibilities</h2>
          <p>By using SmartNutrix, you agree to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Use the information responsibly and at your own risk</li>
            <li>Not rely solely on our content for medical or health decisions</li>
            <li>Seek professional advice for specific dietary or health concerns</li>
            <li>Provide accurate information when using our calculators and tools</li>
            <li>Not misuse, copy, or redistribute our content without permission</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
          <p>All original content on SmartNutrix — including text, design, code, logos, and graphics — is the property of SmartNutrix and is protected by copyright law. You may not reproduce, distribute, or create derivative works without prior written permission.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Third-Party Links</h2>
          <p>Our website may contain links to third-party websites. SmartNutrix is not responsible for the content, privacy policies, or practices of any third-party sites. We encourage you to review the terms and privacy policies of any external websites you visit.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
          <p>SmartNutrix and its creators shall not be held liable for any direct, indirect, incidental, or consequential damages arising from the use of information provided on this website. This includes but is not limited to health issues, dietary problems, or any decisions made based on our content.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Image Credits and Attributions</h2>
          <p>SmartNutrix uses images from various sources. We gratefully acknowledge and thank the following platforms and their contributors:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Unsplash</strong> (unsplash.com) — Free high-quality photographs by talented photographers worldwide</li>
            <li><strong>Pexels</strong> (pexels.com) — Free stock photos and videos shared by creative contributors</li>
            <li><strong>Canva</strong> (canva.com) — Design platform used for creating and editing visual content</li>
            <li><strong>Adobe Firefly</strong> (adobe.com/firefly) — AI-powered image generation by Adobe</li>
          </ul>
          <p className="mt-2">All images are used in compliance with the respective platform's license terms. If you believe any image has been used incorrectly, please <Link href="/contact" className="underline" style={{color: '#1D9E75'}}>contact us</Link> and we will address it promptly.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Data Sources</h2>
          <p>Nutrition data on SmartNutrix is primarily sourced from:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>USDA FoodData Central</strong> — United States Department of Agriculture's comprehensive food nutrition database</li>
            <li>Published nutritional research and studies</li>
            <li>Verified food manufacturer data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to Terms</h2>
          <p>SmartNutrix reserves the right to update these Terms and Conditions at any time. Changes will be posted on this page with an updated date. Continued use of the website after changes constitutes acceptance of the modified terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Us</h2>
          <p>If you have any questions about these Terms and Conditions, please contact us:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Email: <a href="mailto:smartnutrix9@gmail.com" style={{color: '#1D9E75'}}>smartnutrix9@gmail.com</a></li>
            <li>Contact form: <Link href="/contact" style={{color: '#1D9E75'}}>smartnutrix.com/contact</Link></li>
          </ul>
        </section>

      </div>
    </div>
  );
}