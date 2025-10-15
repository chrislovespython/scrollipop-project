import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  })

  const onSubmit = async (data: LoginData) => {
    setLoading(true)
    try {
      // Replace with real auth call
      console.log("submit", data)
      await new Promise((r) => setTimeout(r, 800))
      // e.g. router.push("/app")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      console.log("sign in with Google")
      await new Promise((r) => setTimeout(r, 600))
    } finally {
      setLoading(false)
    }
  }

  const signInWithX = async () => {
    setLoading(true)
    try {
      console.log("sign in with X / Twitter")
      await new Promise((r) => setTimeout(r, 600))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Login with Google or X, or use your email</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6")}>
              <FieldGroup>
                <Field>
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={signInWithGoogle}
                      disabled={loading}
                      className="flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 mr-2">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Continue with Google
                    </Button>

                    <Button
                      variant="outline"
                      type="button"
                      onClick={signInWithX}
                      disabled={loading}
                      className="flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 mr-2">
                        <path
                          d="M23 4.558a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.38 4.482A13.944 13.944 0 0 1 1.671 3.149a4.916 4.916 0 0 0 1.523 6.56 4.9 4.9 0 0 1-2.228-.616c-.054 2.281 1.581 4.415 3.95 4.89a4.935 4.935 0 0 1-2.224.085 4.92 4.92 0 0 0 4.6 3.417A9.867 9.867 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.058 0 14.01-7.506 14.01-14.01 0-.213-.005-.426-.014-.637A10.025 10.025 0 0 0 23 4.558z"
                          fill="currentColor"
                        />
                      </svg>
                      Continue with X
                    </Button>
                  </div>
                </Field>

                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with email
                </FieldSeparator>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                  {errors.email ? (
                    <FieldDescription className="text-destructive text-sm">{errors.email.message}</FieldDescription>
                  ) : null}
                </Field>

                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                  {errors.password ? (
                    <FieldDescription className="text-destructive text-sm">{errors.password.message}</FieldDescription>
                  ) : null}
                </Field>

                <Field>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Signing in…" : "Sign in"}
                  </Button>
                  <FieldDescription className="text-center">
                    Don't have an account? <a href="/signup">Sign up</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <FieldDescription className="px-6 text-center mt-4">
          By continuing you agree to our <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </FieldDescription>
      </div>
    </main>
  )
}