import {
  FaEdit,
  FaPlus,
  FaSave,
  FaTimes,
  FaTrash,
} from "react-icons/fa"
import { CatalogueItem } from "./CatalogueCard"
import {
  useEffect,
  useRef,
  useState,
} from "react"
import { CataloguePageMode } from "../pages/CatalogueItemPage/CatalogueItemPage"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

/**
 * CatalogueForm component
 * @param item CatalogueItem
 * @param mode CataloguePageMode
 * @param onDelete Function
 * @param onCreate Function
 * @param onUpdate Function
 * @param availableFilters Array
 * @returns JSX.Element
 * @example
 * ```tsx
 * <CatalogueForm
 * item={item}
 * mode="view"
 * onDelete={() => console.log('Delete')}
 * onCreate={() => console.log('Create')}
 * onUpdate={() => console.log('Update')}
 * availableFilters={availableFilters}
 * />
 * ```
 */
export const CatalogueForm = ({
  item,
  mode = "view",
  onDelete,
  onCreate,
  onUpdate,
  availableFilters,
}: {
  item: CatalogueItem
  mode: CataloguePageMode
  onDelete?: (item: CatalogueItem) => void
  onCreate?: (item: CatalogueItem) => void
  onUpdate?: (item: CatalogueItem) => void
  availableFilters: {
    name: string
    values: string[]
  }[]
}) => {
  const navigate = useNavigate()

  const [catalogueItem, setCatalogueItem] =
    useState<CatalogueItem>(item)
  // inherit category from catalogueItem

  const [categoryInput, setCategoryInput] =
    useState<string>("")
  const [category, setCategory] = useState<
    {
      id: string
      name: string
    }[]
  >(item.category)
  const [
    openCategorySuggestions,
    setOpenCategorySuggestions,
  ] = useState(false)

  const [
    openManufacturerSuggestions,
    setOpenManufacturerSuggestions,
  ] = useState(false)

  const [
    openTypeSuggestions,
    setOpenTypeSuggestions,
  ] = useState(false)

  const modalRef = useRef<HTMLDialogElement>(null)

  const [
    availableCategories,
    setAvailableCategories,
  ] = useState<
    {
      id: string
      name: string
    }[]
  >(item.category)
  const [availableTypes, setAvailableTypes] =
    useState<string[]>([])
  const [
    availableManufacturers,
    setAvailableManufacturers,
  ] = useState<string[]>([])

  const handleRemoveCategory = (name: string) => {
    setCategory(
      category.filter(
        (category) => category.name !== name
      )
    )
  }

  useEffect(() => {
    // destructure category from catalogueItem
    const available = availableFilters.find(
      (filter) => filter.name === "category"
    )

    if (available) {
      setAvailableCategories(
        available.values.map(
          (value: any) => value
        )
      )
    }
  }, [availableFilters])

  useEffect(() => {
    const available = availableFilters.find(
      (filter) => filter.name === "manufacturer"
    )

    if (available) {
      setAvailableManufacturers(available.values)
    }
  }, [availableFilters])

  useEffect(() => {
    const available = availableFilters.find(
      (filter) => filter.name === "type"
    )

    if (available) {
      setAvailableTypes(available.values)
    }
  }, [availableFilters])

  const onCategorySelect = ({
    id,
    name,
  }: {
    id: string
    name: string
  }) => {
    // if category already exists, do not add
    if (
      category.find(
        (category) => category.name === name
      )
    ) {
      toast.error("Category already selected")
      setOpenCategorySuggestions(false)
      return
    }

    setCategory([
      ...category,
      {
        id,
        name,
      },
    ])
    setCategoryInput("")
    setOpenCategorySuggestions(false)
  }

  // update category in catalogueItem
  useEffect(() => {
    setCatalogueItem({
      ...catalogueItem,
      category: category.map((category) => ({
        id: category.id,
        name: category.name,
      })),
    })
  }, [category])

  return (
    <div className="flex flex-col gap-2 border p-5 rounded-xl">
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
                onDelete?.(item)
              }}
            >
              <FaTrash />
              Delete
            </button>
          </div>
        </div>
      </dialog>
      <div className="col-span-1">
        {catalogueItem?.image && (
          <img
            src={catalogueItem?.image}
            alt={catalogueItem?.name}
            className="w-[300px] aspect-square object-contain m-auto"
          />
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 col-span-2">
        {Object.entries(catalogueItem || {}).map(
          ([key, value]) => {
            if (key === "_id") return null
            if (mode === "view") {
              if (key === "category") {
                return (
                  <Input key={key} label={key}>
                    {value
                      .map(
                        (category: any) =>
                          category.name
                      )
                      .join(", ")}
                  </Input>
                )
              }
              return (
                <Input key={key} label={key}>
                  {key === "url" ||
                  key === "image" ? (
                    <a
                      href={value}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary"
                    >
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </Input>
              )
            }

            if (mode === "edit") {
              if (key === "description") {
                return (
                  <Input key={key} label={key}>
                    <textarea
                      value={value}
                      onChange={(e) =>
                        setCatalogueItem({
                          ...catalogueItem,
                          [key]: e.target.value,
                        })
                      }
                      placeholder={`Enter ${key}`}
                      className="w-full input input-bordered"
                    />
                  </Input>
                )
              }

              if (key === "category") {
                return (
                  <Input key={key} label={key}>
                    <div className="flex items-center gap-2">
                      <div className="flex relative w-full">
                        <input
                          value={categoryInput}
                          onFocus={() => {
                            setOpenCategorySuggestions(
                              true
                            )
                          }}
                          onChange={(e) => {
                            setCategoryInput(
                              e.target.value
                            )
                            setOpenCategorySuggestions(
                              true
                            )
                          }}
                          placeholder={`Enter ${key}`}
                          className="input input-bordered w-full"
                        />

                        {openCategorySuggestions &&
                          categoryInput && (
                            <CategorySearch
                              query={
                                categoryInput
                              }
                              suggestions={
                                availableCategories
                              }
                              onSelect={({
                                id,
                                name,
                              }) => {
                                onCategorySelect({
                                  id,
                                  name,
                                })
                              }}
                              onClose={() => {
                                setOpenCategorySuggestions(
                                  false
                                )
                              }}
                            />
                          )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {category.map(
                        (category) => (
                          <div
                            key={category.name}
                            className="badge badge-md flex items-center gap-2"
                          >
                            {category.name}
                            <FaTimes
                              onClick={() => {
                                handleRemoveCategory(
                                  category.name
                                )
                              }}
                              className="cursor-pointer"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </Input>
                )
              }

              if (key === "manufacturer") {
                return (
                  <Input key={key} label={key}>
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex w-full relative">
                        <input
                          onFocus={() =>
                            setOpenManufacturerSuggestions(
                              true
                            )
                          }
                          value={value}
                          onChange={(e) =>
                            setCatalogueItem({
                              ...catalogueItem,
                              [key]:
                                e.target.value,
                            })
                          }
                          placeholder={`Enter ${key}`}
                          className="input input-bordered w-full"
                        />
                        {openManufacturerSuggestions && (
                          <ManufacturerSearch
                            query={value}
                            suggestions={
                              availableManufacturers
                            }
                            onSelect={(value) => {
                              setCatalogueItem({
                                ...catalogueItem,
                                [key]: value,
                              })
                              setOpenManufacturerSuggestions(
                                false
                              )
                            }}
                            onClose={() => {
                              setOpenManufacturerSuggestions(
                                false
                              )
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </Input>
                )
              }

              if (key === "type") {
                return (
                  <Input key={key} label={key}>
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex w-full relative">
                        <input
                          onFocus={() =>
                            setOpenTypeSuggestions(
                              true
                            )
                          }
                          value={value}
                          onChange={(e) =>
                            setCatalogueItem({
                              ...catalogueItem,
                              [key]:
                                e.target.value,
                            })
                          }
                          placeholder={`Enter ${key}`}
                          className="input input-bordered w-full"
                        />
                        {openTypeSuggestions && (
                          <TypeSearch
                            query={value}
                            suggestions={
                              availableTypes
                            }
                            onSelect={(value) => {
                              setCatalogueItem({
                                ...catalogueItem,
                                [key]: value,
                              })
                              setOpenTypeSuggestions(
                                false
                              )
                            }}
                            onClose={() => {
                              setOpenTypeSuggestions(
                                false
                              )
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </Input>
                )
              }

              return (
                <Input key={key} label={key}>
                  <input
                    value={value}
                    onChange={(e) =>
                      setCatalogueItem({
                        ...catalogueItem,
                        [key]: e.target.value,
                      })
                    }
                    placeholder={`Enter ${key}`}
                    className="w-full input input-bordered"
                  />
                </Input>
              )
            }

            if (mode === "create") {
              // price, shipping are numbers
              if (
                key === "sku" ||
                key === "price" ||
                key === "shipping"
              ) {
                return (
                  <Input key={key} label={key}>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        setCatalogueItem({
                          ...catalogueItem,
                          [key]: e.target.value,
                        })
                      }
                      placeholder={`Enter ${key}`}
                      className="w-full input input-bordered"
                    />
                  </Input>
                )
              }
              // text area for description
              if (key === "description") {
                return (
                  <Input key={key} label={key}>
                    <textarea
                      value={value}
                      onChange={(e) =>
                        setCatalogueItem({
                          ...catalogueItem,
                          [key]: e.target.value,
                        })
                      }
                      placeholder={`Enter ${key}`}
                      className="w-full input input-bordered"
                    />
                  </Input>
                )
              }

              // category is an array
              if (key === "category") {
                return (
                  <Input key={key} label={key}>
                    <div className="flex items-center gap-2 relative">
                      <input
                        value={categoryInput}
                        onChange={(e) =>
                          setCategoryInput(
                            e.target.value
                          )
                        }
                        placeholder={`Enter ${key}`}
                        className="input input-bordered w-full"
                      />
                      {categoryInput && (
                        <CategorySearch
                          query={categoryInput}
                          suggestions={
                            availableCategories
                          }
                          onSelect={({
                            id,
                            name,
                          }) => {
                            onCategorySelect({
                              id,
                              name,
                            })
                          }}
                        />
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {category.map(
                        (category) => (
                          <div
                            key={category.name}
                            className="badge badge-md flex items-center gap-2"
                          >
                            {category.name}
                            <FaTimes
                              onClick={() => {
                                handleRemoveCategory(
                                  category.name
                                )
                              }}
                              className="cursor-pointer"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </Input>
                )
              }

              if (key === "manufacturer") {
                return (
                  <Input key={key} label={key}>
                    <div className="flex items-center gap-2 w-full relative">
                      <input
                        onFocus={() =>
                          setOpenManufacturerSuggestions(
                            true
                          )
                        }
                        value={value}
                        onChange={(e) =>
                          setCatalogueItem({
                            ...catalogueItem,
                            [key]: e.target.value,
                          })
                        }
                        placeholder={`Enter ${key}`}
                        className="input input-bordered w-full"
                      />
                      {openManufacturerSuggestions && (
                        <ManufacturerSearch
                          query={value}
                          suggestions={
                            availableManufacturers
                          }
                          onSelect={(value) => {
                            setCatalogueItem({
                              ...catalogueItem,
                              [key]: value,
                            })
                            setOpenManufacturerSuggestions(
                              false
                            )
                          }}
                          onClose={() => {
                            setOpenManufacturerSuggestions(
                              false
                            )
                          }}
                        />
                      )}
                    </div>
                  </Input>
                )
              }

              if (key === "type") {
                return (
                  <Input key={key} label={key}>
                    <div className="flex items-center gap-2 w-full relative">
                      <input
                        onFocus={() =>
                          setOpenTypeSuggestions(
                            true
                          )
                        }
                        value={value}
                        onChange={(e) =>
                          setCatalogueItem({
                            ...catalogueItem,
                            [key]: e.target.value,
                          })
                        }
                        placeholder={`Enter ${key}`}
                        className="input input-bordered w-full"
                      />
                      {openTypeSuggestions && (
                        <TypeSearch
                          query={value}
                          suggestions={
                            availableTypes
                          }
                          onSelect={(value) => {
                            setCatalogueItem({
                              ...catalogueItem,
                              [key]: value,
                            })
                            setOpenTypeSuggestions(
                              false
                            )
                          }}
                          onClose={() => {
                            setOpenTypeSuggestions(
                              false
                            )
                          }}
                        />
                      )}
                    </div>
                  </Input>
                )
              }

              // rest
              return (
                <Input key={key} label={key}>
                  <input
                    value={value}
                    onChange={(e) =>
                      setCatalogueItem({
                        ...catalogueItem,
                        [key]: e.target.value,
                      })
                    }
                    placeholder={`Enter ${key}`}
                    className="w-full input input-bordered"
                  />
                </Input>
              )
            }
          }
        )}
      </div>
      <div className="flex gap-2">
        {mode === "view" && (
          <>
            <button
              className="btn btn-warning ms-auto flex items-center gap-2"
              onClick={() => {
                navigate(
                  `/catalogue/${catalogueItem.sku}/edit`
                )
              }}
            >
              <FaEdit />
              Edit
            </button>
            <button
              className="btn btn-error"
              onClick={() => {
                modalRef.current?.showModal()
              }}
            >
              <FaTrash />
              Delete
            </button>
          </>
        )}
        {mode === "edit" && (
          <>
            <button
              className="btn  ms-auto flex items-center gap-2"
              onClick={() => {
                navigate(
                  `/catalogue/${catalogueItem.sku}`
                )
              }}
            >
              <FaTimes />
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                onUpdate?.(catalogueItem)
              }}
            >
              <FaSave />
              Save
            </button>
          </>
        )}
        {mode === "create" && (
          <button
            className="btn btn-primary ms-auto flex items-center gap-2"
            onClick={() => {
              onCreate?.(catalogueItem)
            }}
          >
            <FaPlus />
            Create
          </button>
        )}
      </div>
    </div>
  )
}

const Input = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => {
  return (
    <div className="grid grid-cols-3 p-5 border rounded-xl gap-2 w-full">
      <label className="col-span-1 border-r mr-5 capitalize self-center font-bold">
        {label}
      </label>
      <div className="col-span-2 self-center w-full">
        <div className="w-full break-words flex gap-2 flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}

const CategorySearch = ({
  query,
  suggestions,
  onSelect,
  onClose,
}: {
  query: string
  suggestions: {
    id: string
    name: string
  }[]
  onSelect: (value: {
    id: string
    name: string
  }) => void
  onClose?: () => void
}) => {
  const suggestionRef =
    useRef<HTMLDivElement>(null)

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.name
        .toLowerCase()
        .includes(query.toLowerCase())
  )

  // useEffect for clicking outside the suggestions
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(e.target)
      ) {
        onClose?.()
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
      className="absolute bg-white border rounded-xl top-12 w-full max-h-[300px] overflow-y-auto"
      ref={suggestionRef}
    >
      {filteredSuggestions.map((suggestion) => {
        return (
          <div
            key={suggestion.name + suggestion.id}
            className="p-2 border-b cursor-pointer"
            onClick={() =>
              onSelect({
                id: suggestion.id,
                name: suggestion.name,
              })
            }
          >
            {suggestion.name}
          </div>
        )
      })}
    </div>
  )
}

const ManufacturerSearch = ({
  query,
  suggestions,
  onSelect,
  onClose,
}: {
  query: string
  suggestions: string[]
  onSelect: (value: string) => void
  onClose?: () => void
}) => {
  const suggestionRef =
    useRef<HTMLDivElement>(null)
  // remove null and ""
  const filteredSuggestions = suggestions
    .filter((suggestion) => suggestion)
    .filter((suggestion) =>
      suggestion
        .toLowerCase()
        .includes(query.toLowerCase())
    )

  // useEffect for clicking outside the suggestions
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(e.target)
      ) {
        onClose?.()
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
      className="absolute bg-white border rounded-xl top-12 w-full max-h-[300px] overflow-y-auto"
      ref={suggestionRef}
    >
      {filteredSuggestions.map((suggestion) => {
        return (
          <div
            key={suggestion}
            className="p-2 border-b cursor-pointer"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </div>
        )
      })}
    </div>
  )
}

const TypeSearch = ({
  query,
  suggestions,
  onSelect,
  onClose,
}: {
  query: string
  suggestions: string[]
  onSelect: (value: string) => void
  onClose?: () => void
}) => {
  const suggestionRef =
    useRef<HTMLDivElement>(null)
  // remove null and ""
  const filteredSuggestions = suggestions
    .filter((suggestion) => suggestion)
    .filter((suggestion) =>
      suggestion
        .toLowerCase()
        .includes(query.toLowerCase())
    )

  // useEffect for clicking outside the suggestions
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(e.target)
      ) {
        onClose?.()
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
      className="absolute bg-white border rounded-xl top-12 w-full max-h-[300px] overflow-y-auto"
      ref={suggestionRef}
    >
      {filteredSuggestions.map((suggestion) => {
        return (
          <div
            key={suggestion}
            className="p-2 border-b cursor-pointer"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </div>
        )
      })}
    </div>
  )
}
