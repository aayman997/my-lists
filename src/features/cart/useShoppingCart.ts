import { useContext } from 'react';
import { ShoppingCartContext } from '@/features/cart/CartContext';

const useShoppingCart = () => {
	const context = useContext(ShoppingCartContext);
	if (context === undefined) {
		throw new Error('ShoppingCartContext was used outside ShoppingCartProvider');
	}
	return context;
};

export default useShoppingCart;
