import { createFormHook } from "@tanstack/react-form"

import {
  NumberField,
  Select,
  SubscribeButton,
  TextArea,
  TextField,
  DateField,
} from "../components/FormComponents"
import { fieldContext, formContext } from "./form-context"

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
    NumberField,
    DateField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})
