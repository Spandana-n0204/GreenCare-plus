"use client"

import AuthGuard from '@/components/AuthGuard'
import { Leaf } from 'lucide-react'
import { useHospital } from '@/contexts/HospitalContext'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // We no longer need logout functionality here as it's handled by the AuthHeaderButtons component
  
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto p-4">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}