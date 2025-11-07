import MainWrapper from "./MainWrapper.jsx";
import DissatisfiedIcon from "../common/DissatisfiedIcon.jsx";


export default function NotFound() {
    return (
        <MainWrapper>
            <DissatisfiedIcon text={'Not found'}  description={'It looks like wrong path'} />
        </MainWrapper>
    )
}