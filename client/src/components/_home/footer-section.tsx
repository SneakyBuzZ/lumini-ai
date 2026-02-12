import { Link } from "@tanstack/react-router";
import Logo from "../shared/logo";

export default function FooterSection() {
  return (
    <footer className="w-full relative bg-midnight-200/50 border-t border-dashed border-neutral-700">
      <div className="w-full flex gap-16 px-24 py-10">
        {/* Brand */}
        <div className="flex flex-col gap-2">
          <Logo withText />
          <p className="text-neutral-500">
            Lumini is a collaborative intelligence layer for GitHub
            repositories. Understand complex codebases, explore architecture,
            and collaborate with AI-powered workspaces.
          </p>
        </div>

        <div className="flex justify-end items-start gap-14 w-full">
          {/* Product */}
          <div className="flex flex-col gap-2">
            <h4 className="text-neutral-300 font-medium">Product</h4>
            <div className="flex flex-col gap-1 text-neutral-500 text-sm">
              <Link to="/" className="hover:text-neutral-300 transition-colors">
                Features
              </Link>
              <Link to="/" className="hover:text-neutral-300 transition-colors">
                How It Works
              </Link>
              <Link to="/" className="hover:text-neutral-300 transition-colors">
                Pricing
              </Link>
              <Link
                to="/auth/register"
                className="hover:text-neutral-300 transition-colors"
              >
                Join Beta
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-2">
            <h4 className="text-neutral-300 font-medium">Company</h4>
            <div className="flex flex-col gap-1 text-neutral-500 text-sm">
              <Link to="/" className="hover:text-neutral-300 transition-colors">
                About
              </Link>
              <Link to="/" className="hover:text-neutral-300 transition-colors">
                Blog
              </Link>
              <Link to="/" className="hover:text-neutral-300 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-2">
            <h4 className="text-neutral-300 font-medium">Legal</h4>
            <div className="flex flex-col gap-1 text-neutral-500 text-sm">
              <Link to="/" className="hover:text-neutral-300 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/" className="hover:text-neutral-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-midnight-200 border-t border-dashed border-neutral-700 flex justify-between items-center text-neutral-600 text-sm px-24 py-4">
        <span>© {new Date().getFullYear()} Lumini. All rights reserved.</span>
        <div className="flex gap-6 px-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-400 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-400 transition-colors"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}
