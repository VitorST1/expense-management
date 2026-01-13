import { useStore } from "@tanstack/react-form"
import { m } from "@/paraglide/messages"

import { useFieldContext, useFormContext } from "@/hooks/form-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea"
import * as ShadcnSelect from "@/components/ui/select"
import { Slider as ShadcnSlider } from "@/components/ui/slider"
import { Switch as ShadcnSwitch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getLocale } from "@/paraglide/runtime"
import { useEffect, useState } from "react"
import { enUS, ptBR } from "date-fns/locale"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react"

export function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  )
}

function ErrorMessages({ errors }: { errors: Array<string | { message: string }> }) {
  return (
    <>
      {errors.map((error) => (
        <div
          key={typeof error === "string" ? error : error.message}
          className="mt-1 font-bold text-red-500"
        >
          {typeof error === "string" ? error : error.message}
        </div>
      ))}
    </>
  )
}

export function TextField({
  label,
  placeholder,
  autocomplete,
  isInvalid,
}: {
  label: string
  placeholder?: string
  autocomplete?: string
  isInvalid?: boolean
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label htmlFor={field.name} className="mb-2 text-xl font-bold">
        {label}
      </Label>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        placeholder={placeholder}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        autoComplete={autocomplete}
        aria-invalid={isInvalid}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function TextArea({
  label,
  rows = 3,
  placeholder,
  isInvalid,
}: {
  label: string
  rows?: number
  placeholder?: string
  isInvalid?: boolean
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label htmlFor={field.name} className="mb-2 text-xl font-bold">
        {label}
      </Label>
      <ShadcnTextarea
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        placeholder={placeholder}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        rows={rows}
        aria-invalid={isInvalid}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function NumberField({
  label,
  placeholder,
  isInvalid,
}: {
  label: string
  placeholder?: string
  isInvalid?: boolean
}) {
  const field = useFieldContext<number>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  const [inputValue, setInputValue] = useState("")

  // Update input value when field value changes externally
  useEffect(() => {
    if (field.state.value !== undefined && !Number.isNaN(field.state.value)) {
      setInputValue(new Intl.NumberFormat(getLocale()).format(field.state.value))
    } else {
      setInputValue("")
    }
  }, [field.state.value])

  const handleBlur = () => {
    field.handleBlur()
    if (!inputValue) {
      if (field.state.value !== undefined) field.handleChange(undefined as unknown as number)
      field.handleChange(undefined as unknown as number)
      return
    }

    const locale = getLocale().toLowerCase()
    const isPtBr = locale === "pt-br"
    let clean = inputValue
    if (isPtBr) {
      // Remove thousands separator (.) and replace decimal (,) with (.)
      clean = clean.replace(/\./g, "").replace(",", ".")
    } else {
      // Remove thousands separator (,)
      clean = clean.replace(/,/g, "")
    }

    const parsed = parseFloat(clean)
    if (!isNaN(parsed)) {
      field.handleChange(parsed)
      setInputValue(new Intl.NumberFormat(getLocale()).format(parsed))
    } else {
      field.handleChange(NaN)
    }
  }

  return (
    <div>
      <Label htmlFor={field.name} className="mb-2 text-xl font-bold">
        {label}
      </Label>
      <Input
        type="text"
        id={field.name}
        name={field.name}
        value={inputValue}
        placeholder={placeholder}
        onBlur={handleBlur}
        onChange={(e) => setInputValue(e.target.value)}
        aria-invalid={isInvalid}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function DateField({ label, isInvalid }: { label: string; isInvalid?: boolean }) {
  const field = useFieldContext<number>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  const date = field.state.value ? new Date(field.state.value) : undefined

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name} className="text-xl font-bold">
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              isInvalid && "border-red-500",
            )}
            id={field.name}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP", {
                locale: getLocale() === "pt-br" ? ptBR : enUS,
              })
            ) : (
              <span></span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => field.handleChange(d?.getTime() || 0)}
            locale={getLocale() === "pt-br" ? ptBR : enUS}
          />
        </PopoverContent>
      </Popover>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Select({
  label,
  values,
  placeholder,
}: {
  label: string
  values: Array<{ label: string; value: string }>
  placeholder?: string
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label htmlFor={field.name} className="mb-2 text-xl font-bold">
        {label}
      </Label>
      <ShadcnSelect.Select
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <ShadcnSelect.SelectTrigger className="w-full">
          <ShadcnSelect.SelectValue placeholder={placeholder} />
        </ShadcnSelect.SelectTrigger>
        <ShadcnSelect.SelectContent>
          <ShadcnSelect.SelectGroup>
            <ShadcnSelect.SelectLabel>{label}</ShadcnSelect.SelectLabel>
            {values.map((value) => (
              <ShadcnSelect.SelectItem key={value.value} value={value.value}>
                {value.label}
              </ShadcnSelect.SelectItem>
            ))}
          </ShadcnSelect.SelectGroup>
        </ShadcnSelect.SelectContent>
      </ShadcnSelect.Select>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Slider({ label }: { label: string }) {
  const field = useFieldContext<number>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <Label htmlFor={label} className="mb-2 text-xl font-bold">
        {label}
      </Label>
      <ShadcnSlider
        id={label}
        onBlur={field.handleBlur}
        value={[field.state.value]}
        onValueChange={(value) => field.handleChange(value[0])}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function Switch({ label }: { label: string }) {
  const field = useFieldContext<boolean>()
  const errors = useStore(field.store, (state) => state.meta.errors)

  return (
    <div>
      <div className="flex items-center gap-2">
        <ShadcnSwitch
          id={label}
          onBlur={field.handleBlur}
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked)}
        />
        <Label htmlFor={label}>{label}</Label>
      </div>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}

export function ComboBox({
  label,
  values,
  placeholder,
  onCreate,
  createLabel = "Create new",
}: {
  label: string
  values: Array<{ label: string; value: string }>
  placeholder?: string
  onCreate?: () => void
  createLabel?: string
}) {
  const field = useFieldContext<string>()
  const errors = useStore(field.store, (state) => state.meta.errors)
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name} className="text-xl font-bold">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {field.state.value
              ? values.find((framework) => framework.value === field.state.value)?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>{m.no_results_found()}</CommandEmpty>
              <CommandGroup>
                {values.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.label}
                    onSelect={() => {
                      field.handleChange(framework.value)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        field.state.value === framework.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                ))}
                {onCreate && (
                  <CommandItem
                    value="create_new_item_special_value"
                    className="cursor-pointer bg-accent/20 font-semibold text-accent-foreground"
                    onSelect={() => {
                      onCreate()
                      setOpen(false)
                    }}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    {createLabel}
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  )
}
