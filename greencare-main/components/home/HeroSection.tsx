"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, Leaf, Stethoscope, FileText, Users } from "lucide-react"
import Link from "next/link"

const featureIcons = [
  <Leaf key="leaf" className="h-6 w-6 text-primary animate-pulse" />,
  <Stethoscope key="stethoscope" className="h-6 w-6 text-primary animate-pulse" />,
  <FileText key="fileText" className="h-6 w-6 text-primary animate-pulse" />,
  <Users key="users" className="h-6 w-6 text-primary animate-pulse" />
]

export default function HeroSection() {
  const [currentIconIndex, setCurrentIconIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prevIndex) => (prevIndex + 1) % featureIcons.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/50">
      <div className="px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-primary">
            <span className="text-xs font-semibold">SDG 3: Good Health and Well-being</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-chart-1 to-chart-2">
                GreenCare+
              </span>{" "}
              Hospital Management
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Sustainable digital healthcare for the modern hospital. Streamline operations, 
              reduce environmental impact, and improve patient care.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <div className="flex justify-center space-x-2">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/dashboard">
                  Get Started <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/learn-more">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 grid gap-6 md:gap-8 grid-cols-2 md:grid-cols-4">
        <div className="relative group overflow-hidden rounded-lg border bg-background p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">Paperless</h3>
              <p className="text-sm text-muted-foreground">Digital patient registration</p>
            </div>
            {featureIcons[0]}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-chart-1/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="relative group overflow-hidden rounded-lg border bg-background p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">Sustainable</h3>
              <p className="text-sm text-muted-foreground">Eco-friendly medication options</p>
            </div>
            {featureIcons[1]}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-chart-2/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="relative group overflow-hidden rounded-lg border bg-background p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">Efficient</h3>
              <p className="text-sm text-muted-foreground">Streamlined clinical workflows</p>
            </div>
            {featureIcons[2]}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-chart-3/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="relative group overflow-hidden rounded-lg border bg-background p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold">Wellbeing</h3>
              <p className="text-sm text-muted-foreground">Doctor burnout prevention</p>
            </div>
            {featureIcons[3]}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-chart-4/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </section>
  )
}