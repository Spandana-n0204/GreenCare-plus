"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm,useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { format } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const drugSchema = z.object({
  name: z.string().min(1, "Drug name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  sustainabilityRating: z.number().min(1).max(10).optional(),
  carbonFootprint: z.number().min(0).optional(),
})

const formSchema = z.object({
  mrNo: z.string().min(1, "MR Number is required"),
  date: z.date(),
  diagnoses: z.string().min(1, "At least one diagnosis is required"),
  drugs: z.array(drugSchema),
  reference: z.string().optional(),
  filledBy: z.string().min(1, "Doctor ID is required"),
  status: z.enum(["Completed", "Pending"]),
})

export function AddRecordForm({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [drugInput, setDrugInput] = useState("")
  const [dosageInput, setDosageInput] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mrNo: "",
      date: new Date(),
      diagnoses: "",
      drugs: [],
      reference: "",
      filledBy: "",
      status: "Completed",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "drugs",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          diagnoses: values.diagnoses.split(',').map(d => d.trim()),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create record')
      }

      toast.success("Record created successfully")

      setOpen(false)
      form.reset()
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error("Error creating record: ")
    }
  }

  const addDrug = () => {
    if (drugInput && dosageInput) {
      append({
        name: drugInput,
        dosage: dosageInput,
      })
      setDrugInput("")
      setDosageInput("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Medical Record</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mrNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MR Number</FormLabel>
                    <FormControl>
                      <Input placeholder="MR12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="diagnoses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnoses (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Diagnosis 1, Diagnosis 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Drugs</FormLabel>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Drug name"
                    value={drugInput}
                    onChange={(e) => setDrugInput(e.target.value)}
                  />
                  <Input
                    placeholder="Dosage"
                    value={dosageInput}
                    onChange={(e) => setDosageInput(e.target.value)}
                  />
                  <Button type="button" onClick={addDrug}>
                    Add
                  </Button>
                </div>
                <div className="border rounded-md p-2 space-y-2">
                  {fields.length > 0 ? (
                    fields.map((field, index) => (
                      <div key={field.id} className="flex items-center justify-between p-2 border-b">
                        <div>
                          <span className="font-medium">{field.name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            ({field.dosage})
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground p-2">
                      No drugs added
                    </div>
                  )}
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any reference notes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="filledBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Doctor ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Record</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}