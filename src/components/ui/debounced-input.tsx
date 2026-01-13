import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { useEffect, useState } from "react"

interface DebouncedInputProps extends Omit<React.ComponentProps<typeof Input>, "onChange"> {
  value: string
  onChange: (value: string) => void
  debounce?: number
}

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue)
  const debouncedValue = useDebounce(value, debounce)

  useEffect(() => {
    onChange(debouncedValue)
  }, [debouncedValue, onChange])

  return <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
}
