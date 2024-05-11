const addResourcesToCache = async (resources) => {
    const cache  = await caches.open("v1")
    await cache.addAll(resources)
}





//If the request dosen't match with any thing in cache and there
// request is not in cache then the request is sent to the server
//We have to give error then
const cachesMatch = async (request, preloadedResponsePromise) => {
    const cachedResponse = await caches.match(request)
    if(cachedResponse){
        return cachedResponse
    }
    //If the request dosen't match with any thing in cache and there
// request is not in cache then the request is sent to the server
//We have to give error then
    try{
    const  preloadeResponse = await preloadedResponsePromise
    if(preloadeResponse){
        const cache = await caches.open("v1")
        await cache.put(request, preloadeResponse.clone())
        return preloadeResponse
    }
    
    // We have used cloned method on networkResponse 
    //because the response object is a stream and 
    //it can be consumed only once
    //So basically the original one is returned to the browser 
    //and a clone is stored in the cache
    const networkResponse = await fetch(request)
    const cache = await caches.open("v1")
    await cache.put(request, networkResponse.clone())
    return networkResponse
    }catch(error){
       return new Response("No Internet Connection")
    }
}


//We can use self.skipWaiting() method to skip the waiting phase and activate the new service worker immediately
self.addEventListener("install", (event) => {
    //this method is called when the service worker is installed
    //waitUntil method keeps the service worker in installing phase until the task provided to it is completed
    self.skipWaiting()
    event.waitUntil(addResourcesToCache([
        "/",
        "./index.html",
         "./app.js",
         "/contact.html",
         "/profile.html",
         "/images/contactus.png",
        "/images/profile.jpg",
        "/images/home.jpg"
    ]))
})

//this method is called when the service worker is activated
self.addEventListener("activate", (event) => {
    //Improvement when new service worker comes, and activated , I have to reload the 
//page for it to use new service worker
//Instead of doing it manually
    event.waitUntil(clients.claim().then(()=>{
        console.log("SW has claimed the clients")
    })
)
    event.waitUntil(async () => {
        // enables navigation preload
        await self.registration.navigationPreload.enable()
        //inside the cachesMatch function right before the fetch method is called
        //we can check if there is a preloaded response available for the requested resource
        // we get the preloaded response from the event object inside the fetch event if there is any
    })
})

//this method is called whenever a resource is requested from the server
self.addEventListener("fetch", (event) => { 
    event.respondWith(cachesMatch(event.request,event.preloadResponse))
})

