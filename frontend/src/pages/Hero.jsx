import { Link } from "react-router-dom";
import { ShieldCheck, MessageCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-700 to-blue-600 text-white">
      <div className="max-w-6xl mx-auto px-6 py-32 text-center">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <ShieldCheck className="w-16 h-16 text-white opacity-90" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          Your Voice. Your Campus. <br />
          <span className="text-blue-200">Completely Anonymous.</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-12">
          KiitBuzz is a secure platform for KIIT students to share thoughts, experiences, and ideas—without revealing your identity. Your privacy and safety are our priority.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/create"
            className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-50 transition"
          >
            Share Anonymously
          </Link>

          <Link
            to="/blogs"
            className="flex items-center justify-center gap-2 border border-white/70 px-8 py-3 rounded-lg hover:bg-white/10 transition"
          >
            <MessageCircle size={18} />
            Explore Campus Buzz
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm md:text-base text-blue-100 font-medium">
          <span className="flex items-center gap-1"><ShieldCheck size={16} /> No real names required</span>
          <span className="flex items-center gap-1"><ShieldCheck size={16} /> KIIT student community</span>
          <span className="flex items-center gap-1"><ShieldCheck size={16} /> Respectful & moderated</span>
        </div>
      </div>
    </section>
  );
}
