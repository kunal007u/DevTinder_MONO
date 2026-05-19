import axios from "axios";

/**
 Q) What's the purpose of axios.interceptors.request.use?
 Ans: the axios.interceptors.request.use method is used to intercept and modify requests before they are sent. It allows you to add custom logic, such as adding headers, logging, or modifying the request data. You can use it to set default headers for all requests or to perform actions like authentication.
*/

axios.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('token');

    config.headers = {
        ...config.headers,
        'x-access-token': token,
    };
})
