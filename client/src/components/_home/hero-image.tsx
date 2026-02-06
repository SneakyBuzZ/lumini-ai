export default function HeroImage() {
  return (
    <div className="relative w-full flex justify-center items-center mt-10 mb-20 px-32">
      <img
        src="/assets/images/hero.png"
        alt="Hero Image"
        className="border border-neutral-800 rounded-md opacity-90 z-20"
      />
      <div className="absolute -top-10 left-24 right-0 w-[1200px] h-[1000px] blur-3xl rounded-full z-0 hero-gradient" />
    </div>
  );
}
