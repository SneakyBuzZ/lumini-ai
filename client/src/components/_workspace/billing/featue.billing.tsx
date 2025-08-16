import { Check } from "lucide-react";

interface FeatureBillingProps {
  feature: string;
}

const FeatureBilling = ({ feature }: FeatureBillingProps) => {
  return (
    <span className="flex text-sm text-neutral-400 justify-start items-center gap-2">
      <Check className="text-cyan h-4" />
      {feature}
    </span>
  );
};

export default FeatureBilling;
