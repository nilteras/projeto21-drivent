import { ApplicationError } from "@/protocols";

export function forbiddenError(): ApplicationError {
    return {
        name: 'ForbiddenError',
        message: 'Cannot do this action 403'
    };
};