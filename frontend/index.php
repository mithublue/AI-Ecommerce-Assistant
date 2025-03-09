<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>AI E-commerce Assistant</title>
	<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-4">
<div class="mx-auto bg-white p-6 rounded-lg shadow-lg">
	<h1 class="text-2xl font-bold mb-4 text-center">AI E-commerce Assistant</h1>
	<form id="searchForm" class="flex">
		<input type="text" id="searchInput" class="border p-2 flex-grow rounded-l-md" placeholder="Search for a product..." />
		<button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-r-md">Search</button>
	</form>
	<div id="results" class="mt-6"></div>
</div>

<script src="script.js"></script>
</body>
</html>
