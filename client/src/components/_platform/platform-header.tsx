interface PlatformHeaderProps {
  title: string;
  description: string;
  image: string;
}

export default function PlatformHeader({
  title,
  description,
  image,
}: PlatformHeaderProps) {
  return (
    <div className="relative w-full flex justify-between items-center pt-28 pb-16">
      <div className="flex flex-col justify-start items-start gap-4 pl-24">
        <h3 className="text-4xl font-semibold text-neutral-200 tracking-tight font-manrope max-w-xl">
          {title}
        </h3>
        <p className="max-w-3xl text-lg tracking-tight text-neutral-500">
          {description}
        </p>
      </div>
      <img src={image} alt={title + " Content"} className="w-80 mr-24" />
      <div className="absolute bottom-0 w-full h-[1px] border-t border-dashed border-neutral-700 z-20" />
    </div>
  );
}
