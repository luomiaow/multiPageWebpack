import { say } from './commons'
say('这是详情吗')

new Promise(resolve => {
    setTimeout(() => {
        resolve('66666')
    }, 1000)
}).then(res => {
    console.log(res)
})