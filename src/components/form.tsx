import { AttachmentForm } from "./attachment-form";
import { InputForm } from "./input-form";

export function Form() {
    return (
        <form className="mt-4">
            <AttachmentForm />
            <InputForm label="Full name" type="text" placeholder="Example: Manuel Gomes" />
            <InputForm label="Email" type="email" placeholder="Example: manuel@gomes.com.br" />
            <InputForm label="CPF" type="text" placeholder="Example: 123.456.789-00" />
            <InputForm label="Date of birth" type="date" />

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-6">
                Add customer
            </button>
        </form>
    );
}