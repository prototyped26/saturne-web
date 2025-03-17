import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6'
import { useEffect, useState } from 'react'

type Props = {
  total: number,
  current: number,
  perPage: number,
  pages: number,
  action: (p) => void
}

function TableNavigationFooter({ total, current, perPage, pages, action }: Props): JSX.Element {

  const [list, setList] = useState<number[]>([])
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    setSelected(current)
    const arr: number[] = []
    for (let i = 1; i <= pages; i++) arr.push(i)
    setList(arr)
  }, [])

  const onHandleChangePage = (page: number): void => {
    setSelected(page)
    action(page)
  }

  const onHandleNext = (e): void => {
    e.preventDefault()
    if (selected < pages) {
      const res = selected + 1
      setSelected(res)
      action(res)
    }
  }

  const onHandlePrevious = (e): void => {
    e.preventDefault()
    if (selected > 1) {
      const res = selected - 1
      setSelected(res)
      action(res)
    }
  }

  return (
    <nav
      className="flex flex-col items-start justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Affichage
        <span className="font-semibold text-gray-900 dark:text-white">1 - {perPage} </span>
        sur
        <span className="font-semibold text-gray-900 dark:text-white"> {total} </span>
      </span>
      <ul className="inline-flex items-stretch -space-x-px">
        <li>
          <a
            href="#" onClick={(e) => onHandlePrevious(e)}
            className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <FaArrowLeft />
          </a>
        </li>
        <li>
          <select
            className="select select-md"
            name="page"
            id="page"
            value={selected}
            onChange={(e) => onHandleChangePage(Number(e.target.value))}
          >
            {list.map((item) => (
              <option key={Math.random() + Date.now()} value={item}>
                {item}
              </option>
            ))}
          </select>
        </li>
        <li>
          <a
            href="#" onClick={(e) => onHandleNext(e)}
            className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <FaArrowRight />
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default TableNavigationFooter
