var IIInsomniaCityPicker = function(options){
    this.template = $('<div class="IIInsomnia-city-picker" id="IIInsomnia_city_picker"><div class="IIInsomnia-hot-wrap"><ul id="IIInsomnia_hot_city"></ul></div><div class="IIInsomnia-wrap"><p>选择省份</p><ul class="IIInsomnia-province-wrap" id="IIInsomnia_province_wrap"></ul></div></div>');
    this.hot_city = $('#IIInsomnia_hot_city', this.template);
    this.province_wrap = $('#IIInsomnia_province_wrap', this.template);
    this.settings = {
        "data": options.data,
        "target": $(options.target),
        "valType": options.valType || 'k',
        "multiple": options.multiple || false,
        "hideProvinceInput": options.hideProvinceInput ? $(options.hideProvinceInput) : false,
        "hideCityInput": options.hideCityInput ? $(options.hideCityInput) : false,
        "callback": options.callback || '',
    };
};
//点击展开列表
IIInsomniaCityPicker.prototype = {
    init: function(){
        var that = this;
        $(window).click(function(event) {
            /* Act on the event */
            that.template.remove();
        });
        that.settings.target.attr('readonly', true);
        that.targetEvent();
    },

    buildCityPicker: function(){
        var that = this;
       // that.buildHotCityTpl();
        that.buildProvinceTpl();
        that.provinceEvent();
        that.cityEvent();
        that.cleanBtnEvent();
    },
    buildProvinceTpl: function(){
        var that = this;
        var province = that.settings.data.province;
        var province_html = '';
        for(var i = 0, len = province.length; i < len; i++){
            province_html += '<li class="IIInsomnia-province" data-id="' + province[i]['id'] + '" data-name="' + province[i]['name'] + '"><ul class="IIInsomnia-city-wrap"></ul><div class="IIInsomnia-province-name">' + province[i]['name'] + '</div></li>';
        }

        province_html += '<li class="IIInsomnia-clean"><input type="button" class="IIInsomnia-clean-btn" id="IIInsomnia_clean_btn" value="清 空"></li>'

        that.province_wrap.html(province_html);
    },

    buildCityTpl: function(cur_province){
        var that = this;
        var pid = cur_province.data('id');
        var poi = cur_province.position();
        var province = that.settings.data.province;
        var city;
        var city_html = '';
        for(var i = 0, plen = province.length; i < plen; i++){
            if(province[i]['id'] == parseInt(pid)){
                city = province[i]['city'];
                break;
            }
        }
        for(var j = 0, clen = city.length; j < clen; j++){
            city_html += '<li class="IIInsomnia-city" data-id="' + city[j]['id'] + '" data-name="' + city[j]['name'] + '" title="' + city[j]['name'] + '">' + city[j]['name'] + '</li>';
        }

        cur_province.find('.IIInsomnia-city-wrap').html(city_html).css('left', '-' + (poi.left - 37) + 'px').show();
    },

    provinceEvent: function(){
        var that = this;
        that.province_wrap.on('click', '.IIInsomnia-province', function(event){
            event.preventDefault();
            event.stopPropagation();
            /* Act on the event */
            var _this = $(this);

            if(!_this.hasClass('active')){
                that.province_wrap.find('.IIInsomnia-province').removeClass('active');
                that.province_wrap.find('.IIInsomnia-province-name').removeClass('active');
                that.province_wrap.find('.IIInsomnia-city-wrap').hide().children().remove();

                _this.addClass('active');
                _this.find('.IIInsomnia-province-name').addClass('active');

                that.buildCityTpl(_this);
            }else{
                _this.removeClass('active');
                _this.find('.IIInsomnia-province-name').removeClass('active');

                _this.find('.IIInsomnia-city-wrap').hide().children().remove();
            }

            return false;
        });
    },
    cityEvent: function(){
        var that = this;

        that.hot_city.on('click', '.IIInsomnia-hot-city', function(event) {
            event.preventDefault();
            event.stopPropagation();
            /* Act on the event */
            var _this = $(this);

            var cid = _this.data('id');
            var cname = _this.data('name');
            
            that.settings.target.val(cname);

            if(that.settings.hideCityInput){
                if(that.settings.valType == 'k-v'){
                    that.settings.hideCityInput.val(cid + '-' + cname);
                }else{
                    that.settings.hideCityInput.val(cid);
                }
            }

            if(that.settings.hideProvinceInput){
                var pid = _this.data('pid');
                var pname = _this.data('pname');
                if(that.settings.valType == 'k-v'){
                    that.settings.hideProvinceInput.val(pid + '-' + pname);
                }else{
                    that.settings.hideProvinceInput.val(pid);
                }
            }

            that.template.remove();

            if(that.settings.callback) that.settings.callback(cid);

            return false;
        });

        that.province_wrap.on('click', '.IIInsomnia-city', function(event) {
            event.preventDefault();
            event.stopPropagation();
            /* Act on the event */
            var _this = $(this);

            var cid = _this.data('id');
            var cname = _this.data('name');

            that.settings.target.val(cname);

            if(that.settings.hideCityInput){
                if(that.settings.valType == 'k-v'){
                    that.settings.hideCityInput.val(cid + '-' + cname);
                }else{
                    that.settings.hideCityInput.val(cid);
                }
            }

            if(that.settings.hideProvinceInput){
                var pele = _this.parent().parent();
                var pid = pele.data('id');
                var pname = pele.data('name');
                if(that.settings.valType == 'k-v'){
                    that.settings.hideProvinceInput.val(pid + '-' + pname);
                }else{
                    that.settings.hideProvinceInput.val(pid);
                }
            }

            that.template.remove();

            if(that.settings.callback) that.settings.callback(cid);

            return false;
        });
    },

    cleanBtnEvent: function(){
        var that = this;
        that.province_wrap.on('click', '#IIInsomnia_clean_btn', function(event){
            event.preventDefault();
            event.stopPropagation();
            /* Act on the event */
            that.settings.target.val('');
            if(that.settings.hideProvinceInput){
                that.settings.hideProvinceInput.val('');
            }

            if(that.settings.hideCityInput){
                that.settings.hideCityInput.val('');
            }

            that.template.remove();

            if(that.settings.callback) that.settings.callback(0);

            return false;
        });
    },

    targetEvent: function(){
        var that = this;
        that.settings.target.click(function(event){
            event.stopPropagation();
            /* Act on the event */
            var _this = $(this);
            that.buildCityPicker();
            var offset = _this.offset();
            var top = offset.top + _this.outerHeight() + 15;

            that.template.css({
                'left': offset.left,
                'top': top
            });

            $('body').append(that.template);

            return false;
        });
    }
};

var cityPicker = new IIInsomniaCityPicker({
        data: cityData,
        target: '#cityChoiceT',
        valType: 'k-v',
        hideCityInput: '#city',
        hideProvinceInput: '#province',
        callback: function(city_id_name){
            }
    });
    cityPicker.init();
var cityPickerTwo = new IIInsomniaCityPicker({
        data: cityData,
        target: '#destination',
        valType: 'k-v',
        hideCityInput: '#city',
        hideProvinceInput: '#province',
        callback: function(city_id_name){
            search();
            }
    });
    cityPickerTwo.init();