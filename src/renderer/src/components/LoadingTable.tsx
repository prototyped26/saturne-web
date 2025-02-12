
function LoadingTable(): JSX.Element {
  return (
    <div className="grid w-full items-center py-2">
      <button className="btn glass ">
        <span className="loading loading-spinner"></span>
        Chargement
      </button>
    </div>
  )
}

export default LoadingTable
