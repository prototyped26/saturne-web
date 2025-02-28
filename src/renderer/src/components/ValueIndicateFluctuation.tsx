import { FiArrowDown, FiArrowUp } from 'react-icons/fi'

type Props = {
  value: number
}

function ValueIndicateFluctuation({ value }: Props): JSX.Element {

  if (value < 0)
    return (
      <label className="text-red-600 flex gap-2 font-bold">
        <FiArrowDown size={20} />
        {value.toFixed(2)} %
      </label>
    )

  if (value > 0)
    return (
      <label className="text-green-950 flex gap-2 font-bold">
        <FiArrowUp size={20} />
        {value.toFixed(2)} %
      </label>
    )

  return (
    <label className=" flex gap-2 font-bold">
      {value.toFixed(2)} %
    </label>
  )
}

export default ValueIndicateFluctuation
