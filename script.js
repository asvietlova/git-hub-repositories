let searchField = document.getElementById('search');
let userReposList = document.getElementById('userRepos')
let error = document.getElementById('error');
let userFolloversList = document.getElementById('userFollovers');
let root = document.getElementById('root');

let gitHubUser = 'https://api.github.com/users/';

// Function to show error DIV.
function showError(errMsg) {
    error.style.visibility = "visible";
    error.innerText = errMsg;
};

const debounce = (fn, ms) => {
    let timeout;
    return function () {
        const fnCall = () => { fn.apply(this, arguments) }
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, ms);
    }
}

const onChange = debounce(search, 500);
searchField.addEventListener('keyup', onChange);

// Callback for serach btn + debounce callback.
function search() {
    let input = searchField.value;
    if (input !== null) {
        error.style.visibility = "hidden";
        root.style.visibility = "hidden";
        getUser(input);
    }
};

function fillGithubUser(userInfoJSON) {
    root.style.visibility = "visible";

    let container = document.getElementById('userName');
    container.innerText = userInfoJSON.name;
    container.href = userInfoJSON.html_url;
    getUserRepos(userInfoJSON.repos_url);
    getUserFollovers(userInfoJSON.followers_url);
}

function getUser(input) {
    let gitHubUserName = gitHubUser + input;
    fetch(gitHubUserName)
        .then((response) => {
            if (response.status !== 200) {
                throw new Error(`User '${input}' not found, status code = ${response.status}`);
            }
            return response.json()
        })
        .then((json) => {
            fillGithubUser(json);
        })
        .catch(err => {
            showError(err);
        });
};

function getUserRepos(url) {
    fetch(url)
        .then(e => e.json())
        .then(res => {
            userReposList.innerText = 'Repositories:';
            res.forEach(element => {
                let repoItem = document.createElement('li');
                repoItem.style.fontWeight = 'normal';
                userReposList.append(repoItem);
                let repoUrl = `
                <a href="${element.html_url}" target="_blank">${element.name}</a>
                `
                repoItem.insertAdjacentHTML('beforeend', repoUrl);
            });
        })
        .catch(err => {
            console.log(err);
            showError();
        });
};

function getUserFollovers(url) {
    fetch(url)
        .then(e => e.json())
        .then(res => {
            userFolloversList.innerText = 'Follovers:'
            res.forEach(element => {
                let follItem = document.createElement('li');
                follItem.style.fontWeight = 'normal';
                userFolloversList.append(follItem);
                let follover = `
                <a href="${element.html_url}" target="_blank">${element.login}</a>
                `
                follItem.insertAdjacentHTML('beforeend', follover)
            });
        })
        .catch(err => {
            console.log(err);
            showError();
        });
};