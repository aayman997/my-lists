"use client";

import ListItem from "@/components/ListItem";
import useShoppingCart from "@/features/cart/useShoppingCart";
import { priceFormatter } from "@/helpers";
import Link from "next/link";

export default function Cart() {
	const { items } = useShoppingCart();
	const itemsTotal = items.reduce((a, b) => a + b.price, 0);
	const vat = itemsTotal * 0.14;
	const totals = itemsTotal + vat;
	return (
		<div className="container mx-auto">
			<div className="flex flex-wrap items-start gap-y-10 sm:flex-nowrap sm:gap-x-10 sm:gap-y-0">
				{items.length > 0 ? (
					<>
						<div className="order-2 flex items-start gap-x-8 sm:order-1">
							<div className="mx-auto flex basis-full flex-col gap-y-5 rounded-md bg-slate-200 px-8 py-6 text-black shadow-md">
								<ul className="flex flex-col gap-y-4">
									{items.map((item) => (
										<ListItem key={item.id} item={item} />
									))}
								</ul>
							</div>
						</div>
						<div className="order-1 basis-full rounded-md border-2 border-green-400 bg-green-400 py-4 text-white shadow-2xl sm:order-2 sm:basis-1/3">
							<p className="border-b-2 border-b-white px-4 pb-4 text-center font-bold uppercase">Cart details</p>
							<div className="flex items-center justify-between border-b-2 border-b-white px-4 py-4">
								<p className="font-medium">Items price</p>
								<p className="font-bold">{priceFormatter(itemsTotal)}</p>
							</div>
							<div className="flex items-center justify-between border-b-2 border-b-white px-4 py-4">
								<p className="font-medium">Shipping price</p>
								<p className="text-sm font-medium">Continue to calculate</p>
							</div>
							<div className="flex items-center justify-between border-b-2 border-b-white px-4 py-4">
								<p className="font-medium">VAT (14%)</p>
								<p className="font-bold">{priceFormatter(vat)}</p>
							</div>
							<div className="mx-[1px] -mb-[14px] flex items-center justify-between rounded-b-md bg-white px-4 py-4 text-black">
								<p className="font-medium">Totals</p>
								<p className="font-bold">{priceFormatter(totals)}</p>
							</div>
						</div>
					</>
				) : (
					<div className="mx-auto max-w-96 self-center rounded-md border-2 border-green-400/50 px-10 py-10 text-center">
						<span className="mb-4 inline-block text-2xl">😔😔</span>
						<p className="mb-4">Seems like you haven't added any item to card, go back to add some items now ❤️</p>
						<Link href="/" className="primary-button border-brand py-2">
							👈 Go back
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
