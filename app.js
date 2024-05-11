const registerServiceWorker = async () => {
    if("serviceWorker" in navigator) {
        try {
           const registration =  await navigator.serviceWorker.register("./sw.js")
           registration.addEventListener("updatefound", () => {
            console.log("New Service Worker Found and installing", registration.installing)
           })
           if(registration.installing){
            console.log("Service Worker Installing")
           }
           else if(registration.active){
            console.log("Service Worker Active")
           }
           console.log("Service Worker Registered")
        } catch (error) {
            console.log("Service Worker Registration Failed")
        }
    }
}
registerServiceWorker()
