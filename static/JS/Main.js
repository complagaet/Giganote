let giganote

document.addEventListener("DOMContentLoaded", async () => {
    bobatron.scanner()

    giganote = new Giganote()
    initialize()
})

window.addEventListener("resize", () => {
    bobatron.scanner()
})

class Giganote {
    storage = new Storage("Giganote", { token: null })
    user
    tasks

    pages = {
        loading: document.querySelector("#loading"),
        authPage: document.querySelector("#authPage"),
        mainPage: document.querySelector("#mainPage"),
    }

    async request(route, method= "POST", json= {}, root = window.location.href) {
        let request = {
            method: method,
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": this.storage.data.token
            }
        }

        if (method !== "GET") {
            request.body = JSON.stringify(json)
        }

        return await fetch(`${root}${route}`, request)
    }

    async getUser() {
        let res = await this.request("api/user", "GET")

        if (res.ok) {
            this.user = await res.json()
            console.log(this.user)
            return 1
        } else {
            return 0
        }
    }

    async getTasks() {
        let res = await this.request("api/tasks", "GET")

        if (res.ok) {
            this.tasks = await res.json()
            console.log(this.tasks)
            return 1
        } else {
            return 0
        }
    }

    async patchTask(id, patch) {
        let res = await this.request(`api/task/${id}`, "PATCH", patch)

        if (res.ok) {
            console.log(await res.json())
            return 1
        } else {
            return 0
        }
    }

    async addTask(data) {
        let res = await this.request(`api/task`, "POST", data)

        if (res.ok) {
            console.log(await res.json())
            return 1
        } else {
            return 0
        }
    }

    async deleteTask(id)  {
        let res = await this.request(`api/task/${id}`, "DELETE")

        if (res.ok) {
            console.log(await res.json())
            return 1
        } else {
            return 0
        }
    }

    async login(email, password)  {
        let res = await this.request(`api/login`, "POST", { email: email, password: password })

        const json = await res.json()
        console.log(json)

        if (res.ok) {
            this.storage.data.token = json.token
            this.storage.save()
        }

        return json
    }

    async register(username, email, password)  {
        let res = await this.request(`api/register`, "POST", { username: username, email: email, password: password })

        let json = await res.json()
        console.log(json)

        if (res.ok) {
            const loginRes = await this.login(email, password)
            if (loginRes.ok) {
                json = await loginRes.json()
            }
        }

        return json
    }

    constructor() {}
}