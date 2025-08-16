export default function BgImages() {
  return (
    <>
      <img
        className="absolute -z-10 h-[45rem] -bottom-16 left-1/2 right-1/2 -translate-x-1/2 opacity-90"
        src="/assets/vectors/beam.svg"
        alt="Center Beam"
      />
      <img
        className="absolute w-[25rem] left-0 top-28"
        src="/assets/vectors/left-one.svg"
        alt="Left Feature 1"
      />
      <img
        className="absolute w-[25rem] left-0 bottom-20 opacity-90"
        src="/assets/vectors/left-two.svg"
        alt="Left Feature 2"
      />
      <img
        className="absolute w-[25rem] right-0 top-44"
        src="/assets/vectors/right-one.svg"
        alt="Right Feature 1"
      />
      <img
        className="absolute w-[25rem] right-0 bottom-24"
        src="/assets/vectors/right-two.svg"
        alt="Right Feature 2"
      />
      <img
        className="absolute -bottom-20 opacity-40"
        src="/assets/vectors/stars.svg"
        alt="Stars"
      />
    </>
  );
}
