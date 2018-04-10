const myHeaders = new Headers();
const options = {
    method: 'GET',
    headers: myHeaders,
    cache: 'default'
};

class RequestUrl {

    constructor() {
        this.queriesList = [];
        this.hasPromise = false;
    }

    get(url, onResolve, onReject) {
        // Сохраняем полученные аргументы
        this.queriesList.push(arguments);

        // Если первого промиса не было, создаём
        if (!this.hasPromise) {
            this.hasPromise = true;
            this.createPromise();
        }

        return this;
    }

    createPromise(prevResponse = null) {
        if (this.queriesList.length > 0) {
            // Берём первый пункт из списка запросов и создаём промис
            const nextQueryParams = this.queriesList.splice(0,1)[0];
            this.handleRequest(prevResponse, ...nextQueryParams);
        }
    }

    handleRequest(prevResponse, url, onResolve, onReject) {
        var myRequest = new Request(url, options);

        fetch(myRequest)
            .then(response => {
                onResolve(response, prevResponse);
                this.createPromise(response);
            })
            .catch((error) => {
                onReject(error, url, prevResponse);
                this.createPromise();
            });
    }
}

export {RequestUrl};
