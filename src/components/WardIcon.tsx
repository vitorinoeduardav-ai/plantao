import { AlertTriangle, ClipboardList, Clock, Ghost, Moon, Siren, Star, TriangleAlert, Activity } from "lucide-react";
import { WardTheme } from "../utils/getWardTheme";

export function WardIcon({ iconName, size = 18 }: { iconName: WardTheme["iconName"]; size?: number }) {
  const icons = {
    alert: AlertTriangle,
    siren: Siren,
    triangle: TriangleAlert,
    pulse: Activity,
    star: Star,
    ghost: Ghost,
    moon: Moon,
    clock: Clock,
    clipboard: ClipboardList,
  };
  const Icon = icons[iconName];
  return <Icon size={size} />;
}
