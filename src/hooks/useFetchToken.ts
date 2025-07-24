import { useEffect } from "react";

// Fetches the token from the API
export default function useFetchToken() {
	useEffect(() => {
		const fetchToken = async () => {
			try {
				const response = await fetch("/api/token", { method: "POST" });
				const bearerToken = await response.text();
				console.log("Response from API: ", bearerToken);
			} catch (error) {
				console.error("Error fetching token ", error);
			}
		};

		fetchToken();
	}, []);
}
