import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps {
    placeholder: string;
    name: string;
    type: string;
    error?: string;
    register: UseFormRegister<any>;
    rules?: RegisterOptions;
}

function Input({ placeholder, type, name, register, rules, error }: InputProps){
    return(
        <div>
            <input className="w-full rounded-md border-2 h-11 px-2" type={type} placeholder={placeholder} id={name} {...register(name, rules)} />
            {error && <p className="my-1 text-red-500">{error}</p>}
        </div>
    )
}

export default Input