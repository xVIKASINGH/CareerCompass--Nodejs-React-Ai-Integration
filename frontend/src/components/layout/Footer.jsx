import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-semibold text-slate-800">CareerCompass</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              AI-powered resume analysis to help you land your dream job. Get instant feedback and improve your chances.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-500 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Product</h3>
            <div className="space-y-2">
              <a href="#" className="block text-slate-600 hover:text-slate-800 text-sm transition-colors">
                Resume Analysis
              </a>
              <a href="#" className="block text-slate-600 hover:text-slate-800 text-sm transition-colors">
                Job Matching
              </a>
              <a href="#" className="block text-slate-600 hover:text-slate-800 text-sm transition-colors">
                Career Tips
              </a>
              <a href="#" className="block text-slate-600 hover:text-slate-800 text-sm transition-colors">
                Templates
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Company</h3>
            <div className="space-y-2">
              <a href="#" className="block text-slate-600 hover:text-slate-800 text-sm transition-colors">
                About Us
              </a>
              <a href="#" className="block text-slate-600 hover:text-slate-800 text-sm transition-colors">
                Careers
              </a>
              <a href="#" className="block text-slate-600 hover:text-slate-800 text-sm transition-colors">
                Blog
              </a>
              <a href="#" className="block text-slate-600 hover:text-slate-800 text-sm transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-slate-600 hover:text-slate-800 text-sm transition-colors">
                Help Center
              </a>
              <a href="#" className="block text-slate-600 hover:text-slate-800 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="block text-slate-600 hover:text-slate-800 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="block text-slate-600 hover:text-slate-800 text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2024 ResumeAnalyzer. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-slate-700 text-sm transition-colors">
                Privacy
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-700 text-sm transition-colors">
                Terms
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-700 text-sm transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
