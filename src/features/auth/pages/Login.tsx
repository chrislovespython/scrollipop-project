import { useState } from "react"
import { cn, logger } from "@/lib/utils"
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
  FieldGroup,
} from "@/components/ui/field"
import { signInWithPopup, GoogleAuthProvider, TwitterAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"
import { createOrUpdateUserDoc } from "@/lib/firebaseActions"
import { Timestamp } from "firebase/firestore"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)



  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      // Build a minimal UserProfile object from the Firebase User and cast to any to satisfy the function signature.
      await createOrUpdateUserDoc({
        uid: user.uid,
        email: user.email ?? "",
        displayName: user.displayName ?? "",
        username: user.displayName ?? user.email?.split("@")[0] ?? "",
        bio: "",
        photoURL: user.photoURL ?? "",
        createdAt: Timestamp.now(),
        verified: false,
        posts: [],
      })
      logger.log("Signed in with Google:", user)
      window.location.href = "/feed"
    } catch (err) {
      logger.error("Google sign-in error", err)
      toast("Google sign-in failed, Try Again.")
    } finally {
      setLoading(false)
    }
  }

  const signInWithX = async () => {
    setLoading(true)
    try {
      const provider = new TwitterAuthProvider()
      const result = await signInWithPopup(auth, provider)
      // Twitter OAuth tokens available via credentialFromResult if needed
      const credential = TwitterAuthProvider.credentialFromResult(result)
      const token = credential?.accessToken
      const secret = credential?.secret
      const user = result.user
      await createOrUpdateUserDoc({
        uid: user.uid,
        email: user.email ?? "",
        displayName: user.displayName ?? "",
        username: user.displayName ?? user.email?.split("@")[0] ?? "",
        bio: "",
        photoURL: user.photoURL ?? "",
        createdAt: Timestamp.now(),
        verified: false,
        posts: [],
      })
      window.location.href = "/feed"
      logger.log("Signed in with X (Twitter):", user, { token, secret })
    } catch (err) {
      logger.error("X/Twitter sign-in error", err)
      toast("X/Twitter sign-in failed, Try Again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-surface">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Scrollipop – Scroll less. Feel more.</CardTitle>
            <CardDescription>Login with Google or X, or use your email</CardDescription>
          </CardHeader>

          <CardContent>
            <form className={cn("flex flex-col gap-1")}>
              <FieldGroup>
                <Field>
                  <div className="flex flex-col gap-2">
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
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}