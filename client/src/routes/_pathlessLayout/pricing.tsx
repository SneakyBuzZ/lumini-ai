import BarBilling from "@/components/_workspace/billing/bar.billing";
import { createFileRoute } from "@tanstack/react-router";

const BillingList = [
  {
    plan: "free",
    planLabel: "Free",
    planStatus: "Starter",
    price: "$0",
    ctaLabel: "Get Started",
    buttonType: "default",
    features: [
      "1 Workspace",
      "Up to 3 Labs",
      "1 Member per Lab",
      "Basic Repo Dashboard",
      "Limited AI Queries",
      "Standard Realtime Canvas",
    ],
    endingPara:
      "Ideal for individual developers exploring repository intelligence and structured collaboration.",
  },
  {
    plan: "pro",
    planLabel: "Pro",
    planStatus: "Most Popular",
    price: "$29",
    ctaLabel: "Upgrade to Pro",
    buttonType: "primary",
    features: [
      "Up to 3 Workspaces",
      "Up to 10 Labs per Workspace",
      "Up to 5 Members per Lab",
      "Advanced Repo Insights",
      "Realtime Multi-User Canvas",
      "Extended AI Query Limits",
      "Increased Lab Storage",
    ],
    endingPara:
      "Designed for growing teams building collaboratively across repositories and structured labs.",
  },
  {
    plan: "enterprise",
    planLabel: "Enterprise",
    planStatus: "Scale",
    price: "Custom",
    ctaLabel: "Contact Sales",
    buttonType: "secondary",
    features: [
      "Unlimited Workspaces",
      "Unlimited Labs",
      "Unlimited Members",
      "Advanced Role-Based Access",
      "Unlimited AI Queries",
      "Unlimited Storage",
      "Priority Support",
      "Custom Integrations",
    ],
    endingPara:
      "Built for organizations requiring scale, governance, and enterprise-grade collaboration.",
  },
];

export const Route = createFileRoute("/_pathlessLayout/pricing")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full">
      <div className="w-full px-24 ">
        {/* HERO */}
        <div className="flex flex-col items-center text-center pt-24 pb-12 border-b border-x border-dashed border-neutral-700">
          <h1 className="text-4xl font-semibold text-neutral-200">
            Simple, Structured Pricing
          </h1>
          <p className="text-neutral-500 max-w-2xl">
            Choose a plan that matches your team’s scale. Start free, upgrade as
            your workspaces and collaboration needs grow.
          </p>
        </div>

        {/* PRICING GRID */}
        <div className="grid grid-cols-3 gap-8 py-12 px-24 border-x border-dashed border-neutral-700">
          {BillingList.map((plan) => (
            <div key={plan.plan}>
              <BarBilling
                plan={plan.plan}
                planLabel={plan.planLabel}
                planStatus={plan.planStatus}
                price={plan.price}
                ctaLabel={plan.ctaLabel}
                buttonType={plan.buttonType}
                features={plan.features}
                endPara={plan.endingPara}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="w-screen border-t border-dashed border-neutral-700 py-16 text-center bg-grid">
        <p className="text-3xl text-neutral-400 mx-auto px-32">
          <span className="text-neutral-200">
            Lumini pricing is built around structured workspaces and labs.
          </span>{" "}
          Scale collaboration, AI usage, and storage as your repository
          intelligence grows.
        </p>
      </div>
    </div>
  );
}
