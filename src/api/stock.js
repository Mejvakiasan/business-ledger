import { mockProducts } from '../data/mockProducts';

const wait = (ms) => new Promise ((resolve) => setTimeout(resolve, ms));

export async function getProducts() {
    await wait(400)
    return [...mockProducts];
}