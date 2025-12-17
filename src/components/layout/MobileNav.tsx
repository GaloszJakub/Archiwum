import { Link, useLocation } from "react-router-dom";
import { Film, Tv, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
    const location = useLocation();

    const navItems = [
        { path: "/movies", icon: Film, label: "Filmy" },
        { path: "/series", icon: Tv, label: "Seriale" },
        { path: "/", icon: Search, label: "Szukaj" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border lg:hidden pb-safe">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map(({ path, icon: Icon, label }) => {
                    const isActive = location.pathname === path;
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200 touch-manipulation",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
