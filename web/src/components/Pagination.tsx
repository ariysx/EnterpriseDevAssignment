import {
  useEffect,
  useRef,
  useState,
} from "react"
import {
  FaAngleLeft,
  FaAngleRight,
  FaBook,
} from "react-icons/fa"

/**
 * Pagination component
 * @param currentPage number
 * @param totalPages number
 * @param onNext Function
 * @param onPrev Function
 * @param onChange Function
 * @returns JSX.Element
 * @example
 * ```tsx
 * <Pagination
 * currentPage={1}
 * totalPages={10}
 * onNext={() => console.log('Next')}
 * onPrev={() => console.log('Prev')}
 * onChange={(page) => console.log(page)}
 * />
 * ```
 */
export const Pagination = ({
  currentPage,
  totalPages,
  onNext,
  onPrev,
  onChange,
}: {
  currentPage: number
  totalPages: number
  onNext: () => void
  onPrev: () => void
  onChange: (page: number) => void
}) => {
  const [page, setPage] = useState(currentPage)
  const [
    isPageInputFocused,
    setIsPageInputFocused,
  ] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // detect if the input is focused
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener(
        "focus",
        () => {
          setIsPageInputFocused(true)
        }
      )
      inputRef.current.addEventListener(
        "blur",
        () => {
          setIsPageInputFocused(false)
        }
      )
    }
  }, [])

  useEffect(() => {
    setPage(currentPage)
  }, [currentPage])

  if (totalPages === 0) {
    return null // Don't render anything if there are no pages
  }

  return (
    <div className="flex justify-center items-center">
      <span className="me-2 flex items-center gap-1 text-sm">
        <FaBook /> Page
      </span>
      <div className="flex justify-center items-center join">
        <button
          onClick={onPrev}
          disabled={
            currentPage === 1 ||
            isPageInputFocused
          }
          className="btn btn-primary btn-square btn-sm join-item"
        >
          <FaAngleLeft />
        </button>
        <input
          type="number"
          value={page}
          onChange={(e) => {
            // if page is negative or greater than total pages, do not update the page
            const newPage = parseInt(
              e.target.value
            )
            if (
              newPage > 0 &&
              newPage <= totalPages
            ) {
              setPage(newPage)
            }
          }}
          onBlur={() => {
            if (page <= 0 || page > totalPages) {
              setPage(currentPage)
            }
            onChange(page)
          }}
          ref={inputRef}
          className="input input-bordered input-sm w-16 text-center p-0 join-item"
        />
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="btn btn-primary btn-square btn-sm join-item"
        >
          {isPageInputFocused ? (
            "Go"
          ) : (
            <FaAngleRight />
          )}
        </button>
      </div>
    </div>
  )
}
