import { PropsWithoutRef, ReactNode } from "react";
import "./WebFunctionItem.scss";

const WebFunctionItem = (props: PropsWithoutRef<{ 
    icon: ReactNode,
    title: string,
    description: string
}>) => { 
    const {icon, title, description} = props;

    return (
        <div className="web-function-item">
            <div className="icon">{icon}</div>
            <p className="title">{title}</p>
            <p className="description">{description}</p>
        </div>
    )
}

export default WebFunctionItem;