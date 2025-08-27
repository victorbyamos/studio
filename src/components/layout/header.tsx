import { ProfileForgeLogo } from "@/components/icons/profile-forge-logo";

export function Header() {
  return (
    <header className="border-b bg-card sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <ProfileForgeLogo />
        </div>
      </div>
    </header>
  );
}
