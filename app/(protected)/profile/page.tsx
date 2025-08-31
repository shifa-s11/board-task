"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ProfileSchema, type ProfileInput } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useProfile, useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const COUNTRIES = ["United States", "United Kingdom", "India", "Germany", "Canada", "Australia"]

export default function ProfilePage() {
  const router = useRouter()
  const { profile, saveProfile } = useProfile()
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      contact: "",
      country: "",
      password: "",
    },
    mode: "onChange",
  })

  useEffect(() => {
    if (profile) {
      form.reset(profile);
    }
  }, [profile, form]);

  async function onSubmit(values: ProfileInput) {
    setIsLoading(true);
    try {
      await saveProfile(values)
      toast.success("Profile saved!", {
        description: "Your personal details have been updated.",
      });
        router.push("/projects")
    } catch (err) {
      toast.error("Profile update failed.", {
        description: "There was an error saving your profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };
  
  const userInitials = profile?.name 
    ? profile.name.split(' ').map(n => n[0]).join('')
    : profile?.email 
      ? profile.email[0].toUpperCase()
      : "NA";

  return (
    <main className="min-h-dvh flex flex-col items-center p-4 bg-gray-100 dark:bg-zinc-950">
      <div className="flex-grow flex items-center justify-center w-full">
        <Card className="w-full max-w-xl rounded-xl border-none shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl dark:bg-zinc-900 bg-gray-100">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Profile 👤
            </CardTitle>
            <CardDescription className="mt-2 text-balance text-zinc-600 dark:text-zinc-400">
              Update your personal details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="Your name" 
                            className="h-10 rounded-md border border-zinc-300 bg-zinc-50 px-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-emerald-500"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            {...field} 
                            placeholder="you@example.com" 
                            className="h-10 rounded-md border border-zinc-300 bg-zinc-50 px-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-emerald-500"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Contact</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="+1 234 567 890" 
                            className="h-10 rounded-md border border-zinc-300 bg-zinc-50 px-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-emerald-500"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                 <FormField
  control={form.control}
  name="country"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Country
      </FormLabel>
      <Select
        value={field.value}
        onValueChange={field.onChange}
        disabled={isLoading}
      >
        <FormControl>
          <SelectTrigger
            ref={field.ref} 
            onBlur={field.onBlur} 
            className="h-10 rounded-md border border-zinc-300 bg-zinc-50 px-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-emerald-500"
          >
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
        </FormControl>
        <SelectContent className="dark:bg-zinc-900 dark:border-zinc-700">
          {COUNTRIES.map((c) => (
            <SelectItem
              key={c}
              value={c}
              className="text-zinc-900 dark:text-zinc-100"
            >
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage className="text-xs text-red-500" />
    </FormItem>
  )}
/>
                </div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300">New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          {...field} 
                          placeholder="••••••" 
                          className="h-10 rounded-md border border-zinc-300 bg-zinc-50 px-3 text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-emerald-500"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    className="bg-emerald-600 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

