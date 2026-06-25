import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Shield, Scale, ScrollText } from "lucide-react";

const TermsPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="text-center pb-8 border-b border-gray-100">
          <div className="mx-auto bg-blue-500/10 p-3 rounded-full w-fit mb-4">
            <ScrollText className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Terms & Conditions
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Last Updated: June 25, 2026
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 max-w-4xl mx-auto space-y-8 text-gray-600 leading-relaxed">
          {/* Section 1: Agreement */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-xl text-gray-900">
              <Scale className="h-5 w-5 text-blue-600" />
              <h2>1. Agreement to Terms</h2>
            </div>
            <p>
              Welcome to **Finova**. These Terms & Conditions govern your access to and use of our website, mobile application, and financial management services. By creating an account, logging in, or using Finova, you agree to be bound by these terms. If you do not agree to all of these terms, you are prohibited from using the service.
            </p>
          </section>

          {/* Section 2: User Accounts */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-xl text-gray-900">
              <Shield className="h-5 w-5 text-blue-600" />
              <h2>2. User Registration and Security</h2>
            </div>
            <p>
              To access certain features of the app, you may be required to register for an account. You agree to provide accurate, current, and complete information during registration. You are solely responsible for maintaining the confidentiality of your account credentials (including password and two-factor authentication tokens) and for all activities that occur under your account.
            </p>
            <p>
              If you suspect any unauthorized access or security breach, you must notify Finova administration immediately. We reserve the right to suspend or terminate accounts that violate our security policies.
            </p>
          </section>

          {/* Section 3: Third-Party Connections (Plaid) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-xl text-gray-900">
              <FileText className="h-5 w-5 text-blue-600" />
              <h2>3. Third-Party Connections & Banking Data</h2>
            </div>
            <p>
              Finova utilizes **Plaid** to link and sync your financial transactions. By using our bank connection feature, you grant Finova and Plaid the authority to access, retrieve, and import your financial data on a read-only basis.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>**Read-Only Access**: Finova never has access to, nor stores, your bank login credentials (usernames or passwords). All authentication is handled directly by Plaid.</li>
              <li>**Accuracy of Data**: Finova is not responsible for any inaccuracies, delays, or omissions in the transaction data provided by Plaid or your financial institution.</li>
              <li>**Revocation**: You may disconnect your bank accounts at any time from the Accounts tab, which will immediately cease further data synchronization.</li>
            </ul>
          </section>

          {/* Section 4: Premium Subscriptions & Billing */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-xl text-gray-900">
              <ScrollText className="h-5 w-5 text-blue-600" />
              <h2>4. Subscriptions, Payments, & Billing</h2>
            </div>
            <p>
              Finova offers a premium subscription tier called the **VIP Pack** for ₹9/month. This tier grants access to advanced features such as the OCR receipt scanner, live bank connections, and CSV uploading.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>**Payment Processing**: Payments are securely processed through **Razorpay**. By subscribing, you agree to pay the fees and authorize recurring charges through your selected payment method.</li>
              <li>**Refunds**: Subscription payments are non-refundable. You may cancel your subscription renewal at any time through your Profile Settings page.</li>
              <li>**Price Changes**: We reserve the right to adjust subscription pricing. Any price adjustments will be communicated to you prior to renewal billing.</li>
            </ul>
          </section>

          {/* Section 5: Limitation of Liability */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-xl text-gray-900">
              <Scale className="h-5 w-5 text-blue-600" />
              <h2>5. Disclaimers & Limitation of Liability</h2>
            </div>
            <p>
              **Finova is a personal financial tracking tool and does not provide professional financial, investment, legal, or tax advice.** All insights, charts, and calculations generated by the app are for informational purposes only. You are solely responsible for all financial decisions and budgeting actions.
            </p>
            <p>
              To the maximum extent permitted by law, Finova, its administrators, and partners shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the app, data loss, connection issues, or financial decisions made based on app metrics.
            </p>
          </section>

          {/* Section 6: Contact Info */}
          <section className="space-y-3 border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500">
              If you have any questions, concerns, or feedback regarding these Terms & Conditions, please contact our support team at **support@finova.test**.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsPage;
