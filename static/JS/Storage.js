class Storage {
    data = {}
    cookieName = "Storage"

    constructor(cookieName, data){
        this.cookieName = cookieName

        if (!this.getCookie()) {
            console.log(`${this.cookieName}: no cookie found`)
            this.data = data
            this.save()
        } else {
            try {
                this.data = JSON.parse(this.getCookie())
            } catch (e) {
                console.log(this.getCookie())
                console.log(`${this.cookieName}: bad cookie`)
                this.cookieWrite()
            }
        }
    }

    getCookie() {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + this.cookieName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    cookieWrite() {
        document.cookie = `${this.cookieName}=${encodeURIComponent(JSON.stringify(this.data))}; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT`
    }

    save() {
        // this.data = data
        this.cookieWrite()
    }

    get data() {
        return this.data
    }

    reset() {
        document.cookie = `${this.cookieName}=${encodeURIComponent(JSON.stringify(this.data))}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        this.data = {}
        console.log(`${this.cookieName}: cookie deleted`)
    }
}
