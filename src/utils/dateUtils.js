/*将日期格式化*/
export function formatDate(time) {
    if (!time) return ''
    let date = new Date(time);
    const month=date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1;
    const date1=date.getDate()<10?'0'+date.getDate():date.getDate();
    const hours=date.getHours()<10?'0'+date.getHours():date.getHours();
    const minute=date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
    const second=date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
    return date.getFullYear() + '-' + month + '-' + date1
        + ' ' + hours + ':' +minute + ':' + second

}