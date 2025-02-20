
let isRefreshing = false;
let pendingRequests = [];

const refreshSubscriber = (cb) => pendingRequests.push(cb);
const refreshSubscriberCallback = () => {
    pendingRequests.forEach(cb => cb());
    pendingRequests = [];
}


const apiClient = async (url, options = {}) => {
    if (!options.headers) {
        options.headers = {};
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
        options.headers.authorization = `Bearer ${token}`
    }else{
        console.log("token nai hai mc")
    }

    options.credentials = "include";

    console.log("apiclient ke andar ka ",url,options)
    try {
        const res = await fetch(url, options);
        if (res.ok) return res;
        console.log("first fetch res ",res)
        let newTokenPromise;
        if (res.status === 401) {
            if (!isRefreshing) {
                isRefreshing = true;
                newTokenPromise = (async () => {
                    try {
                        console.log(options)
                        const response = await fetch("http://localhost:4000/new-access", 
                            {
                                method: "POST",
                                credentials:"include",
                            }
                        );
                        console.log("new token response; ",response)
                        if (!response.ok) throw new error("cannot refresh token");

                        const newToken = await response.json();
                        console.log("new token: ",newToken)
                        localStorage.setItem("accessToken", newToken);
                        refreshSubscriberCallback();
                        return newToken;

                    } catch (error) {
                        console.log("server error");
                        pendingRequests = [];
                        localStorage.removeItem("accessToken");
                        throw error;

                    } finally {
                        isRefreshing = false;
                    }
                })();
            }
            try {
                if (newTokenPromise) {
                    await newTokenPromise;
                } else {
                    await new Promise(resolve => refreshSubscriber(() => resolve()));
                }

                const newOptions = { ...options };
                newOptions.headers.authorization = `Bearer ${localStorage.getItem("accessToken")}`
                return fetch(url, newOptions);
            } catch (error) {
                throw error;
            }
        }
        throw new error(`req failed with status : ${res.status}`)
    } catch (error) {
        window.location.href = "/login";
        throw error;
    }
}
const api = {
    async get(url, options = {}) {
        const res = await apiClient(url, { ...options, method: "GET" });
        return await res.json();
    },
    async post(url, data, options = {}) {
        console.log(url,data,options)
        const res = await apiClient(url, {
            ...options,
            method: "POST",
            headers: { ...options.headers, "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return await res.json();
    },
    async put(url, data, options = {}) {
        const res = await apiClient(url, {
            ...options,
            method: "PUT",
            headers: { ...options.headers, "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return await res.json();
    }
}

export default api;