const priceFormatter = (price: number): string => {
	const formatter = new Intl.NumberFormat("en-EG", {
		style: "currency",
		currency: "EGP",
	});
	return formatter.format(price);
};

export { priceFormatter };
