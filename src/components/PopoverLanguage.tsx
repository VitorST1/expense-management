import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn, getInternationalizationMessageFromKey } from "@/lib/utils"
import { CheckIcon, LanguagesIcon } from "lucide-react"
import { m } from "@/paraglide/messages"
import { getLocale, setLocale, locales } from "@/paraglide/runtime"
import { Button } from "./ui/button"

export default function PopoverLanguage() {
  const languages = locales.map((locale: string) => {
    const label = getInternationalizationMessageFromKey({
      prefix: "lang_",
      value: locale,
      regex: /-/g,
      replacer: "_",
    })

    return {
      value: locale,
      label,
    }
  })

  const currentLanguage = getLocale()

  return (
    <Popover>
      <PopoverTrigger>
        <Button className="p-0 hover:brightness-75" asChild variant={"link"}>
          <LanguagesIcon aria-label={m.language_search()} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="dark w-52 p-0"
        align="start"
        aria-label={m.language_search()}>
        <Command className="dark">
          <CommandInput placeholder={m.language_search()} />
          <CommandList>
            <CommandEmpty>{m.language_not_found()}</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.value}
                  value={language.value}
                  keywords={[language.label]}
                  onSelect={(currentValue: string) => {
                    void setLocale(currentValue as (typeof locales)[number])
                  }}>
                  {language.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentLanguage === language.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
