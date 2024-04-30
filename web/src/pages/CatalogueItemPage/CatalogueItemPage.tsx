import { useEffect, useState } from "react"
import { CatalogueItem } from "../../components/CatalogueCard"
import { CatalogueForm } from "../../components/CatalogueForm"
import {
  useNavigate,
  useParams,
} from "react-router-dom"
import { api } from "../../utils/axios"
import { Loading } from "../../components/Loading"
import { toast } from "react-toastify"

export type CataloguePageMode =
  | "view"
  | "edit"
  | "create"

/**
 * CatalogueItemPage component
 * This component is used to display the form for creating, updating and deleting catalogue items
 * Using useParams to get the id of the item to display in view or edit mode and to create a new item
 * @param mode CataloguePageMode
 * @returns JSX.Element
 * @example
 * ```tsx
 * <CatalogueItemPage mode="view" />
 * ```
 *
 *
 */
export const CatalogueItemPage = ({
  mode = "view",
}: {
  mode: CataloguePageMode
}) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [item, setItem] = useState<
    CatalogueItem | undefined
  >(
    mode === "create"
      ? {
          sku: 0,
          name: "",
          type: "",
          price: 0,
          upc: "",
          category: [],
          shipping: 0,
          description: "",
          manufacturer: "",
          model: "",
          url: "",
          image: "",
        }
      : undefined
  )

  const [loading, setLoading] = useState(false)

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

  const onCreate = async (
    item: CatalogueItem
  ) => {
    const id = toast.loading("Creating item...")
    api
      .post(`catalogue`, item)
      .then((res) => {
        if (res.status === 201) {
          toast.update(id, {
            render: "Item created successfully!",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          })
          navigate(`/catalogue/${res.data.sku}`)
        }
      })
      .catch((err) => {
        toast.update(id, {
          render: `Cannot create item: ${err.response.data.error}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        })
      })
  }

  const onUpdate = (item: CatalogueItem) => {
    const id = toast.loading("Updating item...")
    api
      .put(`catalogue/${item._id}`, item)
      .then((res) => {
        if (res.status === 200) {
          toast.update(id, {
            render: "Item updated successfully!",
            type: "success",
            isLoading: false,
            autoClose: 5000,
          })
          navigate(`/catalogue/${item.sku}`)
        }
      })
      .catch((err) => {
        toast.update(id, {
          render: `Cannot update item: ${err.response.data.error}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        })
      })
  }

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
          navigate(`/`)
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
    if (mode === "view" || mode === "edit") {
      setLoading(true)
      api
        .get(`/catalogue/${id}`)
        .then((res) => {
          setItem(res.data)
        })
        .then(() => {
          setLoading(false)
        })
    }
  }, [mode, id])

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

  if (loading || availableFiltersLoading) {
    return <Loading />
  }

  if (!item && mode !== "create") {
    return <div>Item not found</div>
  }

  return (
    <>
      {item && (
        <CatalogueForm
          item={item}
          mode={mode}
          key={mode}
          onCreate={(item) => onCreate(item)}
          onUpdate={(item) => onUpdate(item)}
          onDelete={(item) => onDelete(item)}
          availableFilters={availableFilters}
        />
      )}
    </>
  )
}
