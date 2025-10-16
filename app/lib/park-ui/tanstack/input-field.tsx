import { Field, Input, type InputProps } from "$/park-ui/components";
import { createFormHookContexts } from "@tanstack/react-form";

const { useFieldContext } = createFormHookContexts();

export function InputField(
  props: InputProps & Pick<Field.RootProps, "invalid"> & { label?: string }
) {
  const { invalid, label, onChange, onBlur, ...rest } = props;
  const field = useFieldContext();

  function _onChange(e: React.ChangeEvent<HTMLInputElement>) {
    props.onChange?.(e);
    field.handleChange(e.target.value);
  }

  function _onBlur(e: React.FocusEvent<HTMLInputElement>) {
    props.onBlur?.(e);
    field.handleBlur();
  }

  return (
    <Field.Root
      invalid={
        invalid ||
        (field.state.meta.isDirty && Boolean(field.state.meta.errors.length))
      }
    >
      <Field.Label>{label}</Field.Label>
      <Input onChange={_onChange} onBlur={_onBlur} {...rest} />
    </Field.Root>
  );
}
