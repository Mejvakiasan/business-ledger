import { useState } from "react";

const inputStyle =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-800";

function AddProductForm({ product, categories, onSave, onClose }) {
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [quantity, setQuantity] = useState(product ? String(product.quantity) : "");
  const [image, setImage] = useState(product?.image ?? "");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return setError("Name is required");
    if (!(Number(price) > 0)) return setError("Enter a price greater than 0");
    if (!category.trim()) return setError("Category is required");

    const existing = categories.find(
      (c) => c.toLowerCase() === category.trim().toLowerCase(),
    );

    setSaving(true);
    await onSave({
      name: name.trim(),
      price,
      category: existing || category.trim(),
      quantity,
      image: image.trim(),
    });
    setSaving(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/50"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl bg-white p-4 pb-8 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-bold text-orange-600">{product ? 'Edit product' : 'New Product'}</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm">Name</label>
            <input
              className={inputStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Example: Good Day"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Price (₹)</label>
            <input
              className={inputStyle}
              type="number"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="10"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Category</label>
            <input
              className={inputStyle}
              list="category-list"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Pick one or type a new one"
            />
            <datalist id="category-list">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="mb-1 block text-sm">
              Stock quantity (optional)
            </label>
            <input
              className={inputStyle}
              type="number"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Image link (optional)</label>
            <input
              className={inputStyle}
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 py-3 font-bold dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-orange-600 py-3 font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductForm;
