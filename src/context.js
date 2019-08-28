import React, { Component } from 'react';
import { storeProducts, detailProduct } from './data';

const ProductContext = React.createContext();

class ProductProvider extends Component {
	state = {
		products: [],
		detailProduct: detailProduct,
		cart: [],
		modalOpen: false,
		modalProduct: detailProduct,
		cartSubTotal: 0,
		cartTax: 0,
		cartTotal: 0
	}

	componentDidMount() {
		//chama os produtos
		this.storeProducts();
	}

	storeProducts = () => {
		let tempProducts = [];
		//array vazio
		//console.log(tempProducts)
		storeProducts.forEach(item => {
			const singleItem = {...item};
			tempProducts = [...tempProducts, singleItem];
		//todos os produtos indivualmente
		//console.log(singleItem)
		//foreach adiciona um-a-um os produtos
		//console.log(tempProducts)
		})
		this.setState(() => {
			return { products: tempProducts }
			//adiciona todos os items ao products
		})
		//console.log(tempProducts)

	}

	getItem = (id) => {
		//cria const = esse estado produto, encontrar params item item.id identico ao id
		const product = this.state.products.find(item => item.id === id);
		return product;
	}
	handleDetail = (id) => {
		const product = this.getItem(id);
		this.setState(() => {
			return { detailProduct : product }
		})
	}

	addToCart = id => {
		//retorna uma copia do products
		let tempProducts = [...this.state.products];
		const index = tempProducts.indexOf(this.getItem(id));
		const product = tempProducts[index];
		product.inCart = true;
		product.count = 1;
		const price = product.price;
		product.total = price;

		//console.log(tempProducts)
		//console.log(index)
		//console.log(product)
		//console.log(price)

		this.setState(() => {
			return { products: tempProducts, cart: [...this.state.cart, product] };
		}, () => { 
			//console.log(this.state.products); produtos
			//console.log(this.state.cart); adiciona o item ao cart
			console.log(this.state);
			this.addTotals()
		});
	}

	tester = () => {
		console.log('state products :', this.state.products[0].inCart)
		console.log('data products :', storeProducts[0].inCart)
		//operador spreit
		const tempProducts = [...this.state.products];

		tempProducts[0].inCart = true;

		this.setState(() => { return { products: tempProducts }; },
			() => {
			console.log('state products :', this.state.products[0].inCart)
			console.log('data products :', storeProducts[0].inCart)
		})
	}

	openModal = id => {
		const product = this.getItem(id);
		this.setState(() => {
			return { modalProduct: product, modalOpen: true}
		})
	}

	closeModal = () => {
		this.setState(() => {
			return {modalOpen: false}
		})
	}

	increment = id => {
		let tempCart = [...this.state.cart];
		const selectedProduct = tempCart.find(item => item.id === id);
		const index = tempCart.indexOf(selectedProduct);
		const product = tempCart[index];

		product.count = product.count + 1;
		product.total = product.count * product.price;

		this.setState(() => { 
			return { cart: [...tempCart]}
		}, 
			() => { 
				this.addTotals();
			}
		)
	}

	decrement = id => {
		//retorna todo o array do cart
		let tempCart = [...this.state.cart];
		//retorna o id do produto
		const selectedProduct = tempCart.find(item => item.id === id);
		//retorna o numero
		const index = tempCart.indexOf(selectedProduct);
		//retorna id removido
		const product = tempCart[index];
		product.count = product.count -1;

		if(product.count === 0) {
			this.removeItem(id)
		} else {
			product.total = product.count * product.price;
			this.setState(() => {
				return { cart: [...tempCart]};
			},() => {
				this.addTotals();
			})
		}
	}

	removeItem = id => {
		let tempProducts = [...this.state.products];
		let tempCart = [...this.state.cart];
		tempCart = tempCart.filter(item => item.id !== id);
		const index = tempProducts.indexOf(this.getItem(id));
		let removedProduct = tempProducts[index];
		removedProduct.inCart = false;
		removedProduct.count = 0;
		removedProduct.total = 0;

		this.setState(() => {
			return {
				cart: [...tempCart],
				products: [...tempProducts]
			}
		}, () => {
			this.addTotals();
		})
	}

	clearCart = () => {
		this.setState(() => {
			return { cart: [] };
		}, () => {
			this.storeProducts();
			this.addTotals();
		})
	}

	addTotals = () => {
		let subTotal = 0;
		this.state.cart.map((item => (subTotal += item.total)));
		const tempTax = subTotal * 0.1;
		const tax = parseFloat(tempTax.toFixed(2));
		const total = subTotal + tax;
		this.setState(() => {
			return {
				cartSubTotal: subTotal,
				cartTax: tax,
				cartTotal: total
			}
		})
	}
	render() {
		return (
			<ProductContext.Provider value={{
				...this.state,
				handleDetail: this.handleDetail,
				addToCart: this.addToCart,
				openModal: this.openModal,
				closeModal: this.closeModal,
				increment: this.increment,
				decrement: this.decrement,
				removeItem: this.removeItem,
				clearCart: this.clearCart
			}}>
			{/*<button onClick={this.tester}>verificar estado</button>*/}
			{/*todos os elementos filhos, navbar, produto, lista etc*/}
			{this.props.children}
			
			</ProductContext.Provider>
		)
	}
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };