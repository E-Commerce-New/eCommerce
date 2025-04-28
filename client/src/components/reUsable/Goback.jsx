import {Undo2} from "lucide-react"

const GoBack = () => {
    return (
        <div onClick={() => history.back()}><Undo2/></div>
    )
}

export default GoBack;