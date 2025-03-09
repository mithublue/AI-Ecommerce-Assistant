document.getElementById("searchForm").addEventListener("submit", async function (event) {
	event.preventDefault(); // Prevent page reload

	const query = document.getElementById("searchInput").value;
	if (!query) return alert("Please enter a product name!");

	document.getElementById("results").innerHTML = "<p>Loading...</p>";

	try {
		const response = await fetch(`http://127.0.0.1:8000/search?query=${encodeURIComponent(query)}`);
		const data = await response.json();
		console.log(data);
		if (data.products.length === 0) {
			document.getElementById("results").innerHTML = "<p>No products found.</p>";
			return;
		}

		let html = "<h2>Search Results:</h2><div class='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>";
		console.log(data);
		data.products.forEach(product => {
			html += `
                <div class="border rounded-lg p-4 shadow-md">
                    <img src="${product.image}" class="w-full h-48 object-cover rounded-lg mb-2" />
                    <h3 class="font-bold">${product.name}</h3>
                    <p class="text-sm text-gray-700">Price: ${product.price}</p>
                    <p class="text-sm text-yellow-500">Rating: ${product.rating}</p>
                    <a href="${product.link}" class="text-blue-500 underline" target="_blank">View Product</a>
                </div>
            `;
		});
		html += "</div>";

		document.getElementById("results").innerHTML = html;
	} catch (error) {
		console.error("Error fetching results:", error);
		document.getElementById("results").innerHTML = "<p>Error loading products.</p>";
	}
});
