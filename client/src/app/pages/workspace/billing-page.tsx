import HeaderBilling from "@/components/billing/header.billing";
import BarBilling from "@/components/billing/bar.billing";
import { BillingList } from "@/lib/lists/billing-list";

const PlanComparison = () => {
  return (
    <div className="w-full h-full flex flex-col items-start px-12 py-16 overflow-y-scroll gap-8">
      <HeaderBilling />
      <div className="grid grid-cols-3 gap-4 w-full h-full">
        {BillingList.map((billing) => (
          <BarBilling
            plan={billing.plan}
            planLabel={billing.planLabel}
            planStatus={billing.planStatus}
            price={billing.price}
            ctaLabel={billing.ctaLabel}
            features={billing.features}
            buttonType={
              billing.buttonType as "outline" | "default" | "secondary"
            }
            endPara={billing.endingPara}
          />
        ))}
      </div>
    </div>
  );
};

export default PlanComparison;
