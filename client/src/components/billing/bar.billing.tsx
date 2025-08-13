import useWorkspacesStore from "@/lib/store/workspace-store";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { SelectSeparator } from "../ui/select";
import FeatureBilling from "./featue.billing";

interface BarBillingProps {
  plan: string;
  planLabel: string;
  planStatus: string;
  price: string;
  ctaLabel: string | null;
  buttonType: "outline" | "default" | "secondary";
  features: string[];
  endPara: string;
}

const BarBilling = ({
  plan,
  planLabel,
  planStatus,
  price,
  ctaLabel,
  buttonType = "outline",
  features,
  endPara,
}: BarBillingProps) => {
  const { currentWorkspace } = useWorkspacesStore();
  const active = currentWorkspace?.plan === plan;
  return (
    <div
      className={`flex flex-col items-start justify-start h-full p-4 border rounded-lg ${
        active
          ? "bg-gradient-to-br from-midnight-400 to-midnight-100 border-neutral-700/80"
          : "bg-midnight-300"
      } gap-4`}
    >
      <div className="w-full flex justify-start items-center gap-3">
        <span className="text-xl text-neutral-300">{planLabel}</span>
        {/* @ts-expect-error-next-line */}
        <Badge variant={plan}>{planStatus}</Badge>
      </div>
      <div className="text-2xl flex items-center gap-2 text-neutral-500">
        <span className="font-bold text-neutral-200">{price}</span>
        <span className="text-base text-neutral-400"> / Month</span>
      </div>
      <Button
        disabled={ctaLabel === null}
        variant={buttonType}
        className="w-full"
      >
        {ctaLabel === null ? planStatus : ctaLabel}
      </Button>
      <SelectSeparator className="w-full bg-neutral-800" />
      <div className="flex flex-col gap-2 h-[270px]">
        {features.map((feature) => (
          <FeatureBilling key={feature} feature={feature} />
        ))}
      </div>
      <SelectSeparator className="w-full bg-neutral-800" />
      <p className="text-sm text-neutral-500">{endPara}</p>
    </div>
  );
};

export default BarBilling;
