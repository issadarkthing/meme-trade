import { ITraderDocument } from "./types";



export function hasItem(this: ITraderDocument, url: string) {
	return this.items.some(x => x === url)
}

export function countItem(this: ITraderDocument, url: string) {
	return this.items.reduce((acc, val) => val === url ? acc + 1 : acc, 0)
}

export function removeItem(this: ITraderDocument, url: string, count = 1) {
	for (let i = 0; i < count; i++) {
		this.items = remove(url, this.items)
	}
}

export function addItem(this: ITraderDocument, url: string, count = 1) {
	for (let i = 0; i < count; i++) {
		this.items.push(url)
	}
}

function remove<T>(item: T, arr: T[]): T[] {
	const index = arr.indexOf(item)
	if (index !== -1) {
		const temp = arr.slice()
		temp.splice(index, 1)
		return temp
	}
	return arr
}
