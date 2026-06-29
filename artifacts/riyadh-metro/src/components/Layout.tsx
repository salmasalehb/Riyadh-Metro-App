import { Link, useLocation } from "wouter";
import { ReactNode } from "react";
import { Train, Map, MapPin, Bookmark, User as UserIcon, Gift } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { href: "/", label: "Network", icon: Train },
    { href: "/planner", label: "Plan Trip", icon: Map },
    { href: "/stations", label: "Stations", icon: MapPin },
    { href: "/saved-trips", label: "Saved", icon: Bookmark, protected: true },
    { href: "/rewards", label: "Rewards", icon: Gift, protected: true },
    { href: "/profile", label: "Profile", icon: UserIcon, protected: true },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50 dark:bg-gray-950">
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home-logo">
            <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-bold">
              M
            </div>
            <span className="font-bold text-xl tracking-tight">Riyadh Metro</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {!isAuthenticated && (
              <Link href="/login" className="text-sm font-medium hover:text-white/80 transition-colors" data-testid="link-login">
                Log In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 mb-20 md:mb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.filter(item => !item.protected || isAuthenticated).map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? "text-primary" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar nav (hidden on mobile, but could be added later for larger screens) */}
    </div>
  );
}
