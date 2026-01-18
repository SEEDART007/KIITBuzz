import { ShieldAlert, UserCheck, FileExclamationPoint } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="bg-white max-w-4xl w-full p-10 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            About This Platform
          </h1>
          <p className="text-gray-600 text-lg">
            A safe and respectful community for students to share experiences,
            opinions, and knowledge.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* Purpose */}
          <div className="flex items-start gap-6">
            <UserCheck size={36} className="text-blue-600" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Our Purpose
              </h2>
              <p className="text-gray-600 leading-relaxed">
                This platform is designed to help students connect, share, and
                learn in a safe and anonymous environment. Respect and
                responsibility are the foundation of this community.
              </p>
            </div>
          </div>

          {/* Rules / Zero Tolerance */}
          <div className="flex items-start gap-6">
            <ShieldAlert size={36} className="text-red-600" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Zero Tolerance Policy
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We maintain strict rules to ensure the safety and integrity of
                the platform. Any disrespectful behavior is taken seriously.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Harassment, hate speech, or personal attacks</li>
                <li>Targeting individuals, professors, or groups disrespectfully</li>
                <li>Sexist, racist, casteist, or abusive language</li>
                <li>Threats, defamation, or intentional misinformation</li>
              </ul>
              <p className="mt-3 font-semibold text-red-700 flex items-center gap-2">
                <FileExclamationPoint /> Any violation will result in immediate ban.
              </p>
            </div>
          </div>

         
          
        </div>

        {/* Footer */}
        <p className="mt-12 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} [SeedArt]. Respect the community,
          respect the platform.
        </p>
      </div>
    </div>
  );
}
