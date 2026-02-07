import Link from 'next/link';
import { Mail, Zap, Shield, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary rounded-full">
              <Mail className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            EduNotify Sim
          </h1>
          
          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Educational Email Notification Platform
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Send simulated, customizable notification emails for testing and learning purposes. 
            Perfect for developers, students, and educators.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/auth/register"
              className="btn btn-primary text-lg px-8 py-3"
            >
              Get Started
            </Link>
            <Link 
              href="/auth/login"
              className="btn btn-secondary text-lg px-8 py-3"
            >
              Sign In
            </Link>
          </div>
          
          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ <strong>Educational Purpose Only:</strong> All emails include mandatory disclaimers 
              and are strictly for testing and learning.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Platform Features
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Mail />}
            title="Template Builder"
            description="Create custom email templates with variables for dynamic content"
          />
          <FeatureCard
            icon={<Zap />}
            title="Queue System"
            description="Reliable email delivery with Redis + BullMQ job queue"
          />
          <FeatureCard
            icon={<Shield />}
            title="Secure & Safe"
            description="JWT auth, API keys, rate limiting, and mandatory disclaimers"
          />
          <FeatureCard
            icon={<BookOpen />}
            title="Learning Focused"
            description="Sample templates for crypto, e-commerce, banking, and logistics"
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Email Categories
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CategoryCard
            emoji="🪙"
            title="Crypto Education"
            description="Simulated crypto deposit and withdrawal notifications"
          />
          <CategoryCard
            emoji="🛒"
            title="E-commerce"
            description="Order confirmations, shipping updates, receipts"
          />
          <CategoryCard
            emoji="🏦"
            title="Banking"
            description="Transaction alerts, account notifications"
          />
          <CategoryCard
            emoji="📦"
            title="Logistics"
            description="Package tracking, delivery updates"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">
            © 2024 EduNotify Sim - Educational Email Platform
          </p>
          <p className="text-sm">
            Made with ❤️ for education and testing
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card p-6 text-center hover:shadow-md transition-shadow">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function CategoryCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="card p-6 text-center hover:shadow-md transition-shadow">
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
    </div>
  );
}
