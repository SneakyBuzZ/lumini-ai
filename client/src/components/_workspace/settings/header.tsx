interface HeaderSettingsProps {
  title: string;
  description: string;
}

const HeaderSettings = ({ title, description }: HeaderSettingsProps) => {
  return (
    <div className="w-4/5 flex flex-col items-start justify-center p-2 border-b border-b-neutral-700 mb-6">
      <h2 className="text-xl font-semibold text-neutral-100">{title}</h2>
      <p className="text-sm text-neutral-500">{description}</p>
    </div>
  );
};

export default HeaderSettings;
