let admin = {
    userList: []
}

const buildUserList = () => {
    const userListContainer = document.getElementById("userList")

    const usersHtml = admin.userList.map(item => {
        return `
            <div class="task flex-justifyspacebetween bobatron incomplete" id="user-${item._id}" Bt-CM="0.5">
                <div class="flex-column" style="gap: 10px">
                    <div>
                        <b>${item.username}</b>
                        <p>${item.email}</p>
                    </div>

                    <div class="flex flex-aligncenter" style="gap: 10px">
                        <b>Status:</b>
                        <div class="flex">
                            <button userId="${item._id}" class="statusButton-${item._id} iconButton userButton ${item.status !== "user" ? "statusButtonInactive" : ""}"></button>
                            <button userId="${item._id}" class="statusButton-${item._id} iconButton adminButton ${item.status !== "admin" ? "statusButtonInactive" : ""}"></button>
                            <button userId="${item._id}" class="statusButton-${item._id} iconButton banButton ${item.status !== "ban" ? "statusButtonInactive" : ""}"></button>
                        </div>
                        <p id="userStatus-${item._id}">(${item.status})</p>
                    </div>

                    <div class="flex-column" style="gap: 10px">
                        <p><b>id: </b>${item._id}</p>
                        <p><b>createdAt: </b>${item.createdAt}</p>
                        <p><b>updatedAt: </b>${item.updatedAt}</p>
                        <p id="banReason-${item._id}"><b>banReason: </b>${item.banReason}</p>
                    </div>
                </div>
                <div class="flex-column flex-justifyspacebetween">
                    <button userId="${item._id}" username="${item.username}" class="viewTasksButton iconButton viewButton"></button>
                    <button userId="${item._id}" class="deleteUserButton iconButton binButton"></button>
                </div>
            </div>
        `
    })

    userListContainer.innerHTML = `
        <h2 style="margin: 20px 0">Users</h2>
        ${usersHtml.join("")}
    `

    document.querySelectorAll(".deleteUserButton").forEach(item => {
        const id = item.getAttribute("userId")

        item.onclick = async () => {
            if (!confirm("You sure want to delete this user?")) {
                return
            }

            uiLocker()
            navBarLoader()

            const res = await giganote.ADMINDeleteUser(id)

            if (res) {
                document.getElementById(`user-${id}`).style.display = "none"
            } else {
                alert("error")
            }

            uiLocker(false)
            navBarLoader(false)
        }
    })

    document.querySelectorAll(".viewTasksButton").forEach(item => {
        const id = item.getAttribute("userId"),
            username =  item.getAttribute("username")

        item.onclick = async () => {
            uiLocker()
            navBarLoader()

            const tasks = await giganote.ADMINGetTasks(id)
            buildUsersTasks(tasks, username, id)

            uiLocker(false)
            navBarLoader(false)
            window.scroll(0, 0);
        }
    })

    for (let status of ["user", "admin", "ban"]) {
        document.querySelectorAll(`.${status}Button`).forEach(item => {
            item.onclick = async () => {
                uiLocker()
                navBarLoader()

                const id = item.getAttribute("userId")

                let banReason = "No reason"
                if (status === "ban") {
                    banReason = prompt("Specify ban reason") || "No reason"
                }

                const res = await giganote.ADMINPatchUser(id, { status: status, banReason: banReason })

                if (res) {
                    document.querySelectorAll(`.statusButton-${id}`).forEach(i => {
                        i.classList.add("statusButtonInactive")
                    })
                    item.classList.remove("statusButtonInactive")
                } else {
                    alert("error")
                }

                document.getElementById(`userStatus-${id}`).innerText = `(${status})`
                document.getElementById(`banReason-${id}`).innerHTML = `<b>banReason: </b>${banReason}`

                uiLocker(false)
                navBarLoader(false)
            }
        })
    }

    bobatron.scanner()
}

const buildUsersTasks = (tasks, username, userId) => {
    const usersTasksContainer = document.getElementById("usersTasks")

    const tasksHtml = tasks.map((i) => {
        return `
            <div class="taskWrapper" id="${i._id}">
                <div class="task flex-justifyspacebetween bobatron ${i.completed ? "completed" : "incomplete"} flex-aligncenter" id="task-${i._id}" Bt-CM="0.5">
                    <div>
                        <b>${i.title}</b>
                        <p>${i.content}</p>  
                    </div>
                    <button class="iconButton ${i.completed ? "greenMark" : "grayMark"} completionTaskButton" taskId="${i._id}" completed="${i.completed ? "true" : "false"}"></button>  
                </div>         
                <button class="iconButton binButton deleteTaskButton" taskId="${i._id}"></button> 
            </div>
        `
    })

    usersTasksContainer.innerHTML = `
        <h2 style="margin: 20px 0">${username}'s tasks</h2>
        ${tasksHtml.length > 0 ? tasksHtml.join("") : "No tasks found."}
    `

    const deleteTaskButtons = document.getElementsByClassName("deleteTaskButton");
    for (let i of deleteTaskButtons) {
        i.onclick = async () => {
            uiLocker()
            navBarLoader()

            const entry = document.getElementById(i.getAttribute("taskId"));
            entry.setAttribute("style", "z-index: -4; transition-duration: 0.3s; opacity: 0; scale: 0.7; filter: blur(10px);");

            setTimeout(() => {
                entry.style.marginTop = `-${entry.offsetHeight + 10}px`
            }, 300)

            await giganote.deleteTask(i.getAttribute("taskId"))

            navBarLoader(false)

            setTimeout(async () => {
                uiLocker(false)
                const tasks = await giganote.ADMINGetTasks(userId)
                buildUsersTasks(tasks, username, userId)
            }, 600)
        }
    }

    const completionTaskButtons = document.getElementsByClassName("completionTaskButton");
    for (let i of completionTaskButtons) {
        i.onclick = async () => {
            uiLocker()
            navBarLoader()

            const entry = document.getElementById(`task-${i.getAttribute("taskId")}`);
            entry.transitionDuration = "0.2s"
            entry.classList.remove("completed", "incomplete")
            entry.classList.add(i.getAttribute("completed") === "false" ? "completed" : "incomplete")

            i.transitionDuration = "0.2s"
            i.style.opacity = "0"
            setTimeout(() => {
                i.classList.remove("greenMark", "grayMark")
                i.classList.add(i.getAttribute("completed") === "false" ? "greenMark" : "grayMark")
                i.style.opacity = "1"
            }, 200)

            await giganote.patchTask(i.getAttribute("taskId"), { completed: i.getAttribute("completed") === "false" })

            navBarLoader(false)

            setTimeout(async () => {
                uiLocker(false)
                const tasks = await giganote.ADMINGetTasks(userId)
                buildUsersTasks(tasks, username, userId)
            }, 600)
        }
    }

    bobatron.scanner()
}

const initialize = async () => {
    if (!giganote.storage.data.token) {
        window.location.href = window.location.origin
    } else {
        const authStatus = await giganote.getUser()

        console.log(authStatus)

        if (authStatus) {
            if (giganote.user.status !== "admin") {
                window.location.href = window.location.origin
            } else {
                admin.userList = await giganote.ADMINGetUserList()
                buildUserList()

                const userMode = document.getElementById("userMode")
                hideElement(userMode, false)

                userMode.onclick = () => {
                    window.location.href = window.location.origin
                }
            }
        } else {
            window.location.href = window.location.origin
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    bobatron.scanner()

    giganote = new Giganote()
    initialize()
})

window.addEventListener("resize", () => {
    bobatron.scanner()
})