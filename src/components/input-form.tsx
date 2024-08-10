interface InputFormProps {
    label: string;
    type: string;
    placeholder?: string;
}

export function InputForm({label, type, placeholder}: InputFormProps){
    return (
        <label className="block mb-3">
        <span className="text-sm">{label}</span>
        <input
          type={type}
          className="mt-2 block w-full px-3 py-2 border border-zinc-700 rounded-md bg-zinc-800 text-zinc-50"
          placeholder={placeholder}
        />
      </label>
    );
}