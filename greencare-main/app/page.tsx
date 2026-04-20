import Link from "next/link";
import { ArrowRight, Leaf, Users, FileText, Heart, Calendar, LineChart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FeatureCard from "@/components/home/FeatureCard";
import HeroSection from "@/components/home/HeroSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <section className=" py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Sustainable Healthcare Management
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              GreenCare+ digitizes hospital operations while reducing environmental impact through paperless workflows, 
              sustainable medication recommendations, and operational efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-primary" />} 
              title="Paperless Patient Registration" 
              description="QR code-based mobile registration with digital intake forms and e-signature capabilities." 
            />
            <FeatureCard 
              icon={<FileText className="h-10 w-10 text-primary" />}
              title="Electronic Medical Records" 
              description="Cloud-integrated records with sustainability ratings for medications and paperless lab results."
            />
            <FeatureCard 
              icon={<Heart className="h-10 w-10 text-primary" />}
              title="Doctor Wellbeing Monitor" 
              description="AI-based sentiment analysis to detect burnout with workload optimization algorithms."
            />
            <FeatureCard 
              icon={<Leaf className="h-10 w-10 text-primary" />}
              title="Green Medication Management" 
              description="Eco-friendly medication alternatives with carbon footprint calculators."
            />
            <FeatureCard 
              icon={<LineChart className="h-10 w-10 text-primary" />}
              title="Environmental Impact Dashboard" 
              description="Real-time paper savings calculator with carbon footprint reduction metrics."
            />
            <FeatureCard 
              icon={<Calendar className="h-10 w-10 text-primary" />}
              title="Smart Patient Flow" 
              description="Waiting time predictors with resource utilization optimization and mobile notifications."
            />
          </div>
        </section>

        <section className="  py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Aligned with Sustainable Development Goals
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              GreenCare+ supports SDG 3: Good Health and Well-being through digitization and sustainable healthcare practices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Paper Reduction</CardTitle>
                <CardDescription>Eliminate paper waste through digital systems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gradient-to-br from-chart-1 to-chart-2 rounded-md flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">95%</span>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">Average paper reduction after implementation</p>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Carbon Footprint</CardTitle>
                <CardDescription>Reduce carbon emissions through efficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gradient-to-br from-chart-2 to-chart-3 rounded-md flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">30%</span>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">Average carbon footprint reduction</p>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Patient Satisfaction</CardTitle>
                <CardDescription>Improved experience and reduced wait times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gradient-to-br from-chart-4 to-chart-5 rounded-md flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">87%</span>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">Patient satisfaction rate with digital systems</p>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="  py-12 md:py-24 lg:py-32">
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to transform your healthcare facility?
              </h2>
              <p className="mt-4 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Join the movement toward sustainable healthcare management with GreenCare+. Streamline operations, reduce environmental impact, and improve patient care simultaneously.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button className="w-full sm:w-auto" asChild>
                  <Link href="/demo">
                    Request Demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Shield className="h-64 w-64 text-muted-foreground/20" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="  flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <p className="text-sm leading-loose text-center md:text-left">
              &copy; 2025 GreenCare+. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/sustainability" className="text-sm text-muted-foreground hover:text-foreground">
              Sustainability
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}