import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from 'react'

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  mandate: number,
  fund: number
}

function ChartActifSousGestion({ mandate, fund }: Props): JSX.Element {

  const [values, setValues] = useState<string[]>([])
  const [data, setData] = useState<any>()

  useEffect(() => {
    const val: string[] = [fund.toFixed(2), mandate.toFixed(2)]
    setValues(val)

    const data = {
      labels: ['Total actifs sous gestion des OPC', 'Total actifs sous gestion mandats'],
      datasets: [
        {
          label: 'XAF',
          data: val,
          backgroundColor: [
            'rgba(26, 142, 142, 0.7)',
            'rgba(229, 182, 102, 0.7)',
          ],
          borderColor: [
            'rgba(26, 142, 142, 1)',
            'rgba(229, 182, 102, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }

    setData(data)
  }, [])

  useEffect(() => {

  }, [values])

  return (
    <div className="flex w-full items-center justify-center">
      {data !== null && data !== undefined && (<Doughnut data={data} />)}
    </div>
  )
}

export default  ChartActifSousGestion
