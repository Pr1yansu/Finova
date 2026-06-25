import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Landmark, ShieldCheck, Zap } from "lucide-react";

const FAQPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="text-center pb-8 border-b border-gray-100">
          <div className="mx-auto bg-blue-500/10 p-3 rounded-full w-fit mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </CardTitle>
          <CardDescription className="text-base mt-2 max-w-2xl mx-auto">
            Got questions about Finova? We have compiled the most common inquiries to help you manage your personal finances like a pro.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Section 1: General & Getting Started */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-semibold text-lg text-gray-900 border-b pb-2 mb-4 border-gray-100">
                <Zap className="h-5 w-5 text-amber-500" />
                <h3>General & Getting Started</h3>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-medium">What is Finova?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Finova is a premium personal finance manager designed to help you track, analyze, and optimize your financial health. By aggregating your transactions, categorize your expenses, and visualizing your cash flow, Finova gives you total control over your financial journey.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-medium">How do I create a new transaction?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    You can create a transaction manually by clicking the &quot;Add Transaction&quot; button on your Transactions page. Simply fill in the date, account, category, payee, amount, and notes. Alternatively, you can upload a bank statement CSV or use our premium OCR receipt scanner to digitize your bills instantly.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-medium">Can I manage multiple bank accounts?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Yes! You can create multiple virtual accounts (e.g., Checking, Savings, Cash, Credit Cards) under the Accounts tab. This helps you isolate and track your balances and spending behavior on an account-by-account basis.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Section 2: Security & Privacy */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-semibold text-lg text-gray-900 border-b pb-2 mb-4 border-gray-100">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <h3>Security & Privacy</h3>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-medium">Is my financial data secure with Finova?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Absolutely. Data security is our highest priority. Finova uses bank-grade 256-bit encryption to protect your data in transit and at rest. We never store raw passwords or banking credentials on our servers.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-medium">Does Finova sell my financial data?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Never. We believe your financial data is personal and private. Finova does not, and will never, sell or share your transaction histories, account details, or personal information with any third-party advertisers or data brokers.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-medium">What is Two-Factor Authentication (2FA)?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Two-Factor Authentication adds an extra layer of security to your account by requiring a unique 6-digit verification code sent to your email whenever you log in. You can enable or disable this feature at any time on your Settings page.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Section 3: Plaid Bank Connect */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-semibold text-lg text-gray-900 border-b pb-2 mb-4 border-gray-100">
                <Landmark className="h-5 w-5 text-blue-500" />
                <h3>Bank Connection (Plaid)</h3>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-medium">How does Bank Connection work?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    We partner with Plaid, the industry leader in open banking, to securely connect to your financial institution. When you link a bank account, Plaid shares a secure, read-only token with Finova. We use this token to fetch your transactions automatically without ever seeing or storing your bank credentials.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-medium">Can I connect multiple accounts from the same bank?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Yes. When you authenticate your bank through the Plaid link button, all checking, savings, or credit card accounts associated with that bank login will be linked, allowing you to select and sync transactions for any of them.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-medium">How do I sync my transactions from my bank?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Once an account is linked, you can go to the Accounts page, click &quot;Connected Banks&quot;, and select your account. This will pull the latest transactions from Plaid, automatically screen out duplicates, and import new records into your dashboard.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Section 4: VIP Package & Premium */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-semibold text-lg text-gray-900 border-b pb-2 mb-4 border-gray-100">
                <Zap className="h-5 w-5 text-pink-500" />
                <h3>VIP Pack & Premium Features</h3>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-medium">What is the VIP Pack?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    The VIP Pack is our premium tier that unlocks our most advanced features for just ₹9/month. This includes the OCR receipt scanner, live Plaid bank connections, CSV statement upload, and advanced multi-chart data visualizations.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-medium">How does the OCR receipt scanner work?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Under the transactions page, VIP members can click the &quot;Scan Receipt&quot; button to upload a photo of a receipt or take a picture using their camera. Our OCR engine extracts the date, payee, amount, and notes, letting you verify the details and save it directly into your transactions log.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-medium">How can I pay for the VIP Pack?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    We use Razorpay, a secure and trusted Indian payment gateway. You can upgrade instantly using UPI, credit/debit cards, net banking, or wallets by clicking the &quot;Upgrade to VIP&quot; button. Your premium status will be activated immediately upon payment.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQPage;
