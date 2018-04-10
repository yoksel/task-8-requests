import './styles.css';

import Mustache from '../node_modules/mustache';
import {RequestUrl} from './RequestUrl';
const requestUrl = new RequestUrl();

const listElem = document.querySelector('.list');
const itemTmpl = document.getElementById('tmpl-item').innerHTML;

requestUrl
    .get('https://jsonplaceholder.typicode.com/photos', onResolve, onReject)
    .get('https://jsonplaceholder.typicode.com/comments', onResolve, onReject)
    .get('https://jsonplaceholder.typicode.com/users', onResolve, onReject);

let counter = 0;
async function onResolve(response) {
    const listItemElem = document.createElement('li');
    listElem.appendChild(listItemElem);

    try {
        let json = await response.json();
        const data = {
            url: response.url,
            urlName: response.url.replace('https://', ''),
            count: json.length,
            first: JSON.stringify(json[0]).replace(/",/g,'",\n')
        };

        listItemElem.innerHTML += Mustache.render(itemTmpl, data);

    } catch (error) {
        throw new Error(`Ошибка в обработке запроса\n\n${error}`);
    }
}

function onReject(error, url) {
    throw new Error(`\nЗапрос для адреса ${url} завершился с ошибкой\n\n${error}`);
}
