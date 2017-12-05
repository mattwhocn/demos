const pageData = [
    {
        href: './views/audio/audio.html',
        title: '一款音乐播放插件'
    },{
        href: './views/base64audio/index.html',
        title: '媒体文件转base64编码'
    },{
        href: './views/c3动画/hover.html',
        title: 'c3动画'
    },{
        href: './views/circleProgressDemo/index.html',
        title: '彩色渐变的环形进度条插件'
    },{
        href: './views/click-check/index.html',
        title: '环形进度条-插件版'
    },{
        href: './views/click-demo/index.html',
        title: '环形进度条动画'
    },{
        href: './views/console.log/console.log.html',
        title: 'console.log的用法'
    },{
        href: './views/dateMonthPicker/index.html',
        title: '日期选择器'
    },{
        href: './views/Datepicker-for-Bootstrap-master/index.html',
        title: '日期选择器2'
    },{
        href: './views/drag/index.html',
        title: 'drag 交换位置'
    },{
        href: './views/input输入框/index.html',
        title: 'input输入框'
    },{
        href: './views/jQueryCalendar20160303/index.html',
        title: '日历插件Calendar'
    },{
        href: './views/js的应用/判断ie浏览器的版本.html',
        title: 'js的应用'
    },{
        href: './views/loading/index.html',
        title: 'loading'
    },{
        href: './views/lunbo/index.html',
        title: '轮播'
    }
];

window.onload = function() {
    let $listItem = '';
    for(item of pageData){
        $listItem += `<li class="catalog-item"><a href="${item.href}">${item.title}</a></li>`
    }
    document.querySelector('.catalog').innerHTML += $listItem;
};