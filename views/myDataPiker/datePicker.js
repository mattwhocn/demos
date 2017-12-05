/**
 * Created by zhang on 2017/4/24.
 */
!function($){
    $.extend({
        datePicker:function(options){
            new DatePicker($(options.wrap),options.dates);
        }
    });

    // DatePicker 构造函数
    var DatePicker = function( parent,dataArr ){
        this.dataArr = dataArr;
        this.parent = $(parent);
        this.format = DPGlobal.parseFormat('yyyy-mm-dd');
        this.picker = $(DPGlobal.template).appendTo(parent).on('mousedown.Datepicker',$.proxy(this.mousedown, this));
        this.viewMode = 0;
        this.weekStart = 0;
        this.scroll =  true;
        this.weekEnd = 6;
        this.viewDate = new Date();
        this.fillDow();
        this.fill();
    };

    DatePicker.prototype = {
        constructor: DatePicker,
        fillDow: function(){
            var html = '<tr class="week-menu">';
            for(var i = 0; i < DPGlobal.dates.days.length; i++){
                if( i == 0 || i == 6 ){
                    html += '<th class="dow weekend">'+DPGlobal.dates.days[i]+'</th>'
                }else{
                    html += '<th class="dow">'+DPGlobal.dates.days[i]+'</th>'
                }
            }
            html += '</tr>';
            this.picker.find('.datepicker-days thead').append(html);
        },
        fill: function() {
            var d = new Date(this.viewDate),
                year = d.getFullYear(),
                month = d.getMonth();

            // 放置年月
            this.picker.find('.datepicker-days th:eq(1)')
                .text(year + "年" + DPGlobal.dates.months[month]+'月');

            var prevMonth = new Date(year, month-1, 28,0,0,0,0),
                day = DPGlobal.getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
            prevMonth.setDate(day);
            prevMonth.setDate(day - (prevMonth.getDay() + 7)%7);

            var nextMonth = new Date(prevMonth);
            nextMonth.setDate(nextMonth.getDate() + 42);

            // 循环从 prevMonth 到 nextMonth 中的每一天
            html = [];
            var clsName;
            while(prevMonth.valueOf() < nextMonth.valueOf() ) {
                // 周日 一周的开始
                if (prevMonth.getDay() == this.weekStart) {
                    html.push('<tr>');
                }
                clsName = '';
                if (prevMonth.getMonth() < month) {
                    clsName += ' old';
                } else if (prevMonth.getMonth() > month) {
                    clsName += ' new';
                }
                for(var i = 0; i < this.dataArr.length ; i ++){
                    var fMonth = DPGlobal.formatDate(prevMonth,this.format);
                    if (fMonth == this.dataArr[i]) {
                        clsName += ' active';
                    }
                }
                html.push('<td class="day'+clsName+'"><span>'+prevMonth.getDate() + '</span></td>');
                // 周六 一周的结束
                if (prevMonth.getDay() == this.weekEnd) {
                    html.push('</tr>');
                }
                prevMonth.setDate(prevMonth.getDate()+1);
            }
            this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
        },
        click:function(e) {
            e.stopPropagation();
            e.preventDefault();
        },
        mousedown: function(e) {
            e.stopPropagation();
            e.preventDefault();
            var target = $(e.target).closest('th');// closest遍历。用closest遍历实现事件委托
            if (target.length == 1) {
                switch(target[0].className) {
                    case 'prev':
                    case 'next':
                        console.log(target[0].className);
                        this.viewDate['setMonth'].call(
                            this.viewDate,
                            this.viewDate['getMonth'].call(this.viewDate) + (target[0].className == 'prev' ? -1 : 1)
                        );
                        this.fill();
                        break;
                }
            }
        }
    };

    var DPGlobal = {
        dates:{
            days: ["日", "一", "二", "三", "四", "五", "六"],
            months: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
        },
        isLeapYear: function (year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
        },
        getDaysInMonth: function (year, month) {
            return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
        },
        parseFormat: function(format){
            var separator = format.match(/[.\/-].*?/),
                parts = format.split(/\W+/);
            if (!separator || !parts || parts.length == 0){
                throw new Error("Invalid date format.");
            }
            return {separator: separator, parts: parts};
        },
        parseDate: function(date, format) {
            var today=new Date();
            if (!date) date="";
            var parts = date.split(format.separator),
                date = new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0),
                val;
            if (parts.length == format.parts.length) {
                for (var i=0, cnt = format.parts.length; i < cnt; i++) {
                    val = parseInt(parts[i], 10)||1;
                    switch(format.parts[i]) {
                        case 'dd':
                        case 'd':
                            date.setDate(val);
                            break;
                        case 'mm':
                        case 'm':
                            date.setMonth(val - 1);
                            break;
                        case 'yy':
                            date.setFullYear(2000 + val);
                            break;
                        case 'yyyy':
                            date.setFullYear(val);
                            break;
                    }
                }
            }
            return date;
        },
        formatDate: function(date, format){
            var d = date.getDate(), m = date.getMonth() + 1;
            var val = {
                dd: (d < 10 ? '0' : '') + d,
                mm: (m < 10 ? '0' : '') + m,
                yyyy: date.getFullYear()
            };
            var date = [];
            for (var i=0, cnt = format.parts.length; i < cnt; i++) {
                date.push(val[format.parts[i]]);
            }
            return date.join(format.separator);
        },
        headTemplate: '<thead>'+
            '<tr class="menu">'+
                '<th class="prev"><i class="icon-arrow-left"/></th>'+
                '<th colspan="5" class="switch"></th>'+
                '<th class="next"><i class="icon-arrow-right"/></th>'+
            '</tr>'+
        '</thead>',
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
    };
    DPGlobal.template = '<div class="datepicker dropdown-menu">'+
        '<div class="datepicker-days">'+
        '<table class=" table-condensed">'+
        DPGlobal.headTemplate+
        '<tbody></tbody>'+
        '</table>'+
        '</div>'+
        '</div>';
}(window.jQuery);
