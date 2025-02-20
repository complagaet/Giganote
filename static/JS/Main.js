const menuEntrySwitch = (from, to) => {
    from.style.transitionDuration = "0.3s"
    from.style.opacity = "0"
    from.style.scale = "0.7"
    from.style.filter = "blur(10px)"

    to.style.opacity = "0"
    to.style.scale = "0.7"
    setTimeout(() => {
        from.style.display = "none"
        to.style.display = "flex"
        bobatron.scanner()
    }, 310)
    setTimeout(() => {
        to.style.transitionDuration = "0.3s"
        to.style.opacity = "1"
        to.style.scale = "1"
        from.style.filter = "blur(0px)"
        bobatron.scanner()
    }, 315)
}

const uiLocker = (status = true) => {
    document.querySelectorAll("button").forEach(e => {
        status ? e.style.pointerEvents = "none" : e.style.pointerEvents = ""
    })
}

const navBarLoader = (show = true, elemId = "navBarLoader") => {
    const loader = document.getElementById(elemId).classList
    show ? loader.remove("loaderHidden") : loader.add("loaderHidden")
}

const shakeElement = (elem) => {
    elem.classList.add("mistake", "shake");
    setTimeout(() => { elem.classList.remove("shake"); }, 300);
}

const hideElement = (elem, status = true) => {
    if (status) {
        elem.style.transitionDuration = "0.3s"
        elem.style.opacity = "0"
        elem.style.scale = "0.7"
        elem.style.filter = "blur(10px)"

        setTimeout(() => {
            elem.style.display = "none"
            elem.style.filter = "blur(0px)"
        }, 310)
    } else {
        elem.style.display = ""
        elem.style.opacity = "0"
        elem.style.scale = "0.7"

        setTimeout(() => {
            elem.style.transitionDuration = "0.3s"
            elem.style.opacity = "1"
            elem.style.scale = "1"

            bobatron.scanner()
        }, 10)
    }
}
//

let giganote

class Giganote {
    storage = new Storage("Giganote", { token: null })
    user
    tasks

    pages = {
        loading: document.querySelector("#loading"),
        authPage: document.querySelector("#authPage"),
        mainPage: document.querySelector("#mainPage"),
    }

    async request(route, method= "POST", json= {}, root = `${window.location.origin}/`) {
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

    async ADMINGetUserList() {
        let res = await this.request("api/admin/users", "GET")

        if (res.ok) {
            return await res.json()
        } else {
            return 0
        }
    }

    async ADMINPatchUser(id, patch) {
        let res = await this.request(`api/admin/user/${id}`, "PATCH", patch)

        if (res.ok) {
            return await res.json()
        } else {
            return 0
        }
    }

    async ADMINGetTasks(id) {
        let res = await this.request(`api/admin/user/${id}/tasks`, "GET")

        if (res.ok) {
            return await res.json()
        } else {
            return 0
        }
    }

    constructor() {}
}