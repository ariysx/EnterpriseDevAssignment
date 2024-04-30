import {
  useState,
  useRef,
  useEffect,
} from "react"
import {
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa"

interface DropdownProps {
  selected: string
  options: string[]
  onChange: (option: string) => void
  align?: "start" | "end"
  size?: "sm" | "md" | "lg"
}

/**
 * Dropdown component
 * @param selected string
 * @param options string[]
 * @param onChange Function
 * @param align "start" | "end"
 * @param size "sm" | "md" | "lg"
 * @returns JSX.Element
 * @example
 * ```tsx
 * <Dropdown
 * selected="Option 1"
 * options={["Option 1", "Option 2", "Option 3"]}
 * onChange={(option) => console.log(option)}
 * />
 * ```
 */
export const Dropdown: React.FC<
  DropdownProps
> = ({
  selected,
  options,
  onChange,
  align = "start",
  size = "md",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      )
    }
  }, [])

  return (
    <div
      ref={dropdownRef}
      className={`dropdown dropdown-down ${
        isOpen ? "dropdown-open" : ""
      } ${align === "end" ? "dropdown-end" : ""}
      `}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`btn m-1 capitalize ${
          size === "sm"
            ? "btn-sm"
            : size === "lg"
            ? "btn-lg"
            : "btn-md"
        }`}
      >
        {selected}{" "}
        {isOpen ? (
          <FaChevronDown />
        ) : (
          <FaChevronUp />
        )}
      </div>
      <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        {options.map((option) => (
          <li
            key={option}
            onClick={() => {
              onChange(option)
            }}
          >
            <button
              className={`btn btn-sm justify-start capitalize ${
                selected === option
                  ? "btn-primary"
                  : "btn-neutral"
              }`}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
