import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

function AlertDemo({ title, message }) {
  return (
    <div className="grid w-[80%] mx-auto max-w-xl items-start gap-4">
      {/* <Alert>
        <CheckCircle2Icon />
        <AlertTitle>Success! Your changes have been saved</AlertTitle>
        <AlertDescription>
          This is an alert with icon, title and description.
        </AlertDescription>
      </Alert>
      <Alert>
        <PopcornIcon />
        <AlertTitle>
          This Alert has a title and an icon. No description.
        </AlertTitle>
      </Alert> */}
      <Alert variant="destructive" className="text-left">
        <AlertCircleIcon />
        <AlertTitle className="pl-4">{title}</AlertTitle>
        <AlertDescription className="pl-4">
            {message}
          {/* <p>Please verify your billing information and try again.</p>
          <ul className="list-inside list-disc text-sm">
            <li>Check your card details</li>
            <li>Ensure sufficient funds</li>
            <li>Verify billing address</li>
          </ul> */}
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default AlertDemo