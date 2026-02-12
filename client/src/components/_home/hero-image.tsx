export default function HeroImage() {
  return (
    <div className="relative bottom-0 w-full flex justify-center items-center mt-10 mb-16 px-20">
      <div className="bg-neutral-900 p-1 w-full rounded-md border border-neutral-700/70 z-10">
        <img
          src="/assets/images/hero.svg"
          alt="Hero Image"
          className="w-full border border-dashed border-neutral-700/70 rounded-md z-20"
        />
      </div>
      {/* <div className="absolute -top-10 left-24 right-0 w-[1200px] h-[1000px] blur-3xl rounded-full z-0 hero-gradient" /> */}
    </div>
  );
}
