"use client";
import { useState, useEffect, useRef, ChangeEventHandler } from "react";
import ListItem from "@/components/ListItem";
import { Item } from "@/types/item.interface";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const sortOptions = [
	{
		label: "default",
		value: "default",
	},
	{
		label: "Price asc ⬆️",
		value: "price_asc",
	},
	{
		label: "Price dec ⬇️",
		value: "price_dec",
	},
	{
		label: "Name asc ⬆️",
		value: "name_asc",
	},
	{
		label: "Name dec ⬇️",
		value: "name_dec",
	},
];

type PriceFilter = {
	min: number;
	max: number;
};

const fetchItems = async (query?: string) => {
	try {
		const itemsRes = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/items-list${query ? "?" + query : ""}`);
		return itemsRes.json();
	} catch (e) {
		throw new Error("An error happened");
	}
};

export default function List() {
	const [isLoading, setIsLoading] = useState(true);
	const [isSearched, setIsSearched] = useState(false); // was true, changed to false
	const searchRef = useRef<HTMLInputElement>(null);
	const minPriceRef = useRef<HTMLInputElement>(null);
	const maxPriceRef = useRef<HTMLInputElement>(null);
	const [items, setItems] = useState<Item[]>([]);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get("q");
	const sortQuery = searchParams.get("sort");
	const minPrice = searchParams.get("price_min");
	const maxPrice = searchParams.get("price_max");

	const handleLoadedData = (query?: string) => {
		setIsSearched(() => !!query);
		fetchItems(query)
			.then((res) => setItems(res.data))
			.catch((err) => console.log("err", err))
			.finally(() => setIsLoading(false));
	};

	const createQueryString = (name: string, value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set(name, value);
		return params.toString();
	};

	useEffect(() => {
		setIsLoading(true);
		let query;
		if (searchQuery) {
			setIsSearched(true);
			query = createQueryString("q", searchQuery);
		}
		if (sortQuery) {
			query = createQueryString("sort", sortQuery);
		}
		if (minPrice) {
			query = createQueryString("price_min", minPrice);
		}
		if (maxPrice) {
			query = createQueryString("price_max", maxPrice);
		}
		handleLoadedData(query);
	}, []);

	const handleUpdateFilter = (filter: { [key: string]: string }) => {
		let params = new URLSearchParams(searchParams.toString());
		for (let key in filter) {
			params.set(key, filter[key]);
		}
		let query = params.toString();
		router.push(pathname + "?" + query);
		handleLoadedData(query);
	};

	const resetSearch = () => {
		if (searchRef.current) {
			handleUpdateFilter({ q: "" });
			searchRef.current.value = "";
		}
		setIsSearched(false);
	};

	const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
		handleUpdateFilter({ q: e.target.value });
	};

	const handleSort: ChangeEventHandler<HTMLSelectElement> = (e) => {
		handleUpdateFilter({ sort: e.target.value });
	};

	const handlePriceFilter = (type: keyof PriceFilter, val: string) => {
		handleUpdateFilter({ ["price_" + type]: val });
	};

	const handlePriceFilterReset = () => {
		if (minPriceRef.current && maxPriceRef.current) {
			minPriceRef.current.value = "";
			maxPriceRef.current.value = "";
			handleUpdateFilter({ price_min: "", price_max: "" });
		}
	};

	return (
		<div className="flex flex-col gap-y-10">
			<div className="flex items-center justify-end gap-x-2">
				<p>sort by:</p>
				<select className="h-10 rounded-md border border-slate-300 bg-white" defaultValue={sortOptions[0].value} onChange={handleSort}>
					{sortOptions.map((option) => (
						<option key={option.value} value={option.value} defaultValue={sortQuery ?? sortOptions[0].value}>
							{option.label}
						</option>
					))}
				</select>
			</div>
			<div className="flex flex-wrap items-start gap-y-8 sm:flex-nowrap sm:gap-x-8 sm:gap-y-0">
				<div className="flex w-full flex-col items-start gap-y-4 rounded-md bg-slate-200 px-4 py-8 shadow-md sm:w-80">
					<p className=" text-center text-xl font-bold">Filter</p>
					<div className="flex flex-col gap-y-2 pb-4">
						<p>Price</p>
						<label>
							min price
							<input
								type="number"
								className="mt-1 h-10 w-full rounded-md bg-slate-50"
								defaultValue={minPrice ?? ""}
								onChange={(e) => handlePriceFilter("min", e.target.value)}
								ref={minPriceRef}
							/>
						</label>
						<label>
							max price
							<input
								type="number"
								defaultValue={maxPrice ?? ""}
								className="mt-1 h-10 w-full rounded-md bg-slate-50"
								onChange={(e) => handlePriceFilter("max", e.target.value)}
								ref={maxPriceRef}
							/>
						</label>
					</div>
					{minPrice || maxPrice ? (
						<div className="ml-auto flex items-center justify-end gap-4">
							<button className="primary-button hover:bg-red-500" onClick={handlePriceFilterReset}>
								reset
							</button>
						</div>
					) : null}
				</div>
				<div className="mx-auto flex basis-full flex-col gap-y-5 rounded-md bg-slate-200 px-8 py-6 text-black shadow-md">
					<input
						ref={searchRef}
						className="h-[40px] w-full rounded-md bg-white px-2 pr-12 text-black placeholder:capitalize"
						type="search"
						placeholder="search for items..."
						name="search"
						onChange={handleSearch}
						defaultValue={searchQuery ?? ""}
					/>
					{isLoading && <p>Loading...</p>}
					{!isLoading && (
						<>
							<div className="flex items-center justify-between">
								<p>{`Total results: ${items.length}`}</p>
								{isSearched && (
									<button
										className="rounded-md border border-blue-600 px-2 py-1 text-blue-600 transition-all duration-300 hover:bg-blue-600 hover:text-white"
										onClick={resetSearch}
									>
										reset search
									</button>
								)}
							</div>
							{items.length > 0 ? (
								<ul className="flex flex-col gap-y-4">
									{items.map((item) => (
										<ListItem key={item.id} item={item} />
									))}
								</ul>
							) : (
								<p className="self-center rounded-md border-2 border-green-400/50 px-10 py-10 text-center">No items found</p>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
