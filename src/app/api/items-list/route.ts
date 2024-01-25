import { NextResponse, NextRequest } from "next/server";
import ITEMS from "@/data/items.json";
import { Item } from "@/types/item.interface";

const retrieveAndFilterItemsByName = (items: Item[], searchValue: string): Item[] => {
	const searchString = searchValue.toLowerCase();
	return items.filter((item) => item.name.toLowerCase().includes(searchString));
};

const retrieveAndFilterItemsByMinPrice = (items: Item[], minValue: number): Item[] => {
	return items.filter((item) => item.price >= minValue);
};

const retrieveAndFilterItemsByMaxPrice = (items: Item[], maxValue: number): Item[] => {
	return items.filter((item) => item.price <= maxValue);
};

const retrieveAndSortItems = (items: Item[], sortValue: string): Item[] => {
	if (sortValue === "default") {
		return items;
	}

	const [field, dir] = sortValue.split("_") as [keyof Item, "asc" | "dec"];
	return items.sort((a, b) => {
		const aValue = a[field];
		const bValue = b[field];
		if (typeof aValue === "string" && typeof bValue === "string") {
			return dir === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
		} else if (typeof aValue === "number" && typeof bValue === "number") {
			return dir === "asc" ? aValue - bValue : bValue - aValue;
		} else {
			throw new Error(`Unsupported type for field ${field}`);
		}
	});
};

export const GET = (req: NextRequest) => {
	let items: Item[] = ITEMS;
	const { searchParams } = req.nextUrl;
	const searchQuery = searchParams.get("q");
	const sortQuery = searchParams.get("sort");
	const minPriceParam = searchParams.get("price_min");
	const maxPriceParam = searchParams.get("price_max");

	const priceMin = minPriceParam ? parseFloat(minPriceParam) : undefined;
	const priceMax = maxPriceParam ? parseFloat(maxPriceParam) : undefined;

	if (searchQuery) {
		items = retrieveAndFilterItemsByName(items, searchQuery);
	}
	if (sortQuery) {
		items = retrieveAndSortItems(items, sortQuery);
	}
	if (priceMin !== undefined) {
		items = retrieveAndFilterItemsByMinPrice(items, priceMin);
	}
	if (priceMax !== undefined) {
		items = retrieveAndFilterItemsByMaxPrice(items, priceMax);
	}
	return NextResponse.json({
		data: items,
		length: items.length,
		status: 200,
		error: null,
	});
};
