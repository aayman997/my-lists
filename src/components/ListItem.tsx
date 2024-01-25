import { Item } from "@/types/item.interface";
import { HiPlus, HiMinus } from "react-icons/hi2";
import useShoppingCart from "@/features/cart/useShoppingCart";
import { priceFormatter } from "@/helpers";
export default function ListItem({ item }: Readonly<{ item: Item }>) {
	const { items, setItems } = useShoppingCart();

	const handleRemoveItem = (itemId: string) => {
		setItems((items) => items.filter((item) => item.id !== itemId));
	};

	return (
		<li className="border-b border-b-green-400 pb-4 last:border-none last:pb-0">
			<div className="mb-2 flex items-center justify-between">
				<p>{item.name}</p>
				<p className="rounded-md bg-green-400 px-2 py-1 text-sm font-medium text-white">{priceFormatter(item.price)}</p>
			</div>
			<p className="line-clamp-3 text-gray-600">{item.description}</p>
			{items.find((itm) => itm.id === item.id) ? (
				<button className="primary-button small border-brand ml-auto" onClick={() => handleRemoveItem(item.id)}>
					<HiMinus />
					remove form cart
				</button>
			) : (
				<button className="primary-button small border-brand ml-auto" onClick={() => setItems((items) => [...items, item])}>
					<HiPlus />
					Add to cart
				</button>
			)}
		</li>
	);
}
