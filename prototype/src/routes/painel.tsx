import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { PhoneFrame } from "@/components/app/PhoneFrame";
import { BottomNav } from "@/components/app/BottomNav";

export const Route = createFileRoute("/painel")({ component: PainelLayout });

function PainelLayout() {
  const { state } = useStore();
  const nav = useNavigate();
  useEffect(() => { if (!state.user) nav({ to: "/" }); }, [state.user, nav]);
  if (!state.user) return null;
  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full">
        <div className="flex-1"><Outlet /></div>
        <BottomNav />
      </div>
    </PhoneFrame>
  );
}
