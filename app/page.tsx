'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Users, Code2, Rocket, Star, CheckCircle, Globe, Brain, DollarSign } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Code2,
    title: "Drag & Drop Builder",
    description: "Build powerful SaaS applications without writing a single line of code using our intuitive visual builder."
  },
  {
    icon: Brain,
    title: "AI-Powered Features",
    description: "Integrate ChatGPT and Claude AI directly into your apps with pre-built components and workflows."
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    description: "Deploy your applications instantly to Netlify with automated hosting and SSL certificates."
  },
  {
    icon: DollarSign,
    title: "Monetization Ready",
    description: "Built-in Stripe integration for subscriptions, one-time payments, and marketplace transactions."
  },
  {
    icon: Globe,
    title: "SEO Optimized",
    description: "Auto-generated landing pages with perfect SEO optimization for maximum visibility and growth."
  },
  {
    icon: Users,
    title: "App Marketplace",
    description: "Sell your creations in our marketplace and earn revenue with our 10% commission structure."
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$10",
    description: "Perfect for individuals and small projects",
    features: ["5 Apps", "Basic AI Features", "Community Support", "SSL Certificates"]
  },
  {
    name: "Pro",
    price: "$25",
    description: "Ideal for growing businesses and teams",
    features: ["25 Apps", "Advanced AI Features", "Priority Support", "Custom Domains", "Analytics Dashboard"]
  },
  {
    name: "Enterprise",
    price: "$50",
    description: "For large organizations with custom needs",
    features: ["Unlimited Apps", "Full AI Suite", "24/7 Support", "White-label Options", "Advanced Analytics", "API Access"]
  }
];

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SaaSify AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
              <Link href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
              <Link href="/marketplace" className="text-slate-600 hover:text-slate-900 transition-colors">Marketplace</Link>
              <Button variant="outline" asChild>
                <Link href="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              🚀 AI-Powered No-Code Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Build & Sell SaaS Apps
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Without Writing Code
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Create powerful SaaS applications with our drag-and-drop builder, integrate AI features, 
              deploy instantly, and monetize through our marketplace. The future of app development is here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" asChild>
                <Link href="/dashboard">
                  Start Building Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/marketplace">Browse Marketplace</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Build & Scale
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From ideation to monetization, our platform provides all the tools you need to create successful SaaS applications.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-slate-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include hosting, SSL, and our core features.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`h-full ${index === 1 ? 'ring-2 ring-blue-500 scale-105' : ''} hover:shadow-lg transition-all duration-300`}>
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                      <span className="text-slate-600">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-slate-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6" variant={index === 1 ? "default" : "outline"}>
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to Build Your SaaS Empire?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Join thousands of entrepreneurs who are already building and selling successful SaaS applications.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" asChild>
            <Link href="/dashboard">
              Start Building Today <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">SaaSify AI</span>
              </div>
              <p className="text-slate-400">
                The future of no-code SaaS development, powered by AI.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Templates</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 SaaSify AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}