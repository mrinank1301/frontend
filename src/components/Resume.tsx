'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Upload } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const BackgroundAnimation = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
      <g filter="url(#goo)">
        {[...Array(20)].map((_, index) => (
          <motion.circle
            key={index}
            cx={Math.random() * 100 + "%"}
            cy={Math.random() * 100 + "%"}
            r={Math.random() * 50 + 10}
            fill={`rgba(59, 130, 246, ${Math.random() * 0.2 + 0.1})`}
            initial={{
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
            }}
            animate={{
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </g>
    </svg>
  )
}

export default function ResumeTailor() {
  const [resume, setResume] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resume || !jobDescription) {
      setError('Please provide both a resume file and job description.')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData()
    formData.append('resume', resume)
    formData.append('jobDescription', jobDescription)

    try {
      const response = await fetch('https://tailor-1.onrender.com//tailor-resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to tailor resume')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = 'tailored_resume.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      setSuccess(true)
    } catch (err) {
      setError('An error occurred while tailoring your resume. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-900 to-black flex items-center justify-center p-4 overflow-hidden">
    
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10"
      >
        <Card className="w-[500px] h-[450px] max-w-2xl mx-auto backdrop-blur-md bg-white/10 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-white">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Resume Tailor
              </motion.span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Label htmlFor="resume" className="text-sm font-medium text-gray-200">
                  Upload Resume (PDF)
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                    required
                    className="flex-1 text-gray-200 bg-white/10 border-white/20 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => document.getElementById('resume')?.click()} className="bg-white/10 border-white/20 hover:bg-white/20">
                    <Upload className="h-4 w-4 text-gray-200" />
                  </Button>
                </div>
                {resume && <p className="text-sm text-gray-300">Selected file: {resume.name}</p>}
              </motion.div>
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-200">
                  Job Description
                </Label>
                <Textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={5}
                  placeholder="Paste the job description here..."
                  required
                  className="resize-none text-gray-200 bg-white/10 border-white/20 focus:ring-blue-500 focus:border-blue-500"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12" disabled={isLoading}>
                  {isLoading ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='text-lg'
                    >
                      Tailoring Resume...
                    </motion.span>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='text-lg'
                    >
                      Tailor Resume
                    </motion.span>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="default" className="bg-green-500/10 border-green-500/50 text-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your tailored resume has been downloaded.</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

