// 获取当前时间
export const getCurrentDate = () => {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() +1
    let day = date.getDate()
    let hour = date.getHours(); // 时
    let minutes = date.getMinutes(); // 分
    let seconds = date.getSeconds() // 秒
    if (month >= 1 && month <= 9) {
        month = "0" + month
    }
    if (day >= 0 && day <= 9) {
        day = "0" + day
    }
    if (hour >= 0 && hour <= 9) {
        hour = "0" + hour
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds
    }
    const currentDate = year + '-' + month + '-' + day + ' ' + hour + ":" + minutes + ":" + seconds
    return currentDate    
}