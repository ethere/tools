let MyPromise = (() => {
    const PromiseStatus = Symbol('PromiseStatus'),
          PromiseValue = Symbol('PromiseValue'),
          RESOLVED = Symbol('resolved'),
          PENDING = Symbol('pending'),
          REJECT = Symbol('reject'),
          changeStatus = Symbol('changeStatus'),
          thenables = Symbol('thenables'),
          catchables = Symbol('catchables'),
          settleHandle = Symbol('settleHandle'),
          linkPromise = Symbol('linkPromise');
    return class MyPromise{
        constructor(executor){
            this[PromiseValue] = undefined;
            this[PromiseStatus] = PENDING;
            this[thenables] = [];
            this[catchables] = [];
            const resolve = data=>{
               this[changeStatus](RESOLVED,data,this[thenables])
            }
            const reject = reson =>{
                this[changeStatus](REJECT,reson,this[catchables])
            }
            try{
                executor(resolve,reject);
            } catch (error) {
                reject(error)
            }
        }
        [changeStatus](newStatus,newValue,queue){
            if(this[PromiseStatus] !== PENDING){
                return;
            }
            this[PromiseStatus] = newStatus;
            this[PromiseValue] = newValue;
            queue.forEach(handler => handler(newValue));
        }
        [settleHandle](handle,immediatelyStatus,queue){
            if(typeof handle != 'function'){
                return;
            }
            if(this[PromiseStatus] ==  immediatelyStatus){
                setTimeout(() => {
                    handle(this[PromiseValue])
                }, 0);
            }else{
                queue.push(handle)
            }
        }
        [linkPromise](thenable,catchable){
            function exec(data,handler,resolve ,reject){
                try{
                    const result = handler(data);
                    if(result instanceof MyPromise){
                        result.then( d =>{
                            resolve(d)
                        },err => {
                            reject(err)
                        })
                    }else{
                        resolve(result)
                    }
                }
                catch (err){
                    reject(err)
                }
            }
            return new MyPromise((resolve,reject)=>{
                this[settleHandle](data => {
                    if(typeof thenable !== 'function'){
                        resolve(data)
                    }
                    exec(data,thenable,resolve,reject)
                },RESOLVED,this[thenables])
                this[settleHandle](reason => {
                    if(typeof catchable !== 'function'){
                        reject(data)
                    }
                    exec(reason,catchable,resolve,reject)
                },REJECT,this[catchables])
            })
        }
        then(thenable,catchable){
            return this[linkPromise](thenable,catchable)
        }
        catch(catchable){
            return this[linkPromise](undefined,catchable)
        }
        static resolve(data){
            if(data instanceof MyPromise){
                return data
            }
            return new MyPromise((resolve)=>{
                resolve(data)
            })
        }
        static reject(reason){
            return new MyPromise((resolve,reject)=>{
                reject(reason)
            })
        }
        static all(pros){
            return new MyPromise((resolve,reject)=>{
                const results =  pros.map(p => {
                    const obj = {
                        isResolved : false,
                        result : undefined
                    }
                    p.then(data=>{
                        obj.result = data;
                        obj.isResolved = true;
                        const unResolved = results.filter(r => !r.isResolved);
                        if(unResolved.length === 0){
                            resolve(results.map(r => r.result))
                        }
                    },reason =>{
                        reject(reason)
                    })
                    return obj;
                });
            })
        }
        static race(pros){
            return new MyPromise((resolve,reject)=>{
                pros.forEach(p => {
                    p.then(data=>{
                        resolve(data)
                    },err => {
                        reject(err)
                    })
                })
            })
        }


    }
})()


