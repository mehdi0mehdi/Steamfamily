import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6 gap-2" data-testid="button-back-home">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to SteamFamily. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We collect the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Account information (email, display name)</li>
                <li>Reviews and ratings you submit</li>
                <li>Download activity and usage statistics</li>
                <li>Technical data (IP address, browser type, device information)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide and maintain our services</li>
                <li>Process your reviews and display them publicly</li>
                <li>Track download statistics</li>
                <li>Improve our platform and user experience</li>
                <li>Communicate with you about updates and changes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Data Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell your personal data to third parties. Your reviews and display name are publicly visible. 
                We may share anonymized usage statistics for analytics purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, update, or delete your personal information. You can manage your account 
                settings or contact us for assistance with data requests.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this privacy policy, please contact us through our community channels.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
