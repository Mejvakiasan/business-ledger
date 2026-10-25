function ProductCard({ product }) {
    return (
        <div className="flex items-center justify-center rounded-lg border border-gray-200 p-3 dark:border-gray-700">
            <div>
            <p className="font-bold">{product.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400"> Stock: {product.quantity}</p>
        </div>

        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">₹{product.price.toFixed(2)}</p>
        </div>
    )
}

export default ProductCard