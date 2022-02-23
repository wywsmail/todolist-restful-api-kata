const http = require("http");
const { v4: uuidv4 } = require("uuid");
const todos = [];
const errorhandle = require("./errorHandle");

const requestListener = (req, res) => {
	const headers = {
		"Access-Control-Allow-Headers":
			"Content-Type,Authorization,Content-Length,X-Requested-With",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods":
			"PATCH,POST,GET,OPTIONS,DELETE",
		"Content-Type": "application/json"
	};
	let body = "";
	req.on("data", (chunk) => {
		body += chunk;
	});
	if (
		req.url === "/todos" &&
		req.method === "GET"
	) {
		res.writeHead(200, headers);
		res.write(
			JSON.stringify({
				status: "success",
				data: todos
			})
		);
		res.end();
	} else if (
		req.url === "/todos" &&
		req.method === "POST"
	) {
		try {
			req.on("end", () => {
				const title =
					JSON.parse(body).title;
				const id = uuidv4();
				const todo = {
					title: title,
					id: id
				};
				if (title !== undefined) {
					todos.push(todo);
					res.writeHead(200, headers);
					res.write(
						JSON.stringify({
							status: "success",
							data: todos
						})
					);
					res.end();
				} else {
					errorhandle(res);
				}
			});
		} catch {
			errorhandle(res);
		}
	} else if (
		req.url === "/todos" &&
		req.method === "DELETE"
	) {
		todos.length = 0;
		res.writeHead(200, headers);
		res.write(
			JSON.stringify({
				status: "success",
				data: todos
			})
		);
		res.end();
	} else if (
		req.url.startsWith("/todos/") &&
		req.method === "DELETE"
	) {
		const id = req.url.split("/").pop();
		const index = todos.findIndex(
			(ele) => ele.id === id
		);
		if (index !== -1) {
			todos.splice(index, 1);
			res.writeHead(200, headers);
			res.write(
				JSON.stringify({
					status: "success",
					data: todos
				})
			);
			res.end();
		} else {
			errorhandle(res);
		}
	} else if (
		req.url.startsWith("/todos/") &&
		req.method === "PATCH"
	) {
		req.on("end", () => {
			const id = req.url
				.split("/")
				.pop();
			const index = todos.findIndex(
				(ele) => ele.id === id
			);
			const title =
				JSON.parse(body).title;
			if (
				index !== -1 &&
				title !== undefined
			) {
				todos[index] = title;
				res.writeHead(200, headers);
				res.write(
					JSON.stringify({
						status: "success",
						data: todos
					})
				);
				res.end();
			} else {
				errorhandle(res);
			}
		});
	} else if (
		req.url === "/todos" &&
		req.method === "OPTIONS"
	) {
		res.writeHead(200, headers);
		res.end();
	} else {
		errorhandle(res);
	}
};

const server = http.createServer(
	requestListener
);

server.listen(process.env.PORT || 3005);
