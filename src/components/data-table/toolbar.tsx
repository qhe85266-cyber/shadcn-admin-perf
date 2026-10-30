import { useEffect, useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './faceted-filter'
import { DataTableViewOptions } from './view-options'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  searchKey?: string
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchKey,
  filters = [],
}: DataTableToolbarProps<TData>) {
  const filterValue = searchKey
    ? ((table.getColumn(searchKey)?.getFilterValue() as string) ?? '')
    : (table.getState().globalFilter ?? '')
  const [search, setSearch] = useState({
    value: filterValue,
    source: filterValue,
  })

  // External resets and URL navigation invalidate any pending input.
  if (search.source !== filterValue) {
    setSearch({ value: filterValue, source: filterValue })
  }
  const debouncedSearch = useDebouncedValue(search)

  useEffect(() => {
    if (debouncedSearch !== search || search.source !== filterValue) return
    if (debouncedSearch.value === filterValue) return
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(debouncedSearch.value)
    } else {
      table.setGlobalFilter(debouncedSearch.value)
    }
  }, [debouncedSearch, search, filterValue, searchKey, table])

  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder={searchPlaceholder}
          value={search.value}
          onChange={(event) =>
            setSearch({ ...search, value: event.target.value })
          }
          className='h-8 w-37.5 lg:w-62.5'
        />
        <div className='flex gap-x-2'>
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
        </div>
        {(isFiltered || search.value) && (
          <Button
            variant='ghost'
            onClick={() => {
              setSearch({ value: '', source: '' })
              table.resetColumnFilters()
              table.setGlobalFilter('')
            }}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
