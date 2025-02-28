import { useEffect, useState } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { IShareholder } from '../type'

type Props = {
  suggestions: IShareholder[],
  exist: (r: boolean) => void,
  value: (l: IShareholder | null) => void,
  reset: () => void
}

function Autocomplete({ suggestions, exist, value, reset }: Props): JSX.Element {
  const [inputValue, setInputValue] = useState('')
  const [filteredSuggestions, setFilteredSuggestions] = useState<IShareholder[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const filterSuggestions = (): void => {
      if (inputValue.length > 0) {
        const filtered = suggestions.filter((suggestion) =>
          suggestion.label.toLowerCase().includes(inputValue.toLowerCase())
        )
        setFilteredSuggestions(filtered)
        setShowSuggestions(true)
      } else {
        setFilteredSuggestions([])
        setShowSuggestions(false)
      }
    }

    filterSuggestions()
  }, [inputValue, suggestions])

  const handleInputChange = (event): void => {
    setInputValue(event.target.value)
    exist(false)
    value(null)
  }

  const handleSuggestionClick = (suggestion): void => {
    setInputValue(suggestion.label)
    setShowSuggestions(false)
    exist(true)
    value(suggestion)
  }

  const onHandleRemoveInput = (): void => {
    setFilteredSuggestions([])
    setInputValue('')
    setShowSuggestions(false)
    reset()
  }

  return (
    <div className="relative w-full">
      <label className="flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="input input-bordered grow px-3 py-2 w-full"
          placeholder="Entrez votre texte"
        />
        {inputValue.length > 0 && (
          <button onClick={onHandleRemoveInput} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            <AiFillCloseCircle />
          </button>
        )}
      </label>

      {showSuggestions && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Autocomplete
