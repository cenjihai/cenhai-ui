import {defineStore} from 'pinia'

export const useAppStore = defineStore({
    id: 'app',
    state: () => {
        return {
            routerAlive: true,
            cacheView: []
        }
    },
    actions:{
        removeCache(key){
            Array.prototype.remove = function(val) {
                let index = this.indexOf(val);
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
            this.cacheView.remove(key);
        },
        removeCacheByFullPath(path){
            let arr = path.split("/")
            this.removeCache(arr[arr.length -1])
        },
        addCache(val){
            if (val){
                this.cacheView.push(val);
            }
        }
    }
})