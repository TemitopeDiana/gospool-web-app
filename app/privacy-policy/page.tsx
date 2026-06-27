import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Gospool',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 shadow-sm rounded-lg">
        <div className="mb-8">
          <Link
            href="/"
            className="text-primary hover:underline text-sm font-medium"
          >
            &larr; Back to Home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          GOSPOOL PRIVACY POLICY
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          <strong>Effective Date:</strong> 2026 <br />
          <strong>Last Updated:</strong> 2026
        </p>

        <div className="prose prose-primary max-w-none text-gray-700 space-y-6">
          <p>
            This Privacy Policy explains how Gospool (“we,” “our,” “us”)
            collects, uses, stores, and protects the personal data of
            individuals who use our ride-hailing service within church
            communities in Nigeria.
          </p>
          <p>
            We are committed to complying with the Nigeria Data Protection Act
            2023 (NDPA) and the Nigeria Data Protection Regulation 2019 (NDPR)
            in protecting your privacy and personal data.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Data Controller
            </h2>
            <p>
              Gospool operates as the Data Controller of your personal data. For
              any privacy inquiries, you may contact:
            </p>
            <ul className="list-none pl-0 mt-2 space-y-1">
              <li>
                <strong>Email:</strong> gospoolapp@gmail.com
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Data We Collect
            </h2>
            <p>
              We only collect the minimum personal data required to provide
              safe, reliable ride-hailing services.
            </p>

            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
              For Drivers (at registration):
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Full Name</li>
              <li>Phone Number</li>
              <li>Email Address</li>
              <li>Liveliness Video</li>
              <li>Photo of your vehicle</li>
              <li>Vehicle Information (Make, Model, Plate Number)</li>
              <li>Driver’s License Number (for verification)</li>
              <li>National ID Number (NIN) (for identity verification)</li>
              <li>Church Affiliation / Parish</li>
              <li>Next of Kin details</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
              For Passengers (at registration):
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Full Name</li>
              <li>Phone Number</li>
              <li>Email Address</li>
              <li>Liveliness Video</li>
              <li>National ID Number (NIN) (for identity verification)</li>
              <li>Church Affiliation / Parish</li>
              <li>Next of Kin details</li>
            </ul>

            <p className="mt-4">
              We also collect and store data on your activities on the Gospool
              platform. This data includes:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ride orders</li>
              <li>Location details</li>
              <li>Ride details such as route, duration etc</li>
              <li>Review data</li>
              <li>Complaints data</li>
              <li>Chat history</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Purpose of Data Processing
            </h2>
            <p>We process your personal data to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Verify user identity and membership within a church community
              </li>
              <li>Facilitate ride matching between drivers and passengers</li>
              <li>Ensure safety and accountability of rides</li>
              <li>Communicate updates, ride details, and support services</li>
              <li>Comply with regulatory and law enforcement requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Legal Basis for Processing
            </h2>
            <p>We process your data based on:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Consent</strong> which you have given at registration
                and before ride use
              </li>
              <li>
                <strong>Contractual necessity</strong> in furtherance to
                fulfilment of the ride hail service through the Gospool platform
              </li>
              <li>
                <strong>Legal obligation</strong> e.g., where required by
                Nigerian authorities
              </li>
              <li>
                <strong>Legitimate interest</strong> (ensuring platform safety
                and fraud prevention)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Data Sharing &amp; Disclosure
            </h2>
            <p>Your personal data may be shared with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Other registered users</strong> - limited data such as
                name, phone, picture and church for ride matching. This data
                will be available on a need to know basis and in such format
                that it cannot be stored, modified or transferred.
              </li>
              <li>
                <strong>Regulators or law enforcement</strong> where legally
                required
              </li>
              <li>
                <strong>Service providers</strong> for the purpose of
                verification or order processing. This is done under strict
                confidentiality agreements
              </li>
            </ul>
            <p className="mt-4 font-medium">
              Please note that Gospool does not sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Data Storage &amp; Retention
            </h2>
            <p>
              Your data will be stored securely in compliance with NDPR. Under
              no circumstance will we store your data in hard copy format. All
              data will be kept only as long as necessary to provide services
              and comply with legal obligations. At any time when you cease to
              use the application, your data records may be retained for up to 5
              years for audit and dispute resolution.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              7. Data Subject Rights
            </h2>
            <p>In line with the NDPA and NDPR, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Access your personal data</strong> - view your data on
                the Gospool platform
              </li>
              <li>
                <strong>Request correction of inaccurate data</strong> - correct
                any data previously captured incorrectly or update any data to
                reflect recent records
              </li>
              <li>
                <strong>Withdraw consent at any time</strong> - instruct us to
                stop processing your data on our platform generally or in
                specific
              </li>
              <li>
                <strong>Request deletion of your data</strong> - ask us to
                delete all records of your data on the Gospool platform.
                However, this is subject to legal obligations
              </li>
              <li>
                <strong>Object to processing</strong> in certain circumstances -
                particularly with respect to automated decision making
              </li>
              <li>
                <strong>Request data portability</strong> - ask us to transfer
                your data to any third party in furtherance of fulfilment of a
                service. This will be subject to appropriate security validation
                protocols.
              </li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please send an email to{' '}
              <strong>gospoolapp@gmail.com</strong>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              8. Security Measures
            </h2>
            <p>
              We implement appropriate technical and organizational measures
              including encryption, access controls, and secure servers to
              protect your personal data from unauthorized access, disclosure,
              alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              9. Cross-Border Data Transfer
            </h2>
            <p>
              Where data is transferred outside Nigeria, such transfers will
              comply with NDPR/NDPA requirements and only to countries with
              adequate data protection laws or subject to appropriate
              safeguards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              10. Children’s Privacy
            </h2>
            <p>
              Our service is not intended for children under 18 years. We do not
              knowingly collect data from minors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              11. Changes to this Policy
            </h2>
            <p>
              We may update this Privacy Policy periodically. Users will be
              notified of significant changes via email or platform
              notification.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              12. Contact Us
            </h2>
            <p>
              If you have questions, complaints, or requests regarding this
              Privacy Policy, contact our Data Protection Officer (DPO):
            </p>
            <ul className="list-none pl-0 mt-2 space-y-1">
              <li>
                <strong>Name:</strong> DPO
              </li>
              <li>
                <strong>Email:</strong> gospoolapp@gmail.com
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
