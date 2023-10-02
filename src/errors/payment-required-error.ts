import { ApplicationError } from "@/protocols";

export function PaymentRequired(): ApplicationError {
    return {
        name: 'PaymentRequired',
        message: 'Error 402',
    }
}