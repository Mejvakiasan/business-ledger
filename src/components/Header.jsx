
function Header({theme, onToggle}){
    return (
        <header className="sticky top-0 flex items-center justify-between border-b
         bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
            <span className="text-lg font-bold text-orange-600">Tea Shop</span>
            <button 
            onClick={onToggle}
            className="rounded-full p-2 text-xl"
            aria-label="Toggle Theme">
                    {theme === 'dark' ? '☀️' : '🌙'}
            </button>

        </header>
    )
}

export default Header;