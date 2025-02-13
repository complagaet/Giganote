class BobatronDynamic {
    name = String

    constructor(name) {
        this.name = name;
    }

    static extractDimensions(cssString) {
        const widthMatch = cssString.match(/width:\s*(\d+)px/);
        const heightMatch = cssString.match(/height:\s*(\d+)px/);

        const width = widthMatch ? parseInt(widthMatch[1]) : null;
        const height = heightMatch ? parseInt(heightMatch[1]) : null;

        return [width, height];
    }
}

class smoothModal extends BobatronDynamic {
    collapsedElement; // Original Collapsed Element
    collapsedElementClone; // Cloned Collapsed Element (Creates automatically)
    collapsedElementCloneCSS; // Addition CSS if cloned layout is broken
    collapsedElementCloneCSSSegueAddition
    modalWindow; // Modal Window Object
    modalWindowContent; // Modal Window Content in HTML String format
    modalWindowCSS = "height: 600px; width: 800px"; // Addition CSS to Modal Window
    modalScreen; // Wrapper

    escCollapse = true

    collapsedElementCloneHidingTimeout = 0;
    expandingTime = 0.5;
    collapsingTime = 0.5;

    zIndex = 9;

    copyClassesFromCollapsedElementToItsClone = true;
    forbiddenClassesToCopy = ["clickable"]

    modalWindowBobatronize = true
    BtCM = 1.5

    constructor(name, collapsedElement) {
        super(name);
        this.collapsedElement = collapsedElement

        if (document.getElementById(`BobatronModal_${name}`)) {
            document.getElementById(`BobatronModal_${name}`).remove()
        }

        this.modalScreen = document.createElement("div");
        this.modalScreen.id = `BobatronModal_${name}`;
        this.modalScreen.style.cssText = `
            z-index: ${this.zIndex};
            position: fixed;
            top: 0;
            left: 0;
            padding: 20px;
        `
        document.getElementsByTagName("body")[0].appendChild(this.modalScreen);
    }

    cloneCollapsedElement() {
        let collapsedElementParams = this.collapsedElement.getBoundingClientRect()

        let modalWindow = document.createElement("div");
        modalWindow.style.cssText = `
            position: absolute;
            transition-duration: 0.3s;
            clip-path: inset(0px 0px);
        `
        modalWindow.style.cssText += this.modalWindowCSS
        // Copying HW and Top/Left properties
        modalWindow.style.top = `${collapsedElementParams.top}px`;
        modalWindow.style.left = `${collapsedElementParams.left}px`;
        modalWindow.style.width = `${collapsedElementParams.width}px`;
        modalWindow.style.height = `${collapsedElementParams.height}px`;

        // Making visual copy of collapsedElement
        let collapsedElementClone = document.createElement("div");
        collapsedElementClone.style.cssText += `
            height: 100%;
            width: 100%;
            position: absolute;
            transition-duration: 1s;
            z-index: ${this.zIndex};
        `
        collapsedElementClone.style.cssText += this.collapsedElementCloneCSS
        collapsedElementClone.innerHTML = this.collapsedElement.innerHTML;

        if (this.copyClassesFromCollapsedElementToItsClone) {
            for (let i of String(this.collapsedElement.classList).split(' ')) {
                if (!this.forbiddenClassesToCopy.includes(i)) {
                    try {
                        collapsedElementClone.classList.add(i)
                    } catch (e) {
                        console.log(`[BobatronDynamic] no classes in ${this.name}`)
                    }
                }
            }
        }

        this.collapsedElementClone = collapsedElementClone
        modalWindow.appendChild(collapsedElementClone);

        this.modalScreen.style.cssText += `
            height: 100%;
            width: 100%;
        `

        this.modalWindow = modalWindow
        this.modalScreen.appendChild(modalWindow)
    }

    insertModalWindowContent() {
        if (!document.getElementById(`BobatronModal_ModalWindowContent_${name}`)) {
            let modalWindowContent = document.createElement("div");
            modalWindowContent.style.cssText += `
                height: 100%;
                width: 100%;
            `
            modalWindowContent.id = `BobatronModal_ModalWindowContent_${name}`;
            this.modalWindow.appendChild(modalWindowContent)
        }
        document.getElementById(`BobatronModal_ModalWindowContent_${name}`).innerHTML = this.modalWindowContent
    }

    modalExpand() {
        let modalScreenParams = this.modalScreen.getBoundingClientRect()

        this.modalWindow.style.cssText = `
            position: absolute;
            transition-duration: ${this.expandingTime}s;
            clip-path: inset(0px 0px);
            ${this.modalWindowCSS};
        `

        if (
            parseFloat(this.modalWindow.style.width) >
            (
                modalScreenParams.width - (parseFloat(this.modalScreen.style.paddingLeft +
                    parseFloat(this.modalScreen.style.paddingRight)))
            )
        ) {
            this.modalWindow.style.width = `
                ${modalScreenParams.width - (parseFloat(this.modalScreen.style.paddingLeft) + 
                parseFloat(this.modalScreen.style.paddingRight))}px
            `;
        }

        if (
            parseFloat(this.modalWindow.style.height) >
            (
                modalScreenParams.height - (parseFloat(this.modalScreen.style.paddingTop +
                    parseFloat(this.modalScreen.style.paddingBottom)))
            )
        ) {
            this.modalWindow.style.height = `
                ${modalScreenParams.height - (parseFloat(this.modalScreen.style.paddingTop) +
                parseFloat(this.modalScreen.style.paddingBottom))}px
            `;
        }

        this.modalWindow.style.left = `${(modalScreenParams.width / 2) - (parseFloat(this.modalWindow.style.width) / 2)}px`
        this.modalWindow.style.top = `${(modalScreenParams.height / 2) - (parseFloat(this.modalWindow.style.height) / 2)}px`

        this.collapsedElementClone.style.cssText += this.collapsedElementCloneCSSSegueAddition

        this.insertModalWindowContent()

        setTimeout(() => {
            if (this.modalWindowBobatronize) {
                bobatron.toCSSmask(bobatron.moveXY(this.modalWindow.offsetWidth, this.modalWindow.offsetHeight, this.BtCM), this.modalWindow);
            }
        }, this.expandingTime * 1000 + 1)


        setTimeout(() => {
            this.collapsedElementClone.style.opacity = `0`

            if (this.escCollapse) {
                let escCollapse = (ev) => {
                    if (ev.key === "Escape") {
                        this.collapse();
                        document.removeEventListener("keydown", escCollapse)
                    }
                }
                document.addEventListener("keydown", escCollapse)
            }
        }, (this.expandingTime * 1000) + (this.collapsedElementCloneHidingTimeout * 1000))

        setTimeout(() => {
            this.collapsedElementClone.style.display = `none`
        }, (this.expandingTime * 1000) + (this.collapsedElementCloneHidingTimeout * 1000) +  (parseFloat(this.collapsedElementClone.style.transitionDuration) * 1000))
    }

    expand() {
        this.collapsedElement.style.visibility = "hidden"
        this.collapsedElement.style.opacity = "0"
        this.collapsedElement.style.pointerEvents = "none"

        this.modalScreen.style.display = 'block'
        this.modalScreen.style.transitionDuration = '0.5s'

        this.cloneCollapsedElement()
        setTimeout(() => {
            this.modalExpand()
            this.modalScreen.style.backgroundColor = "#00000088"
        }, 100)
    }

    collapse() {
        this.collapsedElementClone.style.display = `flex`

        setTimeout(() => {
            this.collapsedElementClone.style.opacity = `1`
        }, 2)

        setTimeout(() => {
            let collapsedElementParams = this.collapsedElement.getBoundingClientRect()
            this.modalWindow.style.cssText = `
                position: absolute;
                top: ${collapsedElementParams.top}px;
                left: ${collapsedElementParams.left}px;
                width: ${collapsedElementParams.width}px !important;
                height: ${collapsedElementParams.height}px !important;
                transition-duration: ${this.collapsingTime}s;
                clip-path: inset(0px 0px);
            `

            this.collapsedElementClone.style.cssText += `
                ${this.collapsedElementCloneCSS};
                transition-duration: 1s;
            `

            this.modalScreen.style.backgroundColor = ""
            this.modalWindow.style.cssText += this.modalWindowCSS
        }, parseFloat(this.collapsedElementClone.style.transitionDuration) * 500)

        this.collapsedElement.style.opacity = "1"
        this.collapsedElement.style.pointerEvents = ""

        setTimeout(() => {
            this.collapsedElement.style.visibility = ""
        }, (parseFloat(this.collapsedElementClone.style.transitionDuration) * 1000) + (this.collapsingTime * 1000) + 1)

        setTimeout(() => {
            this.modalScreen.style.display = "none"
            this.modalScreen.innerHTML = ""
        }, (parseFloat(this.collapsedElementClone.style.transitionDuration) * 1000) + (this.collapsingTime * 1000) + 20)
    }
}

/*window.addEventListener("load", () => {
    console.log("BobatronDynamic");

    for (let btn of document.querySelectorAll("button")) {
        console.log(btn);
        let pelmeni = new smoothModal("pelmeni", btn)
        pelmeni.modalWindowContent = `
            <div class="flex" style="gap: 10px">
                <div class="iconContainer" style="background-color: #f9f8ff">
                    <svg class="iconSneaker"></svg>
                </div>
                <div class="flex-column" style="gap: 10px; width: 100%">
                    <p>Add information about your steps today. This information will be used to calculate calories burned.</p>
                    <button id="__close">Close</button>
                </div>
            </div>
        `
        pelmeni.modalWindowCSS = `background-color: white; border-radius: 40px; width: 500px; height: 700px; padding: 20px`;
        pelmeni.collapsedElementCloneCSS = `display: flex; align-items: center; justify-content: center; border-radius: 15px; top: 0; left: 0;`
        pelmeni.collapsedElementCloneCSSSegueAddition = `border-radius: 40px`
        pelmeni.expandingTime = 0.4
        pelmeni.collapsingTime = 0.4
        pelmeni.collapsedElementHidingTimeout = -0.1

        btn.onclick = () => {
            pelmeni.expand()

            setTimeout(() => {
                document.getElementById("__close").onclick = () => {pelmeni.collapse()}
            }, 1000)
        }
    }
});*/
