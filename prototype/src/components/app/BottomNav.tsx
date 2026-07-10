import { Link, useLocation } from "@tanstack/react-router";
import { Home, ClipboardList, Send, User } from "lucide-react";

const items = [
  { to: "/painel", label: "Início", icon: Home },
  { to: "/painel/atribuicoes", label: "Trabalho", icon: ClipboardList },
  { to: "/sincronizar", label: "Enviar", icon: Send },
  { to: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 flex justify-around">
      {items.map(({ to, label, icon: Icon }) => {
        const active = pathname === to || (to !== "/painel" && pathname.startsWith(to));
        return (
          <Link key={to} to={to} className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-colors">
            <span className={`p-2 rounded-full ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              <Icon className="w-5 h-5" />
            </span>
            <span className={`text-[10px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
