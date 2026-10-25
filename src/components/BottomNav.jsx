import { NavLink } from "react-router-dom"

const tabs = [
    {to: "/stock", label: "Stock"},
    {to: "/calculator", label: "Calculator"},
    {to: "/grocery", label: "Grocery"},
    {to: "/account", label: "Account"},
    {to: "/setting", label: "Setting"},
]

function BottomNav(){
    return(
        <nav className="fixed bottom-0 inset-x-0 flex border-t bg-white pb-[env(safe-area-inset-bottom)] dark:border-gray-700 dark:bg-gray-900">
            {tabs.map((tab) =>(
                <NavLink
                    key={tab.to}
                    to={tab.to}
                    className={({isActive}) => `flex-1 py-3 text-center text-sm ${
                        isActive ? 
                        'font-bold text-orange-600 dark:text-orange-400'
                        :'text-grey-500 dark:text-gray-300'
                    }`
                    }
                >
                    {tab.label}
                </NavLink>
            ))}

        </nav>
    )
}
export default BottomNav;