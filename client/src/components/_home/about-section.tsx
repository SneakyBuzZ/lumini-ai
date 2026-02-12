export default function AboutSection() {
  return (
    <div className="w-full relative px-24">
      <div className="flex flex-col w-full justify-center items-center border-dashed border-x border-neutral-700">
        <WhyLumini />
        <div className="relative w-full flex justify-start items-center px-20 py-14 gap-14">
          <p className="text-xl w-full text-neutral-400">
            <span className="text-neutral-200 font-semibold">
              Lumini is a collaborative intelligence layer for your GitHub
              repositories.{" "}
            </span>
            It helps teams understand complex codebases faster, ask contextual
            questions, visualize architecture, and work together inside
            structured workspaces built for modern development.
          </p>
          <img
            src="/assets/vectors/lumini-feature.svg"
            alt="Lumini Features"
            className="w-[40rem]"
          />
        </div>
        <div className="absolute bottom-0 w-screen h-[1px] border-t border-dashed border-neutral-700 z-40" />
      </div>
    </div>
  );
}

function WhyLumini() {
  return (
    <div className="relative w-full flex justify-center items-center">
      <div className="w-1/2 h-[25rem] flex flex-col pt-16 gap-4 pl-20 border-r border-dashed border-neutral-700">
        <h3 className="text-3xl font-semibold text-neutral-200 ">
          As codebases are growing faster than ever with AI. We need a better
          way to understand them.
        </h3>
        <AIImages />
      </div>
      <div className="w-1/2 h-[25rem] flex flex-col pt-16 gap-4 pr-20 pl-10">
        <p className="text-md text-neutral-400 ">
          AI is accelerating how we write code — but it's also increasing the
          size, complexity, and entropy of modern repositories. Context gets
          fragmented. Architecture decisions get buried. Onboarding takes
          longer. Understanding becomes the bottleneck.
        </p>
        <p className="text-md text-neutral-400 ">
          Lumini brings clarity back to your codebase. Connect your GitHub
          repository, explore it through an intelligent dashboard, ask questions
          using contextual AI, and collaborate visually with your team in real
          time. Everything lives inside structured workspaces and labs — so your
          code, ideas, and discussions stay organized.
        </p>
        <span className="text-neutral-200 font-semibold">
          This is where Lumini AI comes in.
        </span>
      </div>
      <div className="absolute bottom-0 w-screen h-[1px] border-t border-dashed border-neutral-700 z-20" />
    </div>
  );
}

function AIImages() {
  const images = [
    {
      src: "https://cdn.prod.website-files.com/673f71b4ebbb99190437de75/6794037fc7cb42842ae78d2d_Color=White.svg",
      alt: "OpenAI",
    },
    {
      src: "https://cdn.prod.website-files.com/673f71b4ebbb99190437de75/676c70834fac45287621e069_google-gemini-icon.svg",
      alt: "Google Gemini",
    },
    {
      src: "https://cdn.prod.website-files.com/673f71b4ebbb99190437de75/67dde39cd67b026a062e74f2_cursor_white.avif",
      alt: "Cursor",
    },
    {
      src: "https://cdn.prod.website-files.com/673f71b4ebbb99190437de75/6794044c5121ae803606d11c_claude.svg",
      alt: "Claude",
    },
    {
      src: "https://cdn.prod.website-files.com/673f71b4ebbb99190437de75/6915ce515ae287ac95983732_amp-logomark.svg",
      alt: "Amp",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={image.alt}
          className="w-10 h-10"
        />
      ))}
    </div>
  );
}
