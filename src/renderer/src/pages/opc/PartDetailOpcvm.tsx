import { Iopcvm, ITypeOpc } from '../../type'
import { NumericFormat } from 'react-number-format'

type Props = {
  typesOpcs: ITypeOpc[],
  opcvms: Iopcvm[]
}

function PartDetailOpcvm({ typesOpcs, opcvms }: Props): JSX.Element {

  const sizeOfTyopOpc = (list: ITypeOpc[]): number => {
    if (list) {
      return list.length
    } else {
      return 0
    }
  }

  return (
    <div>
      {typesOpcs.map((type) => (
        <div key={type?.id} className="border bg-white dark:border-gray-50 rounded-lg p-4 mb-2">
          <p className="text-sm font-black">{type?.label}</p>
          <div className="w-full">
            <table className="table text-xs">
              <thead>
              <tr>
                <td></td>
                <th>Nombre</th>
                <th>Cours</th>
                <th>Valeur</th>
                <th>%</th>
              </tr>
              </thead>
              {sizeOfTyopOpc(type?.subType as ITypeOpc[]) > 0 && (
                type?.subType?.map((stype) => (
                  <tbody key={(Number(stype?.id) + Math.random())}>
                  <tr key={Number(stype?.id) + Math.random()}>
                    <td className="font-bold" colSpan={4}>{stype.label}</td>
                  </tr>
                  {opcvms?.map(
                    (opcvm) =>
                      opcvm.opcvmType?.id === stype.id && (
                        <tr className={opcvm?.label?.toLowerCase().includes('total') ? 'font-bold' : ''} key={(opcvm.id as number) + Date.now() + Math.random()}>
                          <td className="text-xs">{opcvm.label}</td>
                          <td>{opcvm.number ? opcvm.number : 0}</td>
                          <td>{opcvm.cours ? opcvm.cours.toFixed(2) : 0}</td>
                          <td><NumericFormat value={Number(opcvm?.value?.toFixed(2))} displayType={'text'} thousandSeparator={' '}  suffix={' XAF'} /></td>
                          <td>{opcvm.percent ? Number(Number((opcvm.percent as number) * 100).toFixed(2)) + ' %' : 0 + ' %'} </td>
                        </tr>
                      )
                  )}
                  </tbody>
                ))
              )}

              {sizeOfTyopOpc(type?.subType as ITypeOpc[]) === 0 && (
                <tbody>
                {opcvms?.map(
                  (opcvm) =>
                    opcvm.opcvmType?.id === type.id && (
                      <tr className={opcvm?.label?.toLowerCase().includes('total') ? 'font-bold' : ''} key={(opcvm.id as number) + Date.now() + Math.random()}>
                        <td className="text-xs">{opcvm.label}</td>
                        <td>{opcvm.number}</td>
                        <td>{opcvm.cours}</td>
                        <td>{opcvm.value}</td>
                        <td>{Number(Number((opcvm.percent as number) * 100).toFixed(2))} %</td>
                      </tr>
                    )
                )}
                </tbody>
              )}

            </table>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PartDetailOpcvm
