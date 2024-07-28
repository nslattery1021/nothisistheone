/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type JobUpdateFormInputValues = {
    jobName?: string;
    description?: string;
    status?: string;
    userId?: string;
};
export declare type JobUpdateFormValidationValues = {
    jobName?: ValidationFunction<string>;
    description?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    userId?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type JobUpdateFormOverridesProps = {
    JobUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    jobName?: PrimitiveOverrideProps<TextFieldProps>;
    description?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type JobUpdateFormProps = React.PropsWithChildren<{
    overrides?: JobUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    job?: any;
    onSubmit?: (fields: JobUpdateFormInputValues) => JobUpdateFormInputValues;
    onSuccess?: (fields: JobUpdateFormInputValues) => void;
    onError?: (fields: JobUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: JobUpdateFormInputValues) => JobUpdateFormInputValues;
    onValidate?: JobUpdateFormValidationValues;
} & React.CSSProperties>;
export default function JobUpdateForm(props: JobUpdateFormProps): React.ReactElement;
