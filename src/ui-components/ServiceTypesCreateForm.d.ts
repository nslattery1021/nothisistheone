/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ServiceTypesCreateFormInputValues = {
    name?: string;
    isActive?: boolean;
};
export declare type ServiceTypesCreateFormValidationValues = {
    name?: ValidationFunction<string>;
    isActive?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ServiceTypesCreateFormOverridesProps = {
    ServiceTypesCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    isActive?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type ServiceTypesCreateFormProps = React.PropsWithChildren<{
    overrides?: ServiceTypesCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ServiceTypesCreateFormInputValues) => ServiceTypesCreateFormInputValues;
    onSuccess?: (fields: ServiceTypesCreateFormInputValues) => void;
    onError?: (fields: ServiceTypesCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ServiceTypesCreateFormInputValues) => ServiceTypesCreateFormInputValues;
    onValidate?: ServiceTypesCreateFormValidationValues;
} & React.CSSProperties>;
export default function ServiceTypesCreateForm(props: ServiceTypesCreateFormProps): React.ReactElement;
