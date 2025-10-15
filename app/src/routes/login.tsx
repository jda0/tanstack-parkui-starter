import { authClient } from "$/auth.client";
import { Center } from "$/panda.gen/jsx";
import {
  AbsoluteCenter,
  Alert,
  Badge,
  Button,
  Card,
  Field,
  Fieldset,
  Icon,
  Input,
  Spinner,
  Tooltip,
  type InputProps,
} from "$/park-ui/components";
import { withPreventDefault } from "@/utils/event";
import {
  createFormHook,
  createFormHookContexts,
  useStore,
} from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import * as lu from "lucide-react";
import { useMemo, useRef } from "react";
import z from "zod";

const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

const InputField = (
  props: InputProps & Pick<Field.RootProps, "invalid"> & { label?: string }
) => {
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
};

const { useAppForm } = createFormHook({
  fieldComponents: { InputField },
  formComponents: { Button },
  fieldContext,
  formContext,
});

export const Route = createFileRoute("/login")({
  component: Login,
  validateSearch: z.object({
    callbackURL: z.string().startsWith("/").default("/"),
  }),
});

function Login() {
  const { callbackURL } = Route.useSearch();
  const form = useAppForm({
    defaultValues: { email: "", password: "" },
    onSubmitInvalid({ formApi }) {
      const fieldErrors = formApi.getAllErrors().fields;
      const errorField = Object.keys(fieldErrors)[0] as FieldKey;
      if (errorField) {
        formElements.current[errorField]?.focus();
        return;
      }

      const formErrors = formApi.getAllErrors().form.errors;
      if (formErrors.length) {
        formElements.current.default?.focus();
      }
    },
    validators: {
      onChange: z.object({
        email: z.email(),
        password: z.string().min(1, "Password is required"),
      }),
      async onSubmitAsync({ signal, value }) {
        const { error } = await authClient.signIn.email(
          { callbackURL, ...value },
          { signal }
        );
        if (error) throw error;
      },
    },
  });

  type FieldKey = keyof (typeof form)["fieldInfo"] | "default";
  const formElements = useRef<
    Partial<Record<FieldKey, HTMLInputElement | null>>
  >({});

  const formSubmitting = useStore(form.store, (state) => state.isSubmitting);
  const formError = useStore(form.store, (state) => state.errorMap.onSubmit);
  const formTouched = useStore(form.store, (state) => state.isTouched);
  const fieldMeta = useStore(form.store, (state) => state.fieldMeta);

  const errorMessage = useMemo(
    function () {
      // @ts-expect-error formError type not inferred correctly
      if (formError != null) return formError?.message ?? "An error occurred";

      type FieldMeta = (typeof fieldMeta)[keyof typeof fieldMeta];
      function isFieldErrored([name, field]: [string, FieldMeta]) {
        const el = formElements.current[name as FieldKey];
        return (
          // Not currently focused
          el !== document.activeElement &&
          // Has been interacted with
          field.isBlurred &&
          // Has errors
          field.errors.length > 0
        );
      }

      const [entry] = Object.entries(fieldMeta).filter(isFieldErrored);
      if (entry) return entry[1].errors[0].message;

      if (!formTouched && callbackURL) return "Sign in to continue";
      return null;
    },
    [formError, fieldMeta]
  );

  return (
    <AbsoluteCenter>
      <form onSubmit={withPreventDefault(form.handleSubmit)}>
        <Card.Root css={{ width: "xs", padding: 6 }}>
          <Fieldset.Root disabled={formSubmitting}>
            <Fieldset.Content>
              <Icon css={{ color: "neutral.9", mx: "auto", my: 2 }}>
                <lu.Lock />
              </Icon>
              <form.AppField name="email">
                {(field) => (
                  <field.InputField
                    autoComplete="username"
                    autoFocus
                    label="Email"
                    ref={(el) => {
                      formElements.current.default = el;
                      formElements.current.email = el;
                    }}
                    type="email"
                  />
                )}
              </form.AppField>
              <form.AppField name="password">
                {(field) => (
                  <field.InputField
                    autoComplete="current-password"
                    label="Password"
                    ref={(el) => {
                      formElements.current.password = el;
                    }}
                    type="password"
                  />
                )}
              </form.AppField>
              <Button
                type="submit"
                onClick={form.handleSubmit}
                css={{ width: "full", mt: 2 }}
              >
                {formSubmitting ? <Spinner /> : "Sign In"}
              </Button>
            </Fieldset.Content>
          </Fieldset.Root>
        </Card.Root>
        {Boolean(errorMessage) && (
          <Center css={{ position: "absolute", top: -3, width: "full" }}>
            <Alert.Root
              css={{
                colorPalette: "red",
                bottom: 0,
                pos: "absolute",
                px: 3,
                py: 2,
                w: "fit",
              }}
              status="error"
              variant="surface"
            >
              <Alert.Content>{errorMessage}</Alert.Content>
            </Alert.Root>
          </Center>
        )}
      </form>
    </AbsoluteCenter>
  );
}
