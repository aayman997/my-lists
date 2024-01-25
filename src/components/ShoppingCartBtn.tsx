"use client";
import { HiShoppingCart } from "react-icons/hi2";
import Link from "next/link";
import useShoppingCart from "@/features/cart/useShoppingCart";
import { clsx } from "clsx";

export default function ShoppingCartBtn() {
	const { items } = useShoppingCart();

	return (
		<Link href="/cart" className="primary-button">
			<div
				className={clsx(
					"relative text-white",
					items.length &&
						`before:absolute before:-left-2 before:-top-1 before:h-2.5 before:w-2.5 before:rounded-full before:bg-red-500
						before:content-[""]`,
				)}
			>
				<HiShoppingCart size={24} />
			</div>
			<span className="hidden text-white sm:block">Shopping cart</span>
		</Link>
	);
}
