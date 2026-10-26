import { mockProducts } from '../data/mockProducts';

const wait = (ms) => new Promise ((resolve) => setTimeout(resolve, ms));

    let products = [...mockProducts]

export async function getProducts() {
    await wait(400)
    return [...products];
}

    export async function addProduct(data) {
        await wait(300)
        const nextId = products.reduce((max, p) => Math.max(max, p.id), 0) + 1
        const product = {
            id: nextId,
            name: data.name,
            price: Number(data.price),
            category: data.category,
            quantity: Number(data.quantity) || 0,
            image: data.image || '',
        }
        products = [...products, product]
        return product
    }

        export async function updateProduct(id, data) {
        await wait(300)
        const updated = {
            id: nextId,
            name: data.name,
            price: Number(data.price),
            category: data.category,
            quantity: Number(data.quantity) || 0,
            image: data.image || '',
        }
        products = products.map((p) => (p.id === id ? updated : p))
        return updated
    }

    export async function deleteProduct(id){
        await wait(300)
        products = products.filter((p) => p.id !== id)
    }



