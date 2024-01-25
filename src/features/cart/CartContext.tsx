'use client';

import { createContext, ReactNode, useMemo, SetStateAction, Dispatch, useState } from 'react';
import { Item } from '@/types/item.interface';

interface ShoppingCartContextType {
	items: Item[];
	setItems: Dispatch<SetStateAction<Item[]>>;
}

const ShoppingCartContext = createContext<ShoppingCartContextType>({} as ShoppingCartContextType);

interface ShoppingCartProviderType {
	children: ReactNode;
}

const ShoppingCartProvider = ({ children }: ShoppingCartProviderType) => {
	const [items, setItems] = useState<Item[]>([]);


	const value = useMemo(() => {
		return {
			items,
			setItems,
		};
	}, [items]);

	return (
		<ShoppingCartContext.Provider value={value}>
			{children}
		</ShoppingCartContext.Provider>
	);
};

export { ShoppingCartProvider, ShoppingCartContext };
