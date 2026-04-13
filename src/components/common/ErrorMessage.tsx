interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p className="rounded-md border border-burgundy/30 bg-burgundy/10 p-3 text-sm text-burgundy">
      {message}
    </p>
  )
}
