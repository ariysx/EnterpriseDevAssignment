import {
  FaDownload,
  FaEdit,
  FaEllipsisV,
  FaEye,
  FaListUl,
  FaTimes,
  FaTrash,
} from "react-icons/fa"
import { CatalogueItem } from "./CatalogueCard"
import { useNavigate } from "react-router-dom"
import { useRef, useState } from "react"

/**
 * CatalogueList component
 * @param items CatalogueItem[]
 * @param onEdit Function
 * @param onDelete Function
 * @param children React.ReactNode
 * @param onBulkDelete Function
 * @param onBulkExport Function
 * @returns JSX.Element
 * @example
 * ```tsx
 * <CatalogueList
 * items={items}
 * onEdit={(item) => console.log('Edit', item)}
 * onDelete={(item) => console.log('Delete', item)}
 * onBulkDelete={(items) => console.log('Bulk Delete', items)}
 * onBulkExport={(items) => console.log('Bulk Export', items)}
 * >
 * {children}
 * </CatalogueList>
 * ```
 */
export const CatalogueList = ({
  items,
  onEdit,
  onDelete,
  children,
  onBulkDelete,
  onBulkExport,
}: {
  items: CatalogueItem[]
  onEdit?: (item: CatalogueItem) => void
  onDelete?: (item: CatalogueItem) => void
  children?: React.ReactNode
  onBulkDelete?: (items: CatalogueItem[]) => void
  onBulkExport?: (items: CatalogueItem[]) => void
}) => {
  const modalRef = useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()
  const [singleDelete, setSingleDelete] =
    useState<CatalogueItem | undefined>(undefined)

  const [selectedItems, setSelectedItems] =
    useState<CatalogueItem[]>([])

  const onSelect = (item: CatalogueItem) => {
    const index = selectedItems.findIndex(
      (selectedItem) =>
        selectedItem.sku === item.sku
    )

    if (index === -1) {
      setSelectedItems([...selectedItems, item])
    } else {
      const newSelectedItems = [...selectedItems]
      newSelectedItems.splice(index, 1)
      setSelectedItems(newSelectedItems)
    }
  }

  const onSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items)
    }
  }

  return (
    <>
      <div className="flex justify-between">
        {selectedItems.length > 0 && (
          <div className="dropdown w-full">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm"
            >
              <FaListUl />
              Bulk actions
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32 gap-1"
            >
              <li>
                <button
                  className="btn btn-sm justify-start btn-error"
                  onClick={() => {
                    onBulkDelete?.(selectedItems)
                    setSelectedItems([])
                  }}
                >
                  <FaTrash />
                  Delete
                </button>
              </li>
              <li>
                {/* export */}
                <button
                  className="btn btn-sm justify-start"
                  onClick={() => {
                    onBulkExport?.(selectedItems)
                    setSelectedItems([])
                  }}
                >
                  <FaDownload />
                  Export
                </button>
              </li>
            </ul>
          </div>
        )}
        {children}
      </div>
      <div className="overflow-x-auto border rounded-xl">
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
                  setSingleDelete(undefined)
                }}
              >
                <FaTimes />
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => {
                  modalRef.current?.close()
                  singleDelete &&
                    onDelete?.(singleDelete)
                  setSingleDelete(undefined)
                }}
              >
                <FaTrash />
                Delete
              </button>
            </div>
          </div>
        </dialog>
        <table className="table table-sm">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={
                      selectedItems.length ===
                      items.length
                    }
                    onChange={onSelectAll}
                  />
                </label>
              </th>
              <th>Image</th>
              {Object.keys(items[0]).map(
                (key) => {
                  if (
                    key === "image" ||
                    key === "sku" ||
                    key === "upc" ||
                    key === "url"
                  ) {
                    return null
                  }

                  return (
                    <th
                      key={key}
                      className="capitalize"
                    >
                      {key}
                    </th>
                  )
                }
              )}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <List
                key={item.sku}
                item={item}
                onEdit={() => {
                  onEdit?.(item)
                }}
                onDelete={() => {
                  setSingleDelete(item)
                  modalRef.current?.showModal()
                }}
                onView={() => {
                  navigate(
                    `/catalogue/${item.sku}`
                  )
                }}
                isLast={
                  item === items[items.length - 1]
                }
                onSelect={() => onSelect(item)}
                isSelected={selectedItems.some(
                  (selectedItem) =>
                    selectedItem.sku === item.sku
                )}
              />
            ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th></th>
              <th>Image</th>
              {Object.keys(items[0]).map(
                (key) => {
                  if (
                    key === "image" ||
                    key === "sku" ||
                    key === "upc" ||
                    key === "url"
                  ) {
                    return null
                  }

                  return (
                    <th
                      key={key}
                      className="capitalize"
                    >
                      {key}
                    </th>
                  )
                }
              )}
              <th>Actions</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}

const List = ({
  item,
  onEdit,
  onDelete,
  onView,
  onSelect,
  isLast,
  isSelected = false,
}: {
  item: CatalogueItem
  onEdit?: () => void
  onDelete?: () => void
  onView?: () => void
  isLast?: boolean
  onSelect?: () => void
  isSelected?: boolean
}) => {
  return (
    <tr
      key={item.sku}
      onClick={() => {
        onView?.()
      }}
      className={`cursor-pointer ${
        isSelected ? "bg-emerald-100" : ""
      } hover:bg-emerald-50`}
    >
      <th>
        <label>
          <input
            type="checkbox"
            className="checkbox bg-white"
            checked={isSelected}
            onChange={() => {
              onSelect?.()
            }}
            onClick={(e) => {
              e.stopPropagation()
            }}
          />
        </label>
      </th>
      <td>
        <img
          src={item.image}
          alt={item.name}
          className="w-12 aspect-square object-contain"
        />
      </td>
      <td
        // break word
        className="break-all w-44"
      >
        {item.name}
      </td>
      <td>{item.type}</td>
      <td>
        <span className="badge badge-primary badge-outline">
          <span className="text-base-content">
            ${item.price}
          </span>
        </span>
      </td>

      <td>
        <div className="line-clamp-3">
          {
            // map category name joined by comma
            item.category
              .map((category) => category.name)
              .join(", ")
          }
        </div>
      </td>
      <td>
        <span
          className={`badge badge-primary ${
            item.shipping ? "badge-outline" : ""
          }`}
        >
          <span className="text-base-content">
            {item.shipping
              ? `$${item.shipping}`
              : "Free"}
          </span>
        </span>
      </td>
      <td>
        <div className="line-clamp-3">
          {item.description}
        </div>
      </td>
      <td>{item.manufacturer}</td>
      <td>{item.model}</td>
      <td>
        <div
          className={`dropdown relative dropdown-end ${
            isLast ? "dropdown-top" : ""
          }`}
        >
          <div
            tabIndex={0}
            role="button"
            className="btn btn-sm btn-square"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <FaEllipsisV />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box absolute z-10 w-32 gap-1"
          >
            <li>
              <button
                className="btn btn-sm justify-start"
                onClick={onView}
              >
                <FaEye />
                View
              </button>
            </li>
            <li>
              <button
                className="btn btn-sm btn-warning justify-start"
                onClick={(e) => {
                  onEdit?.()
                  e.stopPropagation()
                }}
              >
                <FaEdit />
                Edit
              </button>
            </li>
            <li>
              <button
                className="btn btn-sm btn-error justify-start"
                onClick={(e) => {
                  onDelete?.()
                  e.stopPropagation()
                }}
              >
                <FaTrash />
                Delete
              </button>
            </li>
          </ul>
        </div>
      </td>
    </tr>
  )
}
