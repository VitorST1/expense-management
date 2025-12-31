import { createFormHook } from "@tanstack/react-form"

import {
  NumberField,
  Select,
  SubscribeButton,
  TextArea,
  TextField,
  DateField,
  ComboBox,
} from "../components/FormComponents"
import { fieldContext, formContext } from "./form-context"

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea,
    NumberField,
    DateField,
    ComboBox,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
})
