import { ReactNode } from "react";

function Container({children}: {children: ReactNode}) {
    return(
        <div className="w-full max-w-7xl px-4 mx-auto">
            {children}
        </div>
    )
}

export default Container