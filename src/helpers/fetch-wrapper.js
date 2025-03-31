export const fetchWrapper = {
    get,
    post,
    postWithReCaptcha,
    getRaw,
};

let BASE_URL = '';
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    BASE_URL = process.env.REACT_APP_BASE_URL;
}

function get(url) {
    const requestOptions = {
        method: 'GET',
        credentials: 'include',
    };

    return fetch(BASE_URL + url, requestOptions).then(handleResponse);
}

function getRaw(url) {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
    };

    return fetch(BASE_URL + url, requestOptions).then(handleResponse);
}

function postWithReCaptcha(url, body, token) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ReCaptcha-Token': token },
        body: JSON.stringify(body),
        credentials: 'include',
    };

    return fetch(BASE_URL + url, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then((text) => {
        let data = text;

        try {
            data = JSON.parse(text);
        } catch (error) {
            data = text;
        }

        if (!response.ok) {
            if ([401, 403].includes(response.status)) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            }

            // const error = (data && data.message) || response.statusText;
            const error = data || response.statusText;

            return Promise.reject({ status: response.status, error });
        }

        return data;
    });
}
