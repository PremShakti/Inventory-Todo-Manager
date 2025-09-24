import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Factory, Shield, Users, Zap, CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Factory className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Inventory Manager</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <span className="text-muted-foreground">Home</span>
              <span className="text-foreground font-medium">About</span>
              <span className="text-muted-foreground">Features</span>
              <span className="text-muted-foreground">Contact</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              Industrial Grade Solutions
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">
              Built for the <span className="text-primary">Factory Floor</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              Inventory Manager was forged in the heart of industrial operations, designed specifically for steel
              factories, manufacturing plants, and heavy industry workers who demand precision and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6 text-balance">
                Engineered for Industrial Excellence
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Born from the real challenges faced by factory workers and plant managers, Inventory Manager transforms
                complex inventory tracking into a streamlined, efficient process that works in the toughest industrial
                environments.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We understand that in heavy industry, every component matters. A missing bolt can halt production. An
                uncounted steel beam can delay projects. Our system ensures nothing falls through the cracks.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 bg-card border-border">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-card-foreground mb-2">Industrial Grade</h3>
                <p className="text-sm text-muted-foreground">
                  Built to withstand the demands of heavy industry operations
                </p>
              </Card>
              <Card className="p-6 bg-card border-border">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-card-foreground mb-2">Team Focused</h3>
                <p className="text-sm text-muted-foreground">Designed for collaborative factory floor environments</p>
              </Card>
              <Card className="p-6 bg-card border-border">
                <Zap className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-card-foreground mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Quick data entry and retrieval for time-critical operations
                </p>
              </Card>
              <Card className="p-6 bg-card border-border">
                <Factory className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold text-card-foreground mb-2">Factory Tested</h3>
                <p className="text-sm text-muted-foreground">Proven in real steel factories and manufacturing plants</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Every feature we build is guided by the principles that matter most to industrial workers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Reliability First</h3>
              <p className="text-muted-foreground leading-relaxed">
                In industrial environments, downtime costs thousands. Our system is built for 99.9% uptime with robust
                error handling and offline capabilities.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Worker-Centric Design</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every interface is designed with gloved hands and safety helmets in mind. Large buttons, clear text, and
                intuitive workflows that work in any condition.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Security & Compliance</h3>
              <p className="text-muted-foreground leading-relaxed">
                Industrial data is sensitive. We maintain the highest security standards and comply with all industrial
                safety and data protection regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Built by Industry Veterans</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Our team combines decades of factory floor experience with cutting-edge technology expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 bg-card border-border text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Sarah Chen</h3>
              <p className="text-primary text-sm font-medium mb-2">Founder & CEO</p>
              <p className="text-sm text-muted-foreground">
                15 years managing steel factory operations before founding Inventory Manager
              </p>
            </Card>
            <Card className="p-6 bg-card border-border text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center">
                <Factory className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Mike Rodriguez</h3>
              <p className="text-primary text-sm font-medium mb-2">Head of Product</p>
              <p className="text-sm text-muted-foreground">
                Former plant supervisor with deep understanding of inventory challenges
              </p>
            </Card>
            <Card className="p-6 bg-card border-border text-center">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-primary/10 flex items-center justify-center">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Alex Thompson</h3>
              <p className="text-primary text-sm font-medium mb-2">Lead Engineer</p>
              <p className="text-sm text-muted-foreground">
                Software architect specializing in industrial-grade applications
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Ready to Transform Your Operations?</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Join thousands of industrial workers who trust Inventory Manager to keep their operations running smoothly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-accent bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Factory className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">Inventory Manager</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 Inventory Manager. Built for the industrial workforce.</p>
        </div>
      </footer>
    </div>
  )
}
