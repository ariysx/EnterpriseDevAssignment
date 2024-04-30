import { FaShoppingBasket } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

/**
 * NavLayout component
 * This layout is used to wrap the main content of the application
 * @param children React.ReactNode
 * @returns JSX.Element
 * @example
 * ```tsx
 * <NavLayout>
 * <div>Content</div>
 * </NavLayout>
 * ```
 */
export const NavLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const navigate = useNavigate()

  return (
    <>
      <ToastContainer />
      <div className="flex relative w-full h-screen flex-1">
        <div className="flex justify-between items-center w-full p-5 absolute h-16 border-b bg-white">
          <div
            className="text-xl font-bold flex items-center gap-2 cursor-pointer"
            onClick={() => {
              navigate("/")
            }}
          >
            <FaShoppingBasket />
            Catalogue
          </div>
          <div className="flex items-center">
            <button
              className="btn btn-ghost"
              onClick={() => {
                navigate("/about")
              }}
            >
              About
            </button>
          </div>
        </div>
        <div className="container w-full mt-16 flex justify-center m-auto p-5">
          {children}
        </div>
      </div>
    </>
  )
}
