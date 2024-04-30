import {
  useState,
  useRef,
  useEffect,
} from "react"
import {
  FaFilter,
  FaQuestion,
  FaTimes,
} from "react-icons/fa"

/**
 * SearchBar component
 * @param searchQuery string
 * @param setSearchQuery Function
 * @param search Function
 * @param selectedFilter { name: string, value: string }[]
 * @param availableFilters { name: string, values: string[] }[]
 * @param onFilterChange Function
 * @param isAvailableFiltersLoading boolean
 * @returns JSX.Element
 * @example
 * ```tsx
 * <SearchBar
 * searchQuery={searchQuery}
 * setSearchQuery={setSearchQuery}
 * search={search}
 * selectedFilter={selectedFilter}
 * availableFilters={availableFilters}
 * onFilterChange={(name, value) => console.log(name, value)}
 * isAvailableFiltersLoading={false}
 * />
 * ```
 */
export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  search,
  selectedFilter,
  availableFilters,
  isAvailableFiltersLoading,
  onFilterChange,
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
  search: () => void
  selectedFilter: {
    name: string
    value: string
  }[]
  availableFilters: {
    name: string
    values: string[]
  }[]
  onFilterChange: (
    name: string,
    value: string
  ) => void
  isAvailableFiltersLoading: boolean
}) => {
  const [isFilterOpen, setIsFilterOpen] =
    useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      // Check if the click is outside the filter panel and not on the selected filters buttons or the toggle button
      if (
        filterRef.current &&
        !filterRef.current.contains(
          event.target as Node
        ) &&
        !isClickedOnSelectedFilterButton(
          event.target as HTMLElement
        ) &&
        !isToggleFilterButtonClicked(
          event.target as HTMLElement
        )
      ) {
        setIsFilterOpen(false)
      }
    }

    const isClickedOnSelectedFilterButton = (
      target: HTMLElement
    ) => {
      // Check if the clicked element or its parent has the class 'selected-filter-button'
      return (
        target.classList.contains(
          "selected-filter-button"
        ) ||
        target.parentElement?.classList.contains(
          "selected-filter-button"
        )
      )
    }

    const isToggleFilterButtonClicked = (
      target: HTMLElement
    ) => {
      // Check if the clicked element or its parent has the class 'toggle-filter-button'
      return (
        target.classList.contains(
          "toggle-filter-button"
        ) ||
        target.parentElement?.classList.contains(
          "toggle-filter-button"
        )
      )
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
    <>
      <div className="flex w-full gap-2">
        <input
          type="text"
          placeholder="Search product name, model..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          className="input input-bordered w-full"
        />
        <button
          onClick={() =>
            setIsFilterOpen(!isFilterOpen)
          }
          className="btn btn-primary"
        >
          <FaFilter />
          Filter
        </button>
      </div>
      <div
        className="flex flex-wrap gap-2"
        ref={filterRef}
      >
        {selectedFilter.map((filter) => {
          return (
            <button
              key={filter.name + filter.value}
              className="btn btn-sm rounded-full btn-outline selected-filter-button"
              onClick={() => {
                if (
                  filter.name === "minPrice" ||
                  filter.name === "maxPrice"
                ) {
                  onFilterChange(filter.name, "")
                  return
                }

                onFilterChange(
                  filter.name,
                  filter.value
                )
              }}
            >
              {filter.name}: {filter.value}
              <FaTimes />
            </button>
          )
        })}
      </div>
      {isFilterOpen && (
        <div
          ref={filterRef}
          className="flex w-full gap-2 border p-5 rounded-xl shadow flex-col"
        >
          <div className="flex justify-between w-full items-center">
            <p className="font-bold">Filter</p>
            <button
              className="btn btn-sm btn-circle"
              onClick={() =>
                setIsFilterOpen(false)
              }
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <CategorySearch
              categories={
                availableFilters[0].values
              }
              onFilterChange={(name, value) => {
                onFilterChange(name, value)
              }}
            />
            <ManufacturerSearch
              manufacturers={
                availableFilters[1].values
              }
              onFilterChange={(name, value) => {
                onFilterChange(name, value)
              }}
            />
            <TypeSearch
              types={availableFilters[2].values}
              onFilterChange={(name, value) => {
                onFilterChange(name, value)
              }}
            />
            <PriceRangeSearch
              priceRange={{
                min: parseInt(
                  selectedFilter.find(
                    (f) => f.name === "minPrice"
                  )?.value || "0"
                ),
                max: parseInt(
                  selectedFilter.find(
                    (f) => f.name === "maxPrice"
                  )?.value || "0"
                ),
              }}
              onMinPriceChange={(value) => {
                onFilterChange(
                  "minPrice",
                  value.toString()
                )
              }}
              onMaxPriceChange={(value) => {
                onFilterChange(
                  "maxPrice",
                  value.toString()
                )
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}

/**
 * CategorySearch component
 * description: Search for a category by name and select a category to start filtering
 * @param categories string[]
 * @param onFilterChange Function
 * @returns JSX.Element
 * @example
 * ```tsx
 * <CategorySearch
 * categories={categories}
 * onFilterChange={(name, value) => console.log(name, value)}
 * />
 * ```
 */
const CategorySearch = ({
  categories,
  onFilterChange,
}: {
  categories: string[]
  onFilterChange: (
    name: string,
    value: string
  ) => void
}) => {
  const [suggest, setSuggest] = useState<
    string[] | undefined
  >()

  const [searchValue, setSearchValue] =
    useState("")
  const [
    searchValueDebounce,
    setSearchValueDebounce,
  ] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchValueDebounce(searchValue)
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchValue])

  useEffect(() => {
    if (searchValueDebounce) {
      const filteredCategories =
        categories.filter((c: any) =>
          c?.name
            .toLowerCase()
            .includes(
              searchValueDebounce.toLowerCase()
            )
        )
      setSuggest(filteredCategories)
    }
  }, [searchValueDebounce, categories])

  return (
    <div className="collapse collapse-arrow bg-gray-100">
      <input type="radio" name="my-accordion-2" />
      <div className="collapse-title text-xl font-medium">
        Category
      </div>
      <div className="collapse-content">
        <div className="label justify-start gap-2">
          <FaQuestion />
          <span>
            Search for a category by name and
            select a category to start filtering
          </span>
        </div>
        <input
          type="text"
          placeholder="Search category..."
          value={searchValue}
          onChange={(e) =>
            setSearchValue(e.target.value)
          }
          className="input input-bordered w-full"
        />
        {searchValue && (
          <ul className="p-2 shadow bg-base-100 rounded-box w-full max-h-[300px] overflow-y-auto">
            {suggest?.map((category: any) => {
              return (
                <li key={category.id}>
                  <button
                    className="btn btn-sm btn-ghost justify-start w-full"
                    onClick={() => {
                      onFilterChange(
                        "category",
                        category.name
                      )
                    }}
                  >
                    {category.name}
                  </button>
                </li>
              )
            })}
            {suggest?.length === 0 && (
              <li>No results found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

/**
 * ManufacturerSearch component
 * description: Search for a manufacturer by name and select a manufacturer to start filtering
 * @param manufacturers string[]
 * @param onFilterChange Function
 * @returns JSX.Element
 * @example
 * ```tsx
 * <ManufacturerSearch
 * manufacturers={manufacturers}
 * onFilterChange={(name, value) => console.log(name, value)}
 * />
 * ```
 */
const ManufacturerSearch = ({
  manufacturers,
  onFilterChange,
}: {
  manufacturers: string[]
  onFilterChange: (
    name: string,
    value: string
  ) => void
}) => {
  const [suggest, setSuggest] = useState<
    string[] | undefined
  >()

  const [searchValue, setSearchValue] =
    useState("")
  const [
    searchValueDebounce,
    setSearchValueDebounce,
  ] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchValueDebounce(searchValue)
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchValue])

  useEffect(() => {
    if (searchValueDebounce) {
      const filteredWithoutNullOrEmpty =
        manufacturers.filter((m) => m)

      const filteredManufacturers =
        filteredWithoutNullOrEmpty.filter((m) =>
          m
            .toLowerCase()
            .includes(
              searchValueDebounce.toLowerCase()
            )
        )
      setSuggest(filteredManufacturers)
    }
  }, [searchValueDebounce, manufacturers])

  return (
    <div className="collapse collapse-arrow bg-gray-100">
      <input type="radio" name="my-accordion-2" />
      <div className="collapse-title text-xl font-medium">
        Manufacturer
      </div>
      <div className="collapse-content">
        <div className="label justify-start gap-2">
          <FaQuestion />
          <span>
            Search for a manufacturer by name and
            select a manufacturer to start
            filtering
          </span>
        </div>
        <input
          type="text"
          placeholder="Search manufacturer..."
          value={searchValue}
          onChange={(e) =>
            setSearchValue(e.target.value)
          }
          className="input input-bordered w-full"
        />
        {searchValue && (
          <ul className="p-2 shadow bg-base-100 rounded-box w-full max-h-[300px] overflow-y-auto">
            {suggest?.map((manufacturer: any) => {
              return (
                <li key={manufacturer}>
                  <button
                    className="btn btn-sm btn-ghost justify-start w-full"
                    onClick={() => {
                      onFilterChange(
                        "manufacturer",
                        manufacturer
                      )
                    }}
                  >
                    {manufacturer}
                  </button>
                </li>
              )
            })}
            {suggest?.length === 0 && (
              <li>No results found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

/**
 * TypeSearch component
 * description: Search for a type by name and select a type to start filtering
 * @param types string[]
 * @param onFilterChange Function
 * @returns JSX.Element
 * @example
 * ```tsx
 * <TypeSearch
 * types={types}
 * onFilterChange={(name, value) => console.log(name, value)}
 * />
 * ```
 */
const TypeSearch = ({
  types,
  onFilterChange,
}: {
  types: string[]
  onFilterChange: (
    name: string,
    value: string
  ) => void
}) => {
  const [suggest, setSuggest] = useState<
    string[] | undefined
  >()

  const [searchValue, setSearchValue] =
    useState("")
  const [
    searchValueDebounce,
    setSearchValueDebounce,
  ] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchValueDebounce(searchValue)
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchValue])

  useEffect(() => {
    if (searchValueDebounce) {
      const filteredTypes = types.filter((t) =>
        t
          .toLowerCase()
          .includes(
            searchValueDebounce.toLowerCase()
          )
      )
      setSuggest(filteredTypes)
    }
  }, [searchValueDebounce, types])

  return (
    <div className="collapse collapse-arrow bg-gray-100">
      <input type="radio" name="my-accordion-2" />
      <div className="collapse-title text-xl font-medium">
        Type
      </div>
      <div className="collapse-content">
        <div className="label justify-start gap-2">
          <FaQuestion />
          <span>
            Search for a type by name and select a
            type to start filtering
          </span>
        </div>
        <input
          type="text"
          placeholder="Search type..."
          value={searchValue}
          onChange={(e) =>
            setSearchValue(e.target.value)
          }
          className="input input-bordered w-full"
        />
        {searchValue && (
          <ul className="p-2 shadow bg-base-100 rounded-box w-full max-h-[300px] overflow-y-auto">
            {suggest?.map((type: any) => {
              return (
                <li key={type}>
                  <button
                    className="btn btn-sm btn-ghost justify-start w-full"
                    onClick={() => {
                      onFilterChange("type", type)
                    }}
                  >
                    {type}
                  </button>
                </li>
              )
            })}
            {suggest?.length === 0 && (
              <li>No results found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

/**
 * PriceRangeSearch component
 * description: Select a price range to start filtering
 * @param priceRange { min: number, max: number }
 * @param onMinPriceChange Function
 * @param onMaxPriceChange Function
 * @returns JSX.Element
 * @example
 * ```tsx
 * <PriceRangeSearch
 * priceRange={{ min: 0, max: 0 }}
 * onMinPriceChange={(value) => console.log(value)}
 * onMaxPriceChange={(value) => console.log(value)}
 * />
 * ```
 */
const PriceRangeSearch = ({
  priceRange,
  onMinPriceChange,
  onMaxPriceChange,
}: {
  priceRange: {
    min: number
    max: number
  }
  onMinPriceChange: (value: number) => void
  onMaxPriceChange: (value: number) => void
}) => {
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)

  useEffect(() => {
    setMin(priceRange.min)
    setMax(priceRange.max)
  }, [])

  return (
    <div className="collapse collapse-arrow bg-gray-100">
      <input type="radio" name="my-accordion-2" />
      <div className="collapse-title text-xl font-medium">
        Price Range
      </div>
      <div className="collapse-content">
        <div className="label justify-start gap-2">
          <FaQuestion />
          <span>
            Select a price range to start
            filtering
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            value={min}
            min={0}
            onChange={(e) => {
              setMin(parseInt(e.target.value))
              onMinPriceChange(
                parseInt(e.target.value)
              )
            }}
            className="input input-bordered"
          />
          <input
            type="number"
            value={max}
            min={0}
            onChange={(e) => {
              setMax(parseInt(e.target.value))
              onMaxPriceChange(
                parseInt(e.target.value)
              )
            }}
            className="input input-bordered"
          />
        </div>
      </div>
    </div>
  )
}
