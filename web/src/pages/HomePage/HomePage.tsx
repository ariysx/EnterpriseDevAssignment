import { useNavigate } from "react-router-dom"
import { Dropdown } from "../../components/Dropdown"
import { SearchBar } from "../../components/SearchBar"
import { CatalogueList } from "../../components/CatalogueList"
import {
  CatalogueCard,
  CatalogueItem,
} from "../../components/CatalogueCard"
import { useEffect, useState } from "react"
import { Pagination } from "../../components/Pagination"
import { FaList } from "react-icons/fa"
import { api } from "../../utils/axios"
import { toast } from "react-toastify"
import { Loading } from "../../components/Loading"

/**
 * HomePage component
 * This component is used to display the list of catalogue items and the search bar
 * @returns JSX.Element
 * @example
 * ```tsx
 * <HomePage />
 * ```
 */
export const HomePage = () => {
  const navigate = useNavigate()

  const [viewMode, setViewMode] = useState<
    "list" | "grid"
  >("list")

  const [items, setItems] = useState<
    CatalogueItem[]
  >([])
  const [itemsLoading, setItemsLoading] =
    useState(false)
  const [
    availableFiltersLoading,
    setAvailableFiltersLoading,
  ] = useState(false)
  const [availableFilters, setAvailableFilters] =
    useState<
      {
        name: string
        values: any
      }[]
    >([])

  const [selectedFilters, setSelectedFilters] =
    useState<
      {
        name: string
        value: string
      }[]
    >([])

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchDebounce, setSearchDebounce] =
    useState("")
  const [itemsPerPage, setItemsPerPage] =
    useState(48)
  const [maxPage, setMaxPage] = useState(1)

  useEffect(() => {
    setMaxPage(1)
    setPage(1)
  }, [itemsPerPage])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchDebounce(search)
    }, 300)

    return () => {
      clearTimeout(timeout)
    }
  }, [search])

  useEffect(() => {
    // fetch items

    const categories = selectedFilters.filter(
      (f) => f.name === "category"
    )

    const manufacturers = selectedFilters.filter(
      (f) => f.name === "manufacturer"
    )

    const types = selectedFilters.filter(
      (f) => f.name === "type"
    )

    const minPrice = selectedFilters.find(
      (f) => f.name === "minPrice"
    )

    const maxPrice = selectedFilters.find(
      (f) => f.name === "maxPrice"
    )

    const constructParams = () => {
      const params = new URLSearchParams()
      if (searchDebounce) {
        params.append("search", searchDebounce)
      }
      params.append("page", page.toString())
      params.append(
        "limit",
        itemsPerPage.toString()
      )

      if (categories.length > 0) {
        params.append(
          "category",
          categories.map((f) => f.value).join(",")
        )
      }

      if (manufacturers.length > 0) {
        params.append(
          "manufacturer",
          manufacturers
            .map((f) => f.value)
            .join(",")
        )
      }

      if (types.length > 0) {
        params.append(
          "type",
          types.map((f) => f.value).join(",")
        )
      }

      if (minPrice) {
        params.append("minPrice", minPrice.value)
      }

      if (maxPrice) {
        params.append("maxPrice", maxPrice.value)
      }

      return params
    }

    setItemsLoading(true)
    api
      .get(
        `/catalogue/search?` +
          constructParams().toString()
      )
      .then((res) => {
        setItems(res.data.catalogueItems)
        setMaxPage(res.data.maxPage)
      })
      .then(() => {
        setItemsLoading(false)
      })
  }, [
    searchDebounce,
    page,
    itemsPerPage,
    selectedFilters,
  ])

  useEffect(() => {
    // fetch items
    setItemsLoading(true)
    api
      .get(
        `/catalogue?page=${page}&limit=${itemsPerPage}`
      )
      .then((res) => {
        setItems(res.data.catalogueItems)
        setMaxPage(res.data.maxPage)
      })
      .then(() => {
        setItemsLoading(false)
      })
  }, [])

  const onDelete = (item: CatalogueItem) => {
    const id = toast.loading("Deleting item...")
    api
      .delete(`catalogue/${item.sku}`)
      .then((res) => {
        if (res.status === 200) {
          toast.update(id, {
            render: "Item deleted successfully!",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          })
          api
            .get(
              `/catalogue?page=${page}&limit=${itemsPerPage}`
            )
            .then((res) => {
              setItems(res.data.catalogueItems)
              setMaxPage(res.data.maxPage)
            })
        }
      })
      .catch((err) => {
        toast.update(id, {
          render: `Cannot delete item: ${err.response.data.error}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        })
      })
  }

  useEffect(() => {
    setAvailableFiltersLoading(true)
    api
      .get("/catalogue/available-filters")
      .then((res) => {
        setAvailableFilters([
          {
            name: "category",
            values: res.data.categories,
          },
          {
            name: "manufacturer",
            values: res.data.manufacturers,
          },
          {
            name: "type",
            values: res.data.types,
          },
        ])
      })
      .then(() => {
        setAvailableFiltersLoading(false)
      })
  }, [])

  const onFilterChange = (filter: {
    name: string
    value: string
  }) => {
    if (
      filter.name === "minPrice" ||
      filter.name === "maxPrice"
    ) {
      const removed = selectedFilters.filter(
        (f) => f.name !== filter.name
      )

      if (filter.value !== "") {
        setSelectedFilters([...removed, filter])
      } else {
        setSelectedFilters([...removed])
      }
      return
    }

    // toggle
    const existingIndex =
      selectedFilters.findIndex(
        (f) =>
          f.name === filter.name &&
          f.value === filter.value
      )

    if (existingIndex !== -1) {
      const updatedFilters = [...selectedFilters]
      updatedFilters.splice(existingIndex, 1)
      setSelectedFilters(updatedFilters)
    } else {
      setSelectedFilters([
        ...selectedFilters,
        filter,
      ])
    }
  }

  const onBulkExport = (ids: number[]) => {
    const id = toast.loading("Exporting items...")
    api
      .post("/catalogue/bulk/export", {
        skus: ids,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.update(id, {
            render:
              "Items exported successfully!",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          })
          // we're getting json back so download it
          const url = window.URL.createObjectURL(
            new Blob([JSON.stringify(res.data)])
          )
          const link = document.createElement("a")
          link.href = url
          link.setAttribute(
            "download",
            "exported-items.json"
          )
          document.body.appendChild(link)
          link.click()
        }
      })
      .catch((err) => {
        toast.update(id, {
          render: `Cannot export items: ${err.response.data.error}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        })
      })
  }

  if (availableFiltersLoading) {
    return <Loading />
  }

  if (itemsLoading && !items) {
    return null
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-2">
        <SearchBar
          search={() => {}}
          searchQuery={search}
          setSearchQuery={setSearch}
          availableFilters={availableFilters}
          selectedFilter={selectedFilters}
          onFilterChange={(name, value) =>
            onFilterChange({ name, value })
          }
          isAvailableFiltersLoading={
            availableFiltersLoading
          }
        />
        <div className="flex justify-between">
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate("/catalogue/create")
              }}
            >
              Add Product
            </button>
          </div>
          <div className="flex">
            <Dropdown
              onChange={(option) => {
                setViewMode(
                  option as "list" | "grid"
                )
              }}
              options={["list", "grid"]}
              selected={viewMode}
              align="end"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-2 flex-col">
        {viewMode === "list" &&
        !itemsLoading &&
        items.length > 0 ? (
          <CatalogueList
            items={items}
            onEdit={(item) => {
              navigate(
                `/catalogue/${item.sku}/edit`
              )
            }}
            onDelete={(item) => {
              onDelete(item)
            }}
            onBulkDelete={(items) => {
              items.forEach((item) => {
                onDelete(item)
              })
            }}
            onBulkExport={(items) => {
              const ids = items.map(
                (item) => item.sku
              )

              onBulkExport(ids)
            }}
          >
            <div className="flex gap-2 w-full items-center justify-end">
              <div className="flex">
                <div className="flex text-sm items-center gap-1">
                  <FaList /> Items per page
                </div>
                <Dropdown
                  onChange={(option) => {
                    setItemsPerPage(
                      parseInt(option)
                    )
                  }}
                  options={["48", "96", "120"]}
                  selected={itemsPerPage.toString()}
                  size="sm"
                />
              </div>
              <div className="">
                <Pagination
                  currentPage={page}
                  totalPages={maxPage}
                  onNext={() => setPage(page + 1)}
                  onPrev={() => setPage(page - 1)}
                  onChange={(page) =>
                    setPage(page)
                  }
                />
              </div>
            </div>
          </CatalogueList>
        ) : (
          <>
            <div className="flex gap-2 w-full items-center justify-end">
              <div className="flex">
                <div className="flex text-sm items-center gap-1">
                  <FaList /> Items per page
                </div>
                <Dropdown
                  onChange={(option) => {
                    setItemsPerPage(
                      parseInt(option)
                    )
                  }}
                  options={["48", "96", "120"]}
                  selected={itemsPerPage.toString()}
                  size="sm"
                />
              </div>
              <div className="">
                <Pagination
                  currentPage={page}
                  totalPages={maxPage}
                  onNext={() => setPage(page + 1)}
                  onPrev={() => setPage(page - 1)}
                  onChange={(page) =>
                    setPage(page)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-5">
              {!itemsLoading &&
                items.map((item) => (
                  <CatalogueCard
                    item={item}
                    onEdit={() => {
                      navigate(
                        `/catalogue/${item.sku}/edit`
                      )
                    }}
                    onView={() => {
                      navigate(
                        `/catalogue/${item.sku}`
                      )
                    }}
                    onDelete={() => {
                      onDelete(item)
                    }}
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
