import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sidebar-border bg-sidebar backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 px-4 py-2 rounded-md transition-all" data-testid="link-home">
          <span className="text-xl font-bold">
            Steam<span className="text-primary">Family</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              {profile?.is_admin && (
                <Link href="/admin">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                    data-testid="button-admin"
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <span className="text-sm text-muted-foreground mr-2" data-testid="text-user-email">
                {profile?.display_name || user.email}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="gap-2"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2"
                  data-testid="button-login"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="gap-2"
                  data-testid="button-register"
                >
                  <UserPlus className="h-4 w-4" />
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
