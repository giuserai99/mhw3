function onSearchJson(json) {
	console.log('Json ricevuto');
	const sneakers = document.querySelector('#result-view');
	sneakers.innerHTML = '';
	const ricerca = json.data;
	let num_ricerca = ricerca.length;
	if (num_ricerca > 10) {
		num_ricerca = 10;
	}

	for (let i = 0; i < num_ricerca; i++) {
		const product_data = ricerca[i];
		const prodotto = product_data.product_title;
		const immagine = product_data.product_photos[0];
		const offer = product_data.offer.store_name;
		const price = product_data.offer.price;
		const sneaker = document.createElement('div');
		sneaker.classList.add('sneaker');
		const img = document.createElement('img');
		img.src = immagine;
		const nomeProdotto = document.createElement('span');
		nomeProdotto.textContent = prodotto;
		const venditore = document.createElement('span');
		venditore.textContent = offer;
		const prezzo = document.createElement('span');
		prezzo.textContent = price;
		sneaker.appendChild(img);
		sneaker.appendChild(nomeProdotto);
		sneaker.appendChild(venditore);
		sneaker.appendChild(prezzo);
		sneakers.appendChild(sneaker);
	}
}

	function onTokenJson(json) {
		token = json.access_token;
	}

	function onTokenReponse(response) {
		return response.json();
	}

	function onResponse(response) {
		return response.json();
	}


	function apiRicerca(event) {
		event.preventDefault();

		const input = document.querySelector('#sneaker');
		const value = encodeURIComponent(input.value);
		console.log('Ricerca snkrs: ' + value);

		fetch('https://real-time-product-search.p.rapidapi.com/search?q=' + value,
			{
				method: 'GET',
				headers: {
					'content-type': 'application/octet-stream',
					'X-RapidAPI-Key': '774ca5fbbemshf4065a5afa81dfap13f8efjsn1dc96c283940',
					'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com'
				}
			}).then(onResponse).then(onSearchJson);
	}


	function generatePayment(event) {
		event.preventDefault();

		const input = document.querySelector('#inputPrice');
		const value = encodeURIComponent(input.value);
		console.log('Inserimento prezzo: ' + value);

		if (value == '') {
			window.alert('Inserire un importo');
			return;
		}

		const transaction = {
			'intent': 'sale',
			'payer': {
				'payment_method': 'paypal'
			},
			'redirect_urls': {
				'return_url': "http://example.com/return",
				'cancel_url': 'http://example.com/cancel'
			},
			'transactions': [{
				'amount': {
					'currency': 'EUR',
					'total': value
				},
				'description': 'Descrizione della transazione'
			}]
		};
		fetch('https://api.sandbox.paypal.com/v1/payments/payment',
			{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token
			},
			body: JSON.stringify(transaction)
		})
			.then(function (response) {
				if (response.ok) {
					return response.json().then(function (responseJson) {
						var approvalUrl = responseJson.links.find(function (link) {
							return link.rel === 'approval_url';
						}).href;

						window.location.href = approvalUrl;
					});
				} else {
					console.error('Errore durante la richiesta di pagamento: ' + response.status);
				}
			})
			.catch(function (error) {
				console.error('Errore durante la richiesta di pagamento: ' + error);
			});
	} 

	const client_id = 'AcMVMbSNFChJH0-MRDnMKJTOHXg9F3uJAGbBE6OWnmtBWPV0jxXOsRaVkU1Rn8dmot93F9AQqrM5sELN';
	const client_secret = 'EKziERWRn0a-huX7FMbZHZYgImBFxrPWVdoFlKsD0sC0CzFXeucODlcEWd0owYs6IJvf5C_G9uebP3u5';
	let token;
	fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token',
		{
			method: "POST",
			body: 'grant_type=client_credentials',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
			}
		}).then(onTokenReponse).then(onTokenJson);

	const form = document.querySelector('#ricerca');
	form.addEventListener('submit', apiRicerca);
	const form2 = document.querySelector('#paypal');
	form2.addEventListener('submit', generatePayment);
