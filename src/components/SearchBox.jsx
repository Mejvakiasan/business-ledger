
function SearchBox({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative mt-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 pr-10 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-3 text-gray-500 dark:text-gray-400"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default SearchBox