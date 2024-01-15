import { HiOutlinePlus } from "react-icons/hi";
import { Link } from "react-router-dom";

function AddButton({children, navigateTo}) {
    return (
        <Link to={navigateTo} className=" flex items-center gap-1 py-3 px-4 rounded-md bg-[#477BFF] text-white">
            <HiOutlinePlus size={20} className="stroke-2" />
            {children}
        </Link>
    )
}

export default AddButton;