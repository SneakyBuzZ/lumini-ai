import { Switch } from "../ui/switch";

interface BarSettingsProps {
  title: string;
  description: string;
  value?: string | number | boolean;
}

const BarSettings = ({ title, description, value }: BarSettingsProps) => {
  return (
    <div className="w-full flex justify-between items-center px-4 py-3">
      <div className="flex flex-col items-start justify-center">
        <span className="text-base font-semibold text-neutral-200">
          {title}
        </span>
        <span className="text-sm w-2/3 text-neutral-500">{description}</span>
      </div>
      {typeof value === "boolean" ? (
        <Switch checked={value} />
      ) : (
        <>
          <span className="text-xl text-neutral-100">{value}</span>
        </>
      )}
    </div>
  );
};

export default BarSettings;
