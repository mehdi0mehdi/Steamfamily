import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href={`${import.meta.env.BASE_URL}`}>
          <Button variant="ghost" size="sm" className="mb-6 gap-2" data-testid="button-back-home">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using SteamFamily, you accept and agree to be bound by the terms and provisions of this agreement. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Use of Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Our platform provides access to gaming tools and utilities shared by the community. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use tools responsibly and at your own risk</li>
                <li>Respect intellectual property rights of tool creators</li>
                <li>Not post malicious or harmful content</li>
                <li>Provide accurate and honest reviews</li>
                <li>Not attempt to circumvent security measures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">User Content</h2>
              <p className="text-muted-foreground leading-relaxed">
                When you submit reviews or other content, you grant SteamFamily a non-exclusive, worldwide, royalty-free license 
                to use, display, and distribute that content. You are responsible for the content you post and must ensure it 
                does not violate any laws or infringe on others' rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Content Moderation</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to remove reviews or content that violate our guidelines, including content containing 
                URLs, inappropriate language, or spam. Repeated violations may result in account suspension.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                SteamFamily is a community platform. We do not endorse, guarantee, or assume responsibility for any tools 
                shared through our platform. All tools are provided "as is" without warranty. Use them at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                SteamFamily shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
                resulting from your use of our services or any tools downloaded through our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of our services after changes 
                constitutes acceptance of the modified terms.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
