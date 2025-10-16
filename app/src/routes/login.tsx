import { authClient } from "$/auth.client";
import { Center } from "$/panda.gen/jsx";
import {
  AbsoluteCenter,
  Alert,
  Button,
  Card,
  Fieldset,
  Icon,
  Spinner,
} from "$/park-ui/components";
import { InputField } from "$/park-ui/tanstack";
import { getSession } from "@/functions/auth";
import { withPreventDefault } from "@/utils/event";
import {
  createFormHook,
  createFormHookContexts,
  formOptions,
  useStore,
  type AnyFieldMeta,
} from "@tanstack/react-form";
import { createFileRoute, redirect } from "@tanstack/react-router";
import * as lu from "lucide-react";
import { useMemo, useRef, type RefObject } from "react";
import z from "zod";

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm, withForm } = createFormHook({
  fieldComponents: { InputField },
  formComponents: { Button },
  fieldContext,
  formContext,
});

export const Route = createFileRoute("/login")({
  beforeLoad: async function (context) {
    const session = await getSession();
    if (session && !("error" in session)) {
      throw redirect({ to: context.search.callbackURL });
    }
  },
  component: Login,
  validateSearch: z.object({
    callbackURL: z.string().startsWith("/").default("/"),
  }),
});

const typeOptions = formOptions({
  defaultValues: { email: "", password: "" },
});

const FirstError = withForm({
  ...typeOptions,
  props: {} as {
    formElements: RefObject<Partial<Record<string, HTMLInputElement | null>>>;
    initialError?: string;
  },
  render({ form, formElements, initialError }) {
    const fieldMeta = useStore(form.store, (state) => state.fieldMeta);
    const formError = useStore(form.store, (state) => state.errorMap.onSubmit);
    const formTouched = useStore(form.store, (state) => state.isTouched);

    function isFieldErrored([name, field]: [string, AnyFieldMeta]) {
      const el = formElements.current[name];
      return (
        // Not currently focused
        el !== document.activeElement &&
        // Has been interacted with
        field.isDirty &&
        // Has errors
        field.errors.length > 0
      );
    }

    const errorMessage = useMemo(() => {
      console.info(formError);
      const rootError = formError?.[":root"];
      // @ts-expect-error `:root` is not a field, and the current types don't
      //   allow arbitrary keys on the error map
      if (rootError != null) return rootError?.message ?? "An error occurred";

      const entry = Object.entries(fieldMeta).find(isFieldErrored);
      if (entry) return entry[1].errors[0].message;

      return (!formTouched && initialError) || null;
    }, [fieldMeta, formError, formTouched, initialError]);

    if (!errorMessage) return <></>;

    return (
      <Center css={{ position: "absolute", top: -6, width: "full" }}>
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
    );
  },
});

function Login() {
  const { callbackURL } = Route.useSearch();

  type FieldKey = keyof (typeof typeOptions)["defaultValues"] | "default";
  const formElements = useRef<
    Partial<Record<FieldKey, HTMLInputElement | null>>
  >({});

  const form = useAppForm({
    defaultValues: { email: "", password: "" },
    onSubmitInvalid({ formApi }) {
      const fieldErrors = formApi.getAllErrors().fields;
      const errorField = Object.keys(fieldErrors)[0] as FieldKey | undefined;
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
      onSubmit: z.object({
        email: z.email(),
        password: z.string().min(1, "Password is required"),
      }),
      async onSubmitAsync({ signal, value }) {
        const { error } = await authClient.signIn.email(
          { callbackURL, ...value },
          { signal }
        );

        if (error) {
          setTimeout(() => formElements.current.default?.focus(), 1);
          throw { ":root": error };
        }
      },
    },
  });

  const formSubmitting = useStore(form.store, (state) => state.isSubmitting);

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
        <FirstError
          form={form}
          formElements={formElements}
          initialError="Sign in to continue"
        />
      </form>
    </AbsoluteCenter>
  );
}
