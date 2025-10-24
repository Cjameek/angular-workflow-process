import { ChildFieldContext, customError, FieldPath, MAX_LENGTH, MIN_LENGTH, validate } from "@angular/forms/signals";

/**
 * Validate an array field has a minimum number of entries.
 * 
 * @param path Path to the array field
 * @param minVal Minimum required array entries
 */
export const validateMinArray = <T>(path: FieldPath<T[]>, minVal: number = 0) => {
    validate(path, (ctx) => {
        const arr = ctx.value();

        if (arr.length > minVal) {
            return null;
        }

        return customError({
            kind: 'minimum_array_value',
            message: `At least ${minVal + 1} entry required`,
        });
    })
}

/**
 * Generate a generic required validation message using the Signal Form Schema child field context.
 * 
 * @param ctx Context of the field
 */
export const validationMessageRequired = <T>(ctx: ChildFieldContext<T>) => `${ctx.key()} is required.`;

/**
 * Generate a generic min length validation message using the Signal Form Schema child field context.
 * 
 * @param ctx Context of the field
 */
export const validationMessageMinLength = <T>(ctx: ChildFieldContext<T>) => `Minimum ${ctx.field().property(MIN_LENGTH)()} characters required.`;

/**
 * Generate a generic max length validation message using the Signal Form Schema child field context.
 * 
 * @param ctx Context of the field
 */
export const validationMessageMaxLength = <T>(ctx: ChildFieldContext<T>) => `Only ${ctx.field().property(MAX_LENGTH)()} characters allowed.`;