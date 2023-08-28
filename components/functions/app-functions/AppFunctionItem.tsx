import { ReactNode } from "react";
import "./AppFunctionItem.scss";

const AppFunctionItem = (props: {
    icon: ReactNode,
    title: string,
    description: string,
    
}) => {
    const { icon, title, description } = props
    return (
        <div className="app-function-item-1">
            <div className="icon">{icon}</div>
            <p className="title">{title}</p>
            <p className="description">{description}</p>
        </div>
    )
}

export default AppFunctionItem;