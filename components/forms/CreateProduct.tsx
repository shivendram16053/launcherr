'use client'

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Upload, Rocket, Link, Users, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { GlobeDemo } from "../glassy-glob"

const steps = [
  { title: 'Basic Info', icon: Rocket },
  { title: 'Product Details', icon: Link },
  { title: 'Team & Funding', icon: Users },
  { title: 'Metrics', icon: BarChart },
];

export default function ProductForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    isOpenSource: true,
    githubLink: "",
    twitter: "",
    topic: "",
    comment: "",
    status: "startup",
    pitchVideoUrl: "",
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [ogImageFile, setOgImageFile] = useState<File | null>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files.length > 0) {
      if (name === "logo") setLogoFile(files[0])
      if (name === "ogImage") setOgImageFile(files[0])
    }
  }

  const handleChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const logoBase64 = logoFile ? await convertToBase64(logoFile) : ""
      const ogImageBase64 = ogImageFile ? await convertToBase64(ogImageFile) : ""

      const finalFormData = {
        ...formData,
        logoFile: logoBase64,
        ogImageFile: ogImageBase64,
        userId: localStorage.getItem('userId'),
      }

      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
      })

      if (res.ok) {
        router.push("/dashboard")
      } else {
        console.error("Error creating product")
      }
    } catch (error) {
      console.error("Error during form submission", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  return (
    <div className="flex ">
      <div className="col-span-1 max-w-2xl p-8 lg:p-12 mx-auto h-screen flex flex-col items-center justify-center">
        {/* Progress bar */}
        <div className="relative">
          <div className="absolute top-5 left-[5%] right-[5%] h-0.5 bg-stone-700">
            <motion.div
              className="h-full bg-stone-400"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="relative flex gap-6 md:gap-[7.2rem] lg:gap-[6.8rem] justify-between">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center">
                <motion.div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${index <= currentStep ? ' bg-stone-900 shadow-inner shadow-stone-400' : 'bg-stone-900 shadow-inner shadow-stone-700'
                    }`}
                  initial={{ scale: 1 }}
                  animate={{ scale: index === currentStep ? 1.2 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <step.icon className={`w-4 h-4 ${index <= currentStep ? 'text-stone-300' : 'text-stone-600'}`} />
                </motion.div>
                <span className={`mt-2 text-xs text-nowrap font-medium ${index <= currentStep ? 'text-stone-300 ' : 'text-stone-600'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>


        {/* Form */}
        <div className="w-full mt-20">
          <form className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-semibold  mb-6">Basic Information</h3>
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium ">Project Name</label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your product name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                      className="w-full bg-stone-900 text-zinc-100 border-stone-800 focus:border-zinc-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="tagline" className="text-sm font-medium">Tagline</label>
                    <Input
                      id="tagline"
                      name="tagline"
                      placeholder="Enter a catchy tagline"
                      value={formData.tagline}
                      onChange={(e) => handleChange("tagline", e.target.value)}
                      required
                      className="w-full bg-stone-900 text-zinc-100 border-stone-800 focus:border-zinc-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium ">Description</label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your product"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      required
                      className="w-full min-h-[100px] bg-stone-900 text-zinc-100 border-stone-800 focus:border-zinc-500"
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-semibold  mb-6">Chakra Details</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isOpenSource"
                      checked={formData.isOpenSource}
                      onCheckedChange={(checked) => handleChange("isOpenSource", checked)}
                    />
                    <label htmlFor="isOpenSource" className="text-sm font-medium ">Is Open Source</label>
                  </div>
                  {formData.isOpenSource && (
                    <div className="space-y-2">
                      <label htmlFor="githubLink" className="text-sm font-medium ">GitHub Link</label>
                      <Input
                        id="githubLink"
                        name="githubLink"
                        placeholder="Enter GitHub repository URL"
                        value={formData.githubLink}
                        onChange={(e) => handleChange("githubLink", e.target.value)}
                        className="w-full bg-stone-900 text-zinc-100 border-stone-800 focus:border-zinc-500"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label htmlFor="twitter" className="text-sm font-medium ">Twitter Handle</label>
                    <Input
                      id="twitter"
                      name="twitter"
                      placeholder="Enter Twitter handle"
                      value={formData.twitter}
                      onChange={(e) => handleChange("twitter", e.target.value)}
                      required
                      className="w-full bg-stone-900 text-zinc-100 border-stone-800 focus:border-zinc-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="topic" className="text-sm font-medium ">Topic</label>
                    <Input
                      id="topic"
                      name="topic"
                      placeholder="Enter product topic"
                      value={formData.topic}
                      onChange={(e) => handleChange("topic", e.target.value)}
                      required
                      className="w-full bg-stone-900 text-zinc-100 border-stone-800 focus:border-zinc-500"
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-semibold  mb-6">Additional Information</h3>
                  <div className="space-y-2">
                    <label htmlFor="comment" className="text-sm font-medium ">Comment (optional)</label>
                    <Textarea
                      id="comment"
                      name="comment"
                      placeholder="Add any additional comments"
                      value={formData.comment}
                      onChange={(e) => handleChange("comment", e.target.value)}
                      className="w-full min-h-[100px] bg-stone-900 text-zinc-100 border-stone-800 focus:border-zinc-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium ">Product Status</label>
                    <Select
                      name="status"
                      value={formData.status}
                      onValueChange={(value) => handleChange("status", value)}
                    >
                      <SelectTrigger className="w-full bg-stone-900 text-zinc-100 border-stone-800 focus:border-zinc-500">
                        <SelectValue placeholder="Select product status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startup">Startup</SelectItem>
                        <SelectItem value="preexisting">Pre-existing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="pitchVideoUrl" className="text-sm font-medium ">Loom Pitch Video URL</label>
                    <Input
                      id="pitchVideoUrl"
                      name="pitchVideoUrl"
                      placeholder="Enter Loom video URL"
                      value={formData.pitchVideoUrl}
                      onChange={(e) => handleChange("pitchVideoUrl", e.target.value)}
                      className="w-full bg-stone-900 text-zinc-100 border-stone-800 focus:border-zinc-500"
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-semibold  mb-6">Visual Assets</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="logo" className="block text-sm font-medium  mb-2">
                        Logo
                      </label>
                      <div className="flex items-center space-x-2">
                        <Input id="logo" name="logo" type="file" onChange={handleFileChange} className="sr-only" />
                        <label
                          htmlFor="logo"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border  shadow-sm text-sm font-medium rounded-md     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                        </label>
                        {logoFile && <span className="text-sm ">{logoFile.name}</span>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="ogImage" className="block text-sm font-medium  mb-2">
                        OG Image
                      </label>
                      <div className="flex items-center space-x-2">
                        <Input id="ogImage" name="ogImage" type="file" onChange={handleFileChange} className="sr-only" />
                        <label
                          htmlFor="ogImage"
                          className="cursor-pointer inline-flex items-center px-4 py-2 border  shadow-sm text-sm font-medium rounded-md    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload OG Image
                        </label>
                        {ogImageFile && <span className="text-sm ">{ogImageFile.name}</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-12">
              <Button size="sm" type="button" onClick={prevStep} disabled={currentStep === 0} variant="outline" className="font-semibold bg-stone-900 border-stone-800">
                <ChevronLeft className="mr-0.5 h-4 w-4" /> Previous
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button size="sm" className="font-semibold shadow-inner" type="button" onClick={nextStep}>
                  Next <ChevronRight className="ml-0.5 h-4 w-4 font-semibold" />
                </Button>
              ) : (
                <Button size="sm" type="button" disabled={isSubmitting} onClick={handleSubmit}>
                  {isSubmitting ? "Submitting..." : "Create Product"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="h-screen hidden  lg:block w-[700px]">
        <GlobeDemo/>
      </div>
    </div>
  )
}