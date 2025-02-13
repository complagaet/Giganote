const menuEntrySwitch = (from, to) => {
    from.style.transitionDuration = "0.3s"
    from.style.opacity = "0"
    from.style.scale = "0.7"
    from.style.filter = "blur(10px)"

    to.style.opacity = "0"
    to.style.scale = "0.7"
    from.style.filter = "blur(10px)"
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

const shakeElement = (elem) => {
    elem.classList.add("mistake", "shake");
    setTimeout(() => { elem.classList.remove("shake"); }, 300);
}

//

const buildAuthPage = () => {
    giganote.pages.authPage.innerHTML = `
        <h2>Welcome to Giganote!</h2>
        <button class="bobatron" Bt-CM="0.5" id="registerButton">Register</button>
        <button class="bobatron" Bt-CM="0.5" id="loginButton">Login</button>
    `

    const registerButton = document.getElementById("registerButton")
    const registerWindow = new smoothModal("registerWindow", registerButton)

    registerWindow.modalWindowCSS = `background-color: #ffffff; border-radius: 25px; width: 350px; height: 421px; padding: 15px;`;
    registerWindow.collapsedElementCloneCSS = `background-color: #e4e4e4; display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 15px; top: 0; left: 0; transition-duration: 0.4s`;
    registerWindow.collapsedElementCloneCSSSegueAddition = `border-radius: 20px`;
    registerWindow.expandingTime = 0.4;
    registerWindow.collapsingTime = 0.4;
    registerWindow.collapsedElementCloneHidingTimeout = -0.1;
    registerWindow.BtCM = 1.2;

    registerButton.onclick = () => {
        registerWindow.modalWindowContent = `
            <div class="vertical-container" style="height: 100%">
                <div class="flex-justifyspacebetween flex-aligncenter" style="gap: 10px; width: 100%">
                    <h3>Register</h3>
                    <svg class="iconButton noButton deleteTaskButton" id="closeRegisterWindow" style="transition-duration: 0.3s; cursor: pointer"></svg> 
                </div>
                <div class="vertical-container flex-justifycenter" style="gap: 10px; height: 100%">
                    <label for="registerUsername" style="font-weight: bold">Username</label>
                    <input style="border-radius: 10px" type="text" id="registerUsername" class="bobatron" Bt-CM="0.5" placeholder="Username..." required>
                    
                    <label for="email" style="font-weight: bold">Email</label>
                    <input style="border-radius: 10px" type="email" id="registerEmail" class="bobatron" Bt-CM="0.5" placeholder="Email..." required>
                    
                    <label for="password" style="font-weight: bold">Password</label>
                    <input style="border-radius: 10px" type="password" id="registerPassword" class="bobatron" Bt-CM="0.5" placeholder="Password..." required>
            
                    <button style="border-radius: 10px" class="bobatron" Bt-CM="0.5" id="registerSubmit">Register</button>
                    
                    <p style="color: red" id="registerError">&nbsp;</p>
                </div>
            </div>
        `

        registerWindow.expand()

        setTimeout(() => {
            document.getElementById("closeRegisterWindow").onclick = () => {
                registerWindow.collapse();
            };

            const username = document.getElementById("registerUsername"),
                email = document.getElementById("registerEmail"),
                password = document.getElementById("registerPassword"),
                errorContainer = document.getElementById("registerError");

            document.getElementById("registerSubmit").onclick = async () => {
                const usernameValue = username.value.trim();
                const emailValue = email.value.trim();
                const passwordValue = password.value.trim();

                if (!usernameValue || !emailValue || !passwordValue) {
                    errorContainer.innerHTML = "Username, email, and password cannot be empty";
                    return;
                }

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
                    errorContainer.innerHTML = "Please enter a valid email address";
                    return;
                }

                const result = await giganote.register(usernameValue, emailValue, passwordValue);

                if (result.error) {
                    errorContainer.innerHTML = result.error;
                } else {
                    registerWindow.collapse();

                    setTimeout(() => {
                        menuEntrySwitch(giganote.pages.authPage, giganote.pages.loading);
                    }, 800);

                    setTimeout(() => {
                        initialize();
                    }, 1200);
                }
            };
        }, 600);

    }

    // LOGIN

    const loginButton = document.getElementById("loginButton")
    const loginWindow = new smoothModal("loginWindow", loginButton)

    loginWindow.modalWindowCSS = `background-color: #ffffff; border-radius: 25px; width: 350px; height: 421px; padding: 15px;`;
    loginWindow.collapsedElementCloneCSS = `background-color: #e4e4e4; display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 15px; top: 0; left: 0; transition-duration: 0.4s`;
    loginWindow.collapsedElementCloneCSSSegueAddition = `border-radius: 20px`;
    loginWindow.expandingTime = 0.4;
    loginWindow.collapsingTime = 0.4;
    loginWindow.collapsedElementCloneHidingTimeout = -0.1;
    loginWindow.BtCM = 1.2;

    loginButton.onclick = () => {
        loginWindow.modalWindowContent = `
            <div class="vertical-container" style="height: 100%">
                <div class="flex-justifyspacebetween flex-aligncenter" style="gap: 10px; width: 100%">
                    <h3>Login</h3>
                    <svg class="iconButton noButton deleteTaskButton" id="closeLoginWindow" style="transition-duration: 0.3s; cursor: pointer"></svg> 
                </div>
                <div class="vertical-container flex-justifycenter" style="gap: 10px; height: 100%">
                    <label for="email" style="font-weight: bold">Email</label>
                    <input style="border-radius: 10px" type="email" id="loginEmail" class="bobatron" Bt-CM="0.5" placeholder="Email..." required>
                    
                    <label for="password" style="font-weight: bold">Password</label>
                    <input style="border-radius: 10px" type="password" id="loginPassword" class="bobatron" Bt-CM="0.5" placeholder="Password..." required>
            
                    <button style="border-radius: 10px" class="bobatron" Bt-CM="0.5" id="loginSubmit">Login</button>
                    
                    <p style="color: red" id="loginError">&nbsp;</p>
                </div>
            </div>
        `

        loginWindow.expand()

        setTimeout(() => {
            document.getElementById("closeLoginWindow").onclick = () => {
                loginWindow.collapse();
            };

            const email = document.getElementById("loginEmail"),
                password = document.getElementById("loginPassword"),
                errorContainer = document.getElementById("loginError");

            document.getElementById("loginSubmit").onclick = async () => {
                const emailValue = email.value.trim();
                const passwordValue = password.value.trim();

                if (!emailValue || !passwordValue) {
                    errorContainer.innerHTML = "Email and password cannot be empty";
                    return;
                }

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
                    errorContainer.innerHTML = "Please enter a valid email address";
                    return;
                }

                const result = await giganote.login(emailValue, passwordValue);

                if (result.error) {
                    errorContainer.innerHTML = result.error;
                } else {
                    loginWindow.collapse();

                    setTimeout(() => {
                        menuEntrySwitch(giganote.pages.authPage, giganote.pages.loading);
                    }, 800);

                    setTimeout(() => {
                        initialize();
                    }, 1200);
                }
            };
        }, 600);

    }
}

const buildMainPage = () => {
    let tasksHTML = ``
    for (let i of giganote.tasks) {
        tasksHTML += `
                <div class="taskWrapper" id="${i._id}">
                    <div class="task flex-justifyspacebetween bobatron ${i.completed ? "completed" : "incompleted"}" id="task-${i._id}" Bt-CM="0.5">
                        <div>
                            <b>${i.title}</b>
                            <p>${i.content}</p>  
                        </div>
                        <button class="iconButton ${i.completed ? "greenMark" : "grayMark"} completionTaskButton" taskId="${i._id}" completed="${i.completed ? "true" : "false"}"></button>  
                    </div>         
                    <button class="iconButton binButton deleteTaskButton" taskId="${i._id}"></button> 
                </div>
            `
    }

    giganote.pages.mainPage.innerHTML = `
        <div class="horizontal-container flex-justifyspacebetween" style="width: 100%;">
            <div class="horizontal-container flex-aligncenter"> 
                <h3>${giganote.user.username}</h3>
                <button class="bobatron" id="newTask" Bt-CM="0.5">New task</button>
            </div>
            <div class="horizontal-container" style="justify-content: flex-end"> 
                <button class="bobatron" id="logout" Bt-CM="0.5">Logout!</button>
            </div>
        </div>
        <div class="vertical-container" style="z-index: 2">
            ${tasksHTML}
           
            <div class="taskWrapper" id="newTaskDummy" style="padding-top: 60px; transition-duration: 0.3s; opacity: 0">
                <div class="task flex-justifyspacebetween bobatron incompleted" Bt-CM="0.5">
                    <div>
                        <b id="newTaskDummyTitle"></b>
                        <p id="newTaskDummyContent"></p>  
                    </div>
                    <button class="iconButton grayMark completionTaskButton" completed="false"></button>  
                </div>         
                <button class="iconButton binButton deleteTaskButton"></button> 
            </div>
            
        </div>
    `

    document.getElementById("logout").onclick = () => {
        giganote.storage.reset()
        menuEntrySwitch(giganote.pages.mainPage, giganote.pages.loading)

        setTimeout(() => {
            initialize();
        }, 600);
    }

    const newTaskButton = document.getElementById("newTask")
    const newTaskWindow = new smoothModal("newTaskButton", newTaskButton)

    newTaskWindow.modalWindowCSS = `background-color: #ffffff; border-radius: 25px; width: 350px; height: 421px; padding: 15px;`;
    newTaskWindow.collapsedElementCloneCSS = `background-color: #e4e4e4; display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 15px; top: 0; left: 0; transition-duration: 0.4s`;
    newTaskWindow.collapsedElementCloneCSSSegueAddition = `border-radius: 20px`;
    newTaskWindow.expandingTime = 0.4;
    newTaskWindow.collapsingTime = 0.4;
    newTaskWindow.collapsedElementCloneHidingTimeout = -0.1;
    newTaskWindow.BtCM = 1.2;

    newTaskButton.onclick = () => {
        newTaskWindow.modalWindowContent = `
                <div class="vertical-container" style="height: 100%">
                    <div class="flex-justifyspacebetween flex-aligncenter" style="gap: 10px; width: 100%">
                        <h3>New Task</h3>
                        <svg class="iconButton noButton deleteTaskButton" id="closeNewTaskWindow" style="transition-duration: 0.3s; cursor: pointer"></svg> 
                    </div>
                    <div class="vertical-container flex-justifycenter" style="gap: 10px; height: 100%">
                        <label for="title" style="font-weight: bold">Title</label>
                        <input style="border-radius: 10px" type="text" id="taskTitle" class="bobatron" Bt-CM="0.5" placeholder="Enter the task title" required>
    
                        <label for="content" style="font-weight: bold;">Task Content</label>
                        <textarea style="border-radius: 10px" id="taskContent" class="bobatron" Bt-CM="0.5" placeholder="Write your task here..." rows="5" required></textarea>
                
                        <button style="border-radius: 10px" class="bobatron" Bt-CM="0.5" id="submitTask">Submit Task</button>
                    </div>
                </div>
            `;
        newTaskWindow.expand();

        setTimeout(() => {
            const submitTaskButton = document.getElementById("submitTask"),
                closeNewTaskWindow = document.getElementById("closeNewTaskWindow");

            closeNewTaskWindow.onclick = () => {
                newTaskWindow.collapse()
            }

            submitTaskButton.onclick = async () => {
                const taskTitle = document.getElementById("taskTitle"),
                    taskContent = document.getElementById("taskContent");

                let pass = true;

                if (!taskTitle.value) {
                    shakeElement(taskTitle)
                    pass *= false;
                }

                if (!taskContent.value) {
                    shakeElement(taskContent)
                    pass *= false;
                }

                if (pass) {
                    await giganote.addTask({
                        title: taskTitle.value,
                        content: taskContent.value
                    })
                    await giganote.getTasks()

                    document.getElementById("newTaskDummyTitle").innerHTML = taskTitle.value;
                    document.getElementById("newTaskDummyContent").innerHTML = taskContent.value;

                    const dummy = document.getElementById("newTaskDummy")
                    dummy.style.paddingTop = "0px";
                    dummy.style.opacity = "1";

                    newTaskWindow.collapse()

                    setTimeout(async () => {
                        buildMainPage()
                    }, 1000)
                }
            }

            //bobatron.scanner()
        }, 600)
    }

    bobatron.scanner()

    const deleteTaskButtons = document.getElementsByClassName("deleteTaskButton");
    for (let i of deleteTaskButtons) {
        i.onclick = async () => {
            await giganote.deleteTask(i.getAttribute("taskId"))
            await giganote.getTasks()

            const entry = document.getElementById(i.getAttribute("taskId"));
            entry.setAttribute("style", "z-index: -4; transition-duration: 0.3s; opacity: 0; scale: 0.7; filter: blur(10px);");

            setTimeout(() => {
                entry.style.marginTop = `-${entry.offsetHeight + 10}px`
            }, 300)

            setTimeout(() => {
                buildMainPage()
            }, 600)
        }
    }

    const completionTaskButtons = document.getElementsByClassName("completionTaskButton");
    for (let i of completionTaskButtons) {
        i.onclick = async () => {
            await giganote.patchTask(i.getAttribute("taskId"), { completed: i.getAttribute("completed") === "false" })
            await giganote.getTasks()

            const entry = document.getElementById(`task-${i.getAttribute("taskId")}`);
            entry.transitionDuration = "0.2s"
            entry.classList.remove("completed", "incompleted")
            entry.classList.add(i.getAttribute("completed") === "false" ? "completed" : "incompleted")

            i.transitionDuration = "0.2s"
            i.style.opacity = "0"
            setTimeout(() => {
                i.classList.remove("greenMark", "grayMark")
                i.classList.add(i.getAttribute("completed") === "false" ? "greenMark" : "grayMark")
                i.style.opacity = "1"
            }, 200)

            setTimeout(() => {
                buildMainPage()
            }, 600)
        }
    }
}

const initialize = async () => {
    if (!giganote.storage.data.token) {
        menuEntrySwitch(giganote.pages.loading, giganote.pages.authPage)
        buildAuthPage()
    } else {
        const authStatus = await giganote.getUser()

        if (authStatus) {
            console.log("super")
            await giganote.getTasks()
            buildMainPage()
            menuEntrySwitch(giganote.pages.loading, giganote.pages.mainPage)
        } else {
            console.log("Auth error")
            buildAuthPage()
            menuEntrySwitch(giganote.pages.loading, giganote.pages.authPage)
        }
    }
}