import { useRef } from "react"
import {
  FaEdit,
  FaTimes,
  FaTrash,
} from "react-icons/fa"

export interface CatalogueItem {
  _id?: string
  sku: number
  name: string
  type: string
  price: number
  upc: string
  category: {
    id: string
    name: string
  }[]
  shipping: number
  description: string
  manufacturer: string
  model: string
  url: string
  image: string
}

/**
 * CatalogueCard component
 * @param item CatalogueItem
 * @param onEdit Function
 * @param onDelete Function
 * @param onView Function
 * @returns JSX.Element
 * @example
 * ```tsx
 * <CatalogueCard
 *  item={item}
 *  onEdit={() => console.log('Edit')}
 *  onDelete={() => console.log('Delete')}
 *  onView={() => console.log('View')}
 * />
 * ```
 */
export const CatalogueCard = ({
  item,
  onEdit,
  onDelete,
  onView
}: {
  item: CatalogueItem
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
}) => {
  const modalRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog
        id="my_modal_1"
        className="modal"
        ref={modalRef}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Are you sure you want to delete this
            item?
          </h3>
          <p className="py-4">
            This action cannot be undone. This
            will permanently delete the item.
          </p>
          <div className="modal-action">
            <button
              className="btn "
              onClick={() => {
                modalRef.current?.close()
              }}
            >
              <FaTimes />
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={() => {
                modalRef.current?.close()
                onDelete?.()
              }}
            >
              <FaTrash />
              Delete
            </button>
          </div>
        </div>
      </dialog>
      <div className="flex flex-col w-full gap-2 cursor-pointer"
        onClick={() => {
          onView?.()
        }}
      >
        <div className="flex border rounded-xl relative">
          <div className="absolute w-full">
            <div className="flex justify-between m-2">
              <span className="bg-primary text-white p-1 rounded h-full">
                ${item.price}
              </span>

              <div className="flex flex-col gap-2">
                <button
                  className="btn btn-sm btn-square btn-warning"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit?.()
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-sm btn-square btn-error"
                  onClick={(e) => {
                    e.stopPropagation()
                    modalRef.current?.showModal()
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
          <img
            src={item.image}
            alt={item.name}
            className="w-full aspect-square object-contain p-5"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">
            {item.name}
          </h2>
          <p className="line-clamp-2">
            {item.model}
          </p>
        </div>
      </div>
    </>
  )
}
